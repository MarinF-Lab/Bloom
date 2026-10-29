// Firebase: el proyecto propio de Bloom, con el SDK "compat" cargado desde gstatic solo cuando hace
// falta (como en la tienda Shop). Los valores son públicos; lo que protege los datos son las reglas
// de Firestore (firestore.rules).

import { registerPlugin } from "@capacitor/core";
import { FOTO_LIMITE, FOTO_MAX, calidades, idFoto, medidasAchicadas } from "../core/fotos";
import { enApp } from "../plataforma";

const FIREBASE = {
  apiKey: "AIzaSyAOdtiD0mRI_xRe0CwovqbZ9nux_rEs4eY",
  authDomain: "bloom-522eb.firebaseapp.com",
  projectId: "bloom-522eb",
  appId: "1:505748524347:web:e389061c9c62ffeaec3b1e",
};
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

/** Dirección corta de la tienda (enlaces/bloom → uid de la dueña), como el ?t= de Shop. */
export const ENLACE = "bloom";

/** Dirección publicada, para abrir la gestión en el navegador desde la app de Android. */
export const WEB_GESTION = "https://marinf-lab.github.io/Bloom/gestion/";
export const WEB_TIENDA = "https://marinf-lab.github.io/Bloom/";

export type Crudo = Record<string, unknown>;

export interface Usuario {
  uid: string;
  displayName: string | null;
  email: string | null;
}

/* El SDK compat no trae tipos al cargarse desde gstatic: se usa sin tipos, solo dentro de este archivo
   y de almacen.ts. */
export type FS = any;
const fb = (): any => (window as unknown as { firebase: unknown }).firebase;

const cargados: Record<string, Promise<void>> = {};
function cargar(archivo: string): Promise<void> {
  return (cargados[archivo] ??= new Promise<void>((ok, mal) => {
    const s = document.createElement("script");
    s.src = SDK + archivo;
    s.onload = () => ok();
    s.onerror = () => {
      delete cargados[archivo];
      mal(new Error("No pude cargar " + archivo));
    };
    document.head.appendChild(s);
  }));
}

let conCache = false;

async function iniciar(conAuth: boolean): Promise<FS> {
  await cargar("firebase-app-compat.js");
  await cargar("firebase-firestore-compat.js");
  if (conAuth) await cargar("firebase-auth-compat.js");
  const f = fb();
  if (!f.apps.length) {
    f.initializeApp(FIREBASE);
    // La gestión guarda una copia para trabajar sin señal (como Shop). Debe pedirse antes de cualquier lectura.
    if (conAuth && !conCache) {
      conCache = true;
      f.firestore().enablePersistence({ synchronizeTabs: true }).catch(() => {});
    }
  }
  return f;
}

export async function firestore(conAuth: boolean): Promise<FS> {
  return (await iniciar(conAuth)).firestore();
}

export const tiendaRef = (db: FS, uid: string): FS => db.collection("tiendas").doc(uid);

const datos = (d: FS): Crudo => (d.data() ?? {}) as Crudo;

// ---------- tienda pública: solo lectura, más crear pedidos ----------

export interface TiendaPublica {
  uid: string;
  config: Crudo | null;
  catalogo: { id: string; datos: Crudo }[];
  fotos: Record<string, string>;
}

/** Lo que la dueña publicó. null si la tienda aún no está vinculada a una cuenta. */
export async function leerTiendaPublica(): Promise<TiendaPublica | null> {
  const db = await firestore(false);
  const enlace = await db.collection("enlaces").doc(ENLACE).get();
  const uid = enlace.exists ? datos(enlace).uid : undefined;
  if (typeof uid !== "string") return null;
  const ref = tiendaRef(db, uid);
  const [conf, cat, fotos] = await Promise.all([
    ref.collection("publico").doc("tienda").get().catch(() => null),
    ref.collection("catalogo").get().catch(() => null),
    ref.collection("fotos").get().catch(() => null),
  ]);
  const out: TiendaPublica = { uid, config: conf?.exists ? datos(conf) : null, catalogo: [], fotos: {} };
  cat?.forEach((d: FS) => out.catalogo.push({ id: d.id, datos: datos(d) }));
  fotos?.forEach((d: FS) => {
    const img = datos(d).img;
    if (typeof img === "string") out.fotos[sinPrefijo(d.id)] = img;
  });
  return out;
}

