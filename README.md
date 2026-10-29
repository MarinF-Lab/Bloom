# Bloom Pastelería

Tienda pública y app de gestión de Bloom, pastelería casera en Retiro.

- **Tienda** (la página principal): catálogo, caja dulce con despacho y abono del 50 %, "Arma tu torta", packs, encargos y preguntas frecuentes. Los pedidos llegan por WhatsApp.
- **App de gestión** (`#gestion`, y lo que abre la app de Android): pedidos del día con cupos, agenda, catálogo, recetas con costo y margen, clientes, insumos y resumen. Los pedidos, la agenda y las cifras son de ejemplo.

## Comandos

- `npm run dev`: abre la app para trabajar (`http://localhost:5173`, gestión en `/#gestion`).
- `npm test`: pruebas de la lógica (`src/core`).
- `npm run build`: compila un solo HTML en `dist/`.
- `npm run artifact`: compila un solo HTML en `artifact/index.html`, listo para publicar como artefacto.

## Fotos de los productos

Igual que en la tienda [Shop](https://github.com/MarinF-Lab/Shop): en la app de gestión, **Catálogo → Entrar con Google**, y cada producto tiene **Subir foto**. La foto se achica en el teléfono (lado mayor 800 px, JPG) y se guarda en Firestore, sin Firebase Storage, en `tiendas/{uid}/fotos/bloom-{id}`. La tienda encuentra a la dueña con la dirección corta `enlaces/bloom` y muestra la foto en lugar del dibujo.

Usa el mismo proyecto de Firebase y las mismas reglas que Shop. Para que funcione en GitHub Pages, el dominio `marinf-lab.github.io` debe estar en **Firebase → Authentication → Settings → Authorized domains**.

En la app de Android Google no deja iniciar sesión, así que ahí el botón abre la gestión en el navegador.

## Publicación

- **Web**: el workflow `pages.yml` publica `main` en GitHub Pages. Activar una vez en **Settings → Pages → Source: GitHub Actions**. Queda en `https://marinf-lab.github.io/Bloom/`.
- **Android**: el workflow `android.yml` arma el APK en cada cambio a `main`. El último siempre está en [releases/latest/download/bloom.apk](https://github.com/MarinF-Lab/Bloom/releases/latest/download/bloom.apk). Va firmado con una firma de prueba (`android/app/bloom-debug.p12`) para que cada versión se instale encima de la anterior; no sirve para Google Play.

## Dónde se cambia cada cosa

- Productos y precios: `src/data/productos.ts`.
- Aviso de temporada, zonas de despacho, packs y preguntas: `src/data/tienda.ts` (`TEMPORADA = "Ninguna"` oculta el aviso).
- WhatsApp e Instagram: `src/data/tienda.ts`.
- Datos de ejemplo de la gestión: `src/data/gestion.ts`.
