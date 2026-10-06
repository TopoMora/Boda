/**
 * storage.js
 * ---------------------------------------------------------------
 * Capa de almacenamiento del álbum de boda.
 *
 *   - Las FOTOS se guardan en Google Drive (a través de un Google
 *     Apps Script que actúa de puente, ver /apps-script/Code.gs).
 *   - Los DATOS del álbum (url de cada foto, etiquetas, autor,
 *     fecha) se guardan en Firebase Firestore, que además avisa en
 *     tiempo real a todos los dispositivos cuando hay fotos nuevas.
 *
 * Todo el resto de la web (Portada.jsx, Galeria.jsx) solo habla con
 * este archivo a través de estas funciones:
 *
 *   WeddingStorage.addPhoto(file, tags, autor)   -> sube una foto
 *   WeddingStorage.getPhotos()                   -> trae las fotos (una vez)
 *   WeddingStorage.onPhotosChange(callback)       -> escucha cambios en vivo
 *   WeddingStorage.getAllTags()                   -> etiquetas usadas
 *   WeddingStorage.deletePhoto(id, driveId)        -> borra una foto
 *
 * Necesita que js/config.js se haya cargado antes (define
 * window.db y window.APPS_SCRIPT_URL).
 * ---------------------------------------------------------------
 */

const WeddingStorage = (() => {
  const COLECCION = "fotos";

  // Redimensiona/comprime la imagen en el propio navegador antes de
  // subirla, para no mandar fotos de 12 megapíxeles directas del móvil.
  function comprimirImagen(file, maxAncho = 1600, calidad = 0.8) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const lector = new FileReader();

      lector.onload = (e) => {
        img.onload = () => {
          const escala = Math.min(1, maxAncho / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = img.width * escala;
          canvas.height = img.height * escala;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", calidad);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      lector.onerror = reject;
      lector.readAsDataURL(file);
    });
  }

  function blobABase64(blob) {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => resolve(lector.result.split(",")[1]);
      lector.onerror = reject;
      lector.readAsDataURL(blob);
    });
  }

  // Sube el blob ya comprimido a Drive a través del Apps Script.
  // Ojo: el Content-Type "text/plain" es a propósito — con
  // "application/json" el navegador lanza una petición OPTIONS de
  // verificación (preflight) que Apps Script no sabe responder, y la
  // subida fallaría por CORS.
  async function subirADrive(blob, filename) {
    const base64 = await blobABase64(blob);
    const res = await fetch(window.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret: window.UPLOAD_SECRET,
        base64,
        mimeType: "image/jpeg",
        filename,
      }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Error al subir la foto a Drive");
    return data; // { id, url }
  }

  async function addPhoto(file, tags = [], autor = "") {
    const blob = await comprimirImagen(file);
    const filename = `boda-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;

    const { id: driveId, url } = await subirADrive(blob, filename);

    const docRef = await window.db.collection(COLECCION).add({
      driveId,
      url,
      tags,
      autor,
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
    });

    return { id: docRef.id, driveId, url, tags, autor, fecha: new Date().toISOString() };
  }

  function mapDoc(doc) {
    const d = doc.data();
    return {
      id: doc.id,
      driveId: d.driveId,
      url: d.url,
      tags: d.tags || [],
      autor: d.autor || "",
      fecha: d.fecha && d.fecha.toDate ? d.fecha.toDate().toISOString() : new Date().toISOString(),
    };
  }

  async function getPhotos() {
    const snap = await window.db.collection(COLECCION).orderBy("fecha", "desc").get();
    return snap.docs.map(mapDoc);
  }

  // Se suscribe a los cambios del álbum en tiempo real. Devuelve una
  // función para cancelar la suscripción (llamarla al desmontar).
  function onPhotosChange(callback) {
    return window.db
      .collection(COLECCION)
      .orderBy("fecha", "desc")
      .onSnapshot(
        (snap) => callback(snap.docs.map(mapDoc)),
        (err) => console.error("Error escuchando el álbum:", err)
      );
  }

  async function getAllTags() {
    const fotos = await getPhotos();
    const set = new Set();
    fotos.forEach((f) => (f.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }

  async function deletePhoto(id, driveId) {
    if (driveId) {
      try {
        await fetch(window.APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            secret: window.UPLOAD_SECRET,
            action: "delete",
            fileId: driveId,
          }),
        });
      } catch (err) {
        console.warn("No se pudo borrar el archivo de Drive (se borrará igual el registro):", err);
      }
    }
    await window.db.collection(COLECCION).doc(id).delete();
  }

  return { addPhoto, getPhotos, onPhotosChange, getAllTags, deletePhoto };
})();