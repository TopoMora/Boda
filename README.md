# Álbum de boda — Elena & Mateo (React + Tailwind)

Versión rediseñada con **React**, **Tailwind CSS** y JS puro, siguiendo la paleta y tipografía de la referencia de caligrafía (papel pergamino + tinta verde oscuro + script a pincel).

## Sin instalación, sin build

A propósito, para que la web no se vuelva pesada, no hay `npm install` ni bundler. React, Tailwind y Babel se cargan por CDN directamente en el HTML:

- `https://cdn.tailwindcss.com` → Tailwind Play CDN
- `react` / `react-dom` (UMD) → CDN de unpkg
- `@babel/standalone` → transpila el JSX del navegador al vuelo

Esto significa que puedes seguir abriendo el proyecto con **Live Server** en VSCode exactamente igual que antes, sin pasos extra. Eso sí: necesita conexión a internet para cargar esos scripts (algo normal para un sitio real, pero ten en cuenta si pruebas totalmente offline).

## Estructura

```
index.html        → Portada: nav, hero, sección QR, formulario de subida
galeria.html       → Álbum en página aparte, con filtro por etiquetas
js/storage.js      → Capa de almacenamiento (igual que antes, ver abajo)
js/icons.js        → Iconos SVG propios en componentes React (sin librería de iconos)
js/Portada.jsx      → Componentes de la portada
js/Galeria.jsx      → Componentes de la galería
```

## Paleta y tipografía (extraídas de tu referencia)

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#EEE7D4` | Fondo general (pergamino) |
| `paperdeep` | `#E4DAC0` | Tarjetas |
| `ink` | `#2B362A` | Texto, botones principales |
| `gold` | `#A9884F` | Acentos, líneas, chips activos |

Tipografías: **Alex Brush** (script, para nombres y títulos de sección) + **Jost** (texto general). Ambas de Google Fonts, cargadas en el `<head>`.

Los tokens de color están definidos en `tailwind.config` dentro de cada HTML — para cambiar la paleta, edítalos ahí (aparece igual en `index.html` y `galeria.html`, mantenlos sincronizados).

## Código QR

Ya no se usa ninguna librería de QR: se genera con una imagen desde una API pública (`api.qrserver.com`), apuntando siempre a la URL actual de la página. En cuanto publiquéis la web en su dirección definitiva, el QR apuntará ahí automáticamente.

## Almacenamiento: Google Drive + Firebase

Las fotos ahora se guardan de verdad, compartidas entre todos los invitados:

- **Las fotos** (los archivos de imagen) se guardan en una carpeta de **Google Drive**, a través de un pequeño puente hecho con **Google Apps Script** (gratis, sin servidor propio).
- **Los datos del álbum** (la URL de cada foto, sus etiquetas, quién la subió, cuándo) se guardan en **Firebase Firestore**, que además avisa en tiempo real a todos los navegadores conectados — así la galería se actualiza sola en cuanto alguien sube una foto, sin recargar la página.

Hay que configurar las dos partes una sola vez. Se tarda unos 15-20 minutos.

### 1) Carpeta de Google Drive

1. En el Drive del cliente, crea una carpeta, por ejemplo **"Fotos boda Elena y Mateo"**.
2. Ábrela y copia el ID de la URL: `https://drive.google.com/drive/folders/`**`ESTE_TROZO_ES_EL_ID`**

### 2) Google Apps Script (el puente hacia Drive)

1. Ve a [script.google.com](https://script.google.com) (con la cuenta de Google del cliente) → **Nuevo proyecto**.
2. Borra el contenido de `Code.gs` y pega el contenido de **`apps-script/Code.gs`** de este proyecto.
3. Reemplaza `PON_AQUI_EL_ID_DE_TU_CARPETA_DE_DRIVE` por el ID que copiaste en el paso 1.
4. Guarda (icono de disquete).
5. **Implementar → Nueva implementación** → tipo de implementación: **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Dale a Implementar. La primera vez pedirá autorizar permisos sobre tu Drive — acéptalos (es tu propio script, es normal que lo pida).
7. Copia la **URL de la aplicación web** que te da (termina en `/exec`).

### 3) Firebase (la base de datos del álbum)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) → **Agregar proyecto** (puede ser cualquier cuenta de Google, no hace falta que sea la misma del Drive).
2. Dentro del proyecto: **Compilación → Firestore Database → Crear base de datos**. Elige **modo de producción** y la región más cercana.
3. Ve a **Reglas** dentro de Firestore y pega esto (permite que cualquiera con el link suba y vea fotos, pero no pueda tocar nada raro — pensado para un evento corto de pocos días):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /fotos/{photoId} {
         allow read: if true;
         allow create: if true;
         allow delete: if true;
         allow update: if false;
       }
     }
   }
   ```

4. Ve a **⚙️ Configuración del proyecto → Tus apps → 🌐 (Agregar app web)**. Ponle un nombre y copia el objeto `firebaseConfig` que te muestra.

### 4) Rellenar `js/config.js`

Abre `js/config.js` y pega ahí:
- El `firebaseConfig` del paso 3.
- La `APPS_SCRIPT_URL` del paso 2.

Guarda, recarga con Live Server, y ya está: las fotos subidas desde cualquier móvil aparecerán en la galería de todos los dispositivos en tiempo real.

### Notas

- Como los invitados no inician sesión, cualquiera con el link puede subir o borrar fotos del álbum — normal y asumible para un evento de 3 días, pero no uses esta configuración para algo permanente sin añadir autenticación.
- Borrar una foto desde la galería borra tanto el registro en Firestore como el archivo real en Drive.
- El plan gratuito de Firebase (Spark) y las cuotas gratuitas de Apps Script sobran de largo para el tráfico de una boda de 2-3 días.

## Foto de fondo de la portada

El hero tiene una foto de fondo apenas visible que se revela al pasar el cursor por encima (`img/hero.jpg`). Ahora mismo hay una imagen de **relleno** (un degradado abstracto con la paleta del sitio) para que veas el efecto funcionando — sustitúyela por vuestra foto real con el mismo nombre y ruta: `img/hero.jpg`.

**Formato recomendado:** JPG (o WebP si quieres algo más ligero; todos los navegadores actuales lo soportan). No hace falta PNG, ya que es una fotografía, no un gráfico con transparencia.

**Dimensiones recomendadas:**
- Orientación horizontal (landscape), relación de aspecto entre 16:9 y 3:2.
- Ancho mínimo **1920 px**, idealmente **2400 px** de ancho para que se vea nítida también en pantallas retina (móviles y portátiles modernos).
- Peso final objetivo: **200–400 KB** tras comprimir. Con calidad JPG al 75-80% suele bastar.
- Elige una foto donde la pareja o el punto de interés quede más o menos centrado — la imagen se recorta automáticamente (`object-cover`) para llenar todo el ancho de la pantalla, así que los bordes son lo primero que se pierde en móvil.

**Para comprimir/convertir:** [squoosh.app](https://squoosh.app) (gratis, sin subir a ningún servidor, puedes exportar directamente a WebP o JPG optimizado).

Si el nombre o formato de archivo cambia, actualiza la ruta `src="img/hero.jpg"` dentro de `Hero()` en `js/Portada.jsx`.

## Personalizar

- Nombres, fecha, lugar → dentro de `Hero()` en `js/Portada.jsx`.
- Etiquetas sugeridas por defecto → `ETIQUETAS_SUGERIDAS` en `js/Portada.jsx`.
- Colores/tipografía → `tailwind.config` en `index.html` y `galeria.html`.