/** Deja un pedido en la gestión de la dueña. Las reglas solo aceptan los campos de la tienda. */
export async function crearPedidoPublico(uid: string, pedido: Crudo): Promise<void> {
  const db = await firestore(false);
  await tiendaRef(db, uid).collection("pedidos").add(pedido);
}

export const sinPrefijo = (docId: string) => docId.replace(/^bloom-/, "");
export { idFoto };

// ---------- sesión de Google ----------

export async function escucharSesion(cb: (u: Usuario | null) => void): Promise<() => void> {
  const f = await iniciar(true);
  return f.auth().onAuthStateChanged(cb);
}

const enAndroid = () => enApp();

/** Plugin nativo @capacitor-firebase/authentication. Se registra sin su parte web
    (que traería otro SDK de Firebase entero): solo se usa dentro de la app de Android. */
interface AuthNativa {
  signInWithGoogle(): Promise<{ credential?: { idToken?: string } | null }>;
  signOut(): Promise<void>;
}
let pluginNativo: AuthNativa | null = null;
const nativo = async (): Promise<AuthNativa> => (pluginNativo ??= registerPlugin<AuthNativa>("FirebaseAuthentication"));

export async function entrar(): Promise<void> {
  const f = await iniciar(true);
  if (enAndroid()) {
    // Google no deja usar la ventana web dentro de la app: se entra con la cuenta del teléfono
    // y con ese token se abre la misma sesión de Firebase que usa la web.
    const r = await (await nativo()).signInWithGoogle();
    const idToken = r.credential?.idToken;
    if (!idToken) throw Object.assign(new Error("Sin token de Google"), { code: "auth/sin-token" });
    await f.auth().signInWithCredential(f.auth.GoogleAuthProvider.credential(idToken));
    return;
  }
  await f.auth().signInWithPopup(new f.auth.GoogleAuthProvider());
}

export async function salir(): Promise<void> {
  const f = await iniciar(true);
  if (enAndroid()) await (await nativo()).signOut().catch(() => {});
  await f.auth().signOut();
}

/**
 * Deja la dirección corta "bloom" apuntando a esta cuenta, para que la tienda la encuentre.
 * Devuelve false si ya es de otra cuenta.
 */
export async function reclamarEnlace(uid: string): Promise<boolean> {
  const db = await firestore(true);
  const ref = db.collection("enlaces").doc(ENLACE);
  const d = await ref.get();
  const actual = d.exists ? datos(d).uid : undefined;
  if (actual === uid) return true;
  if (actual) return false;
  await ref.set({ uid });
  return true;
}

/** Achica una foto elegida en el teléfono: lado mayor 800 px, en JPG y bajo el límite de Firestore. */
export function achicarImagen(file: File, max: number = FOTO_MAX): Promise<string> {
  return new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onerror = () => mal(new Error("No pude leer esa imagen"));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => mal(new Error("No pude leer esa imagen"));
      img.onload = () => {
        const m = medidasAchicadas(img.width, img.height, max);
        const cv = document.createElement("canvas");
        cv.width = m.w;
        cv.height = m.h;
        const cx = cv.getContext("2d");
        if (!cx) return mal(new Error("No pude achicar la imagen"));
        cx.fillStyle = "#FFFFFF";
        cx.fillRect(0, 0, m.w, m.h);
        cx.drawImage(img, 0, 0, m.w, m.h);
        let url = "";
        for (const q of calidades()) {
          url = cv.toDataURL("image/jpeg", q);
          if (url.length <= FOTO_LIMITE) break;
        }
        ok(url);
      };
      img.src = String(lector.result);
    };
    lector.readAsDataURL(file);
  });
}
