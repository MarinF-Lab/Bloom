// Firebase: el proyecto propio de Bloom, con el SDK "compat" cargado desde gstatic solo cuando hace
// falta (como en la tienda Shop). Los valores son públicos; lo que protege los datos son las reglas
// de Firestore (firestore.rules).

import { FOTO_LIMITE, FOTO_MAX, calidades, idFoto, medidasAchicadas } from "../core/fotos";

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

// Tipos mínimos del SDK compat que se usa.
interface Doc {
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}
interface DocRef {
  get(): Promise<Doc>;
  set(d: Record<string, unknown>): Promise<void>;
  delete(): Promise<void>;
  collection(n: string): { doc(id: string): DocRef };
}
interface Firestore {
  collection(n: string): { doc(id: string): DocRef };
}
export interface Usuario {
  uid: string;
  displayName: string | null;
  email: string | null;
}
interface Auth {
  currentUser: Usuario | null;
  onAuthStateChanged(cb: (u: Usuario | null) => void): () => void;
  signInWithPopup(p: unknown): Promise<unknown>;
  signOut(): Promise<void>;
}
interface FirebaseCompat {
  apps: unknown[];
  initializeApp(c: object): void;
  firestore(): Firestore;
  auth: (() => Auth) & { GoogleAuthProvider: new () => unknown };
}
const fb = () => (window as unknown as { firebase: FirebaseCompat }).firebase;

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

async function iniciar(conAuth: boolean): Promise<FirebaseCompat> {
  await cargar("firebase-app-compat.js");
  await cargar("firebase-firestore-compat.js");
  if (conAuth) await cargar("firebase-auth-compat.js");
  const f = fb();
  if (!f.apps.length) f.initializeApp(FIREBASE);
  return f;
}

const tienda = (db: Firestore, uid: string) => db.collection("tiendas").doc(uid);

// ---------- tienda pública: solo lectura ----------

/** Fotos publicadas de estos productos (id → data URL). Si algo falla, devuelve lo que alcanzó. */
export async function leerFotosPublicas(ids: readonly string[]): Promise<Record<string, string>> {
  const f = await iniciar(false);
  const db = f.firestore();
  const enlace = await db.collection("enlaces").doc(ENLACE).get();
  const uid = enlace.exists ? enlace.data()?.uid : undefined;
  if (typeof uid !== "string") return {};
  const out: Record<string, string> = {};
  await Promise.all(
    ids.map(async (id) => {
      try {
        const d = await tienda(db, uid).collection("fotos").doc(idFoto(id)).get();
        const img = d.exists ? d.data()?.img : undefined;
        if (typeof img === "string") out[id] = img;
      } catch {
        /* sin foto: queda el dibujo */
      }
    }),
  );
  return out;
}

// ---------- app de gestión: con sesión de Google ----------

export async function escucharSesion(cb: (u: Usuario | null) => void): Promise<() => void> {
  const f = await iniciar(true);
  return f.auth().onAuthStateChanged(cb);
}

export async function entrar(): Promise<void> {
  const f = await iniciar(true);
  await f.auth().signInWithPopup(new f.auth.GoogleAuthProvider());
}

export async function salir(): Promise<void> {
  const f = await iniciar(true);
  await f.auth().signOut();
}

/**
 * Deja la dirección corta "bloom" apuntando a esta cuenta, para que la tienda encuentre las fotos.
 * Devuelve false si ya es de otra cuenta.
 */
export async function reclamarEnlace(uid: string): Promise<boolean> {
  const db = (await iniciar(true)).firestore();
  const ref = db.collection("enlaces").doc(ENLACE);
  const d = await ref.get();
  const actual = d.exists ? d.data()?.uid : undefined;
  if (actual === uid) return true;
  if (actual) return false;
  await ref.set({ uid });
  return true;
}

export async function leerFotos(uid: string, ids: readonly string[]): Promise<Record<string, string>> {
  const db = (await iniciar(true)).firestore();
  const out: Record<string, string> = {};
  await Promise.all(
    ids.map(async (id) => {
      const d = await tienda(db, uid).collection("fotos").doc(idFoto(id)).get();
      const img = d.exists ? d.data()?.img : undefined;
      if (typeof img === "string") out[id] = img;
    }),
  );
  return out;
}

export async function guardarFoto(uid: string, id: string, img: string): Promise<void> {
  const db = (await iniciar(true)).firestore();
  await tienda(db, uid).collection("fotos").doc(idFoto(id)).set({ img, actualizado: new Date().toISOString() });
}

export async function quitarFoto(uid: string, id: string): Promise<void> {
  const db = (await iniciar(true)).firestore();
  await tienda(db, uid).collection("fotos").doc(idFoto(id)).delete();
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
