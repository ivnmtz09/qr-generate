# RUIDO QR

Generador de códigos QR con estética maximalista, construido con React y Vite.

## Qué hace

- Convierte cualquier enlace en un código QR escaneable.
- Permite ajustar el tamaño de salida entre 256 y 1600 px.
- Ofrece 16 tintas oscuras de alto contraste.
- Descarga el resultado en **PNG** o **SVG**.
- Genera todo del lado del cliente: el link no se envía a ningún servidor.
- Es responsive para escritorio, laptop, tablet y celular.

## Stack

- React 19
- Vite
- [`qrcode`](https://www.npmjs.com/package/qrcode) para la matriz y la exportación
- CSS propio, sin frameworks de UI

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Estructura

```text
src/
├── components/
│   ├── Generator.jsx   # Formulario, preview en vivo y descargas
│   └── Icons.jsx       # Iconografía SVG
├── data/
│   └── colors.js       # Las 16 tintas disponibles
├── App.jsx             # Hero, proceso y footer
├── App.css             # Sistema visual y responsive
├── index.css           # Reset, tokens y estilos base
└── main.jsx
```

Hecho para que un link haga ruido.
