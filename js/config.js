/**
 * config.js
 * ---------------------------------------------------------------
 * Único archivo que necesitas rellenar con vuestros datos reales.
 * Ver README.md para dónde sacar cada valor paso a paso.
 * ---------------------------------------------------------------
 */

// 1) Firebase: Consola de Firebase > ⚙️ Configuración del proyecto
//    > "Tus apps" > app web > "Config"
const firebaseConfig = {
    apiKey: "AIzaSyBYSakfZE_8xz9gYwZhSi-YG2tjcVcJEQY",
    authDomain: "album-de-fotos-807ef.firebaseapp.com",
    projectId: "album-de-fotos-807ef",
    storageBucket: "album-de-fotos-807ef.firebasestorage.app",
    messagingSenderId: "372547348029",
    appId: "1:372547348029:web:c0269741db679df5aaec54"
  };

// 2) Google Apps Script: la URL que te da el paso
//    "Implementar > Nueva implementación > Aplicación web"
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrpE4QeDTBzEwTKdBGPzl-iV0qDsYZ4TAtc1YTUqSqWXLrnuEpGieNnIlJ3kxQRIPH/exec";

const UPLOAD_SECRET = "Boda-C-M-10oct26";

// --------- No hace falta tocar nada a partir de aquí ---------
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
window.APPS_SCRIPT_URL = APPS_SCRIPT_URL;
window.UPLOAD_SECRET = UPLOAD_SECRET;
