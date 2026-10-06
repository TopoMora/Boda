# Álbum de boda — Camila & Michael (React + Tailwind)

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

### Notas

- Como los invitados no inician sesión, cualquiera con el link puede subir o borrar fotos del álbum — normal y asumible para un evento de 3 días, pero no uses esta configuración para algo permanente sin añadir autenticación.
- Borrar una foto desde la galería borra tanto el registro en Firestore como el archivo real en Drive.
- El plan gratuito de Firebase (Spark) y las cuotas gratuitas de Apps Script sobran de largo para el tráfico de una boda de 2-3 días.

## Personalizar

- Nombres, fecha, lugar → dentro de `Hero()` en `js/Portada.jsx`.
- Etiquetas sugeridas por defecto → `ETIQUETAS_SUGERIDAS` en `js/Portada.jsx`.
- Colores/tipografía → `tailwind.config` en `index.html` y `galeria.html`.
