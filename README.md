# Bloom Pastelería

Tienda pública y app de gestión de Bloom, pastelería casera en Retiro.

- **Tienda** (la página principal): catálogo, caja dulce con despacho y abono, "Arma tu torta", packs, encargos y preguntas frecuentes. Los pedidos llegan a la gestión y por WhatsApp.
- **App de gestión** ([`/gestion/`](https://marinf-lab.github.io/Bloom/gestion/), solo para la dueña): pedidos con cupos, agenda, catálogo, recetas con costo y margen, clientes, insumos, resumen y **Configuración** de la tienda.

## Comandos

- `npm run dev`: abre la app para trabajar (`http://localhost:5173`; gestión en `/?gestion`, o `/?gestion&prueba` con datos de prueba).
- `npm test`: pruebas de la lógica (`src/core`).
- `npm run build`: compila un solo HTML en `dist/`.
- `npm run artifact`: compila un solo HTML en `artifact/index.html`, listo para publicar como artefacto.

## Cuenta, datos y Configuración

La gestión es **solo para la dueña de Bloom** y se abre con **Entrar con Google** usando la cuenta **`bloompasteleriacl@gmail.com`**. Cualquier otra cuenta ve "Esta gestión es solo para la dueña de Bloom" y queda fuera. Las reglas de Firestore lo hacen cumplir (correo verificado por Google): ninguna otra cuenta puede leer ni crear datos. La tienda no tiene enlaces a la gestión y `/gestion/` no aparece en buscadores.

**Para cambiar de dueña:** cambiar el correo en `firestore.rules` y en `src/store/firebase.ts` (`CORREO_DUENA`), publicar las reglas y entrar con la cuenta nueva.

Todo queda en Firestore, en el proyecto `bloom-522eb`, bajo `tiendas/{uid}`:

| Dónde | Qué | Quién lo ve |
|---|---|---|
| `publico/tienda` | Configuración: nombre, bienvenida, WhatsApp, Instagram, horario, ubicación, zonas de despacho, despacho gratis, tienda abierta, anticipación, abono, cupos por día y temporada | Público (la tienda) |
| `catalogo/` | Productos: nombre, precio, tamaño, categoría, etiquetas, descripción, disponible | Público |
| `fotos/` | Fotos de productos, achicadas en el teléfono (800 px, JPG), como en [Shop](https://github.com/MarinF-Lab/Shop) | Público |
| `pedidos/` | Pedidos propios y los que llegan de la tienda (**Nuevo · tienda**, para confirmar o rechazar) | Solo la dueña; la tienda solo puede crear |
| `recetas/`, `clientes/`, `insumos/` | Datos de la gestión | Solo la dueña |

La primera vez que entra la dueña se copian el catálogo, la Configuración, las recetas y los insumos iniciales. La tienda encuentra a la dueña con la dirección corta `enlaces/bloom`; sin conexión, o si aún no hay cuenta vinculada, muestra los valores iniciales.

### Configurar Firebase (una vez)

En la [consola de Firebase](https://console.firebase.google.com/project/bloom-522eb):

1. **Authentication → Sign-in method → Google → Habilitar.**
2. **Authentication → Settings → Authorized domains:** agregar `marinf-lab.github.io`.
3. **Firestore Database → Crear base de datos** (modo producción).
4. **Firestore → Reglas:** pegar el contenido de `firestore.rules` y **Publicar** (o `firebase deploy --only firestore:rules`). Cada vez que cambie ese archivo hay que publicarlo de nuevo.

Para probar la gestión en el computador sin Firebase: `npm run dev` y abrir `http://localhost:5173/?gestion&prueba` (datos en memoria; solo funciona en `localhost`).

## Publicación

- **Web**: el workflow `pages.yml` publica `main` en GitHub Pages. Activar una vez en **Settings → Pages → Source: GitHub Actions**. Queda en `https://marinf-lab.github.io/Bloom/`.

## Dónde se cambia cada cosa

- Contacto, despacho, temporada, catálogo y precios: desde la gestión (**Configuración** y **Catálogo**). Los valores iniciales están en `src/core/modelo.ts` y `src/data/productos.ts`.
- Packs, "Arma tu torta" y textos fijos de la tienda: `src/data/tienda.ts`.
- Recetas e insumos iniciales y datos del modo ejemplo: `src/data/gestion.ts`.
