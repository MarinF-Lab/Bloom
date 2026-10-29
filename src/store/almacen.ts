// Almacén de datos de la gestión. Las pantallas usan siempre esta interfaz; detrás puede estar
// la cuenta (Firestore, tiendas/{uid}/…) o la memoria del navegador (solo para pruebas en el computador).

import { CONFIG_INICIAL, AJUSTES_INICIALES, limpio } from "../core/modelo";
import { ymd } from "../core/fechas";
import { PRODUCTS } from "../data/productos";
import { RECIPES, SUPPLIES, clientesEjemplo, pedidosEjemplo } from "../data/gestion";
import { firestore, idFoto, sinPrefijo, tiendaRef, type Crudo, type FS } from "./firebase";

export type Col = "catalogo" | "pedidos" | "recetas" | "clientes" | "insumos" | "fotos";
/** config = Configuración pública de la tienda; ajustes = preferencias privadas. */
export type DocUnico = "config" | "ajustes";
export type Registro = Crudo & { id: string };

export interface Almacen {
  tipo: "cuenta" | "ejemplo";
  escuchar(col: Col, cb: (rs: Registro[]) => void, alError?: (e: unknown) => void): () => void;
  escucharDoc(doc: DocUnico, cb: (d: Crudo | null) => void, alError?: (e: unknown) => void): () => void;
  guardar(col: Col, id: string, datos: object): Promise<void>;
  borrar(col: Col, id: string): Promise<void>;
  guardarDoc(doc: DocUnico, datos: object): Promise<void>;
}

const sinId = (x: object): Crudo => {
  const c = limpio(x) as Crudo;
  delete c.id;
  return c;
};

/** Lo que recibe una cuenta nueva (y el modo ejemplo, con pedidos y clientes de muestra). */
export function semilla(conEjemplos: boolean, hoy: string = ymd(new Date())) {
  return {
    config: CONFIG_INICIAL,
    ajustes: AJUSTES_INICIALES,
    catalogo: PRODUCTS,
    recetas: RECIPES,
    insumos: SUPPLIES,
    pedidos: conEjemplos ? pedidosEjemplo(hoy) : [],
    clientes: conEjemplos ? clientesEjemplo(hoy) : [],
  };
}

// ---------- en memoria ----------

class Memoria implements Almacen {
  tipo = "ejemplo" as const;
  private cols = new Map<Col, Map<string, Crudo>>();
  private docs = new Map<DocUnico, Crudo | null>();
  private oyentes = new Set<() => void>();

  constructor() {
    const s = semilla(true);
    const poner = (col: Col, lista: { id: string }[]) => this.cols.set(col, new Map(lista.map((x) => [x.id, sinId(x)])));
    poner("catalogo", s.catalogo);
    poner("recetas", s.recetas);
    poner("insumos", s.insumos);
    poner("pedidos", s.pedidos);
    poner("clientes", s.clientes);
    this.cols.set("fotos", new Map());
    this.docs.set("config", limpio(s.config) as unknown as Crudo);
    this.docs.set("ajustes", limpio(s.ajustes) as unknown as Crudo);
  }

  private avisar() {
    queueMicrotask(() => this.oyentes.forEach((f) => f()));
  }

  private lista(col: Col): Registro[] {
    return [...(this.cols.get(col) ?? new Map<string, Crudo>()).entries()].map(([id, d]) => ({ ...d, id }));
  }

  escuchar(col: Col, cb: (rs: Registro[]) => void) {
    const f = () => cb(this.lista(col));
    this.oyentes.add(f);
    queueMicrotask(f);
    return () => void this.oyentes.delete(f);
  }

  escucharDoc(doc: DocUnico, cb: (d: Crudo | null) => void) {
    const f = () => cb(this.docs.get(doc) ?? null);
    this.oyentes.add(f);
    queueMicrotask(f);
    return () => void this.oyentes.delete(f);
  }

  async guardar(col: Col, id: string, datos: object) {
    if (!this.cols.has(col)) this.cols.set(col, new Map());
    this.cols.get(col)!.set(id, sinId(datos));
    this.avisar();
  }

  async borrar(col: Col, id: string) {
    this.cols.get(col)?.delete(id);
    this.avisar();
  }

  async guardarDoc(doc: DocUnico, datos: object) {
    this.docs.set(doc, { ...(this.docs.get(doc) ?? {}), ...sinId(datos) });
    this.avisar();
  }
}

let ejemplo: Memoria | null = null;

/** Almacén en memoria para pruebas (localhost/?prueba): uno por pestaña, se pierde al recargar. */
export function almacenEjemplo(): Almacen {
  return (ejemplo ??= new Memoria());
}

/** En pruebas, la tienda muestra lo editado en la gestión dentro de la misma pestaña. */
export function ejemploActivo(): Almacen | null {
  return ejemplo;
}

// ---------- en la cuenta (Firestore) ----------

const RUTA_DOC: Record<DocUnico, (t: FS) => FS> = {
  config: (t) => t.collection("publico").doc("tienda"),
  ajustes: (t) => t,
};

/** Las fotos se guardan con prefijo (bloom-p1), como en Shop. */
const idDoc = (col: Col, id: string) => (col === "fotos" ? idFoto(id) : id);
const idApp = (col: Col, id: string) => (col === "fotos" ? sinPrefijo(id) : id);

export async function almacenCuenta(uid: string): Promise<Almacen> {
  const db = await firestore(true);
  const t = tiendaRef(db, uid);
  return {
    tipo: "cuenta",
    escuchar(col, cb, alError) {
      return t.collection(col).onSnapshot(
        (snap: FS) => cb(snap.docs.map((d: FS) => ({ ...(d.data() as Crudo), id: idApp(col, d.id) }))),
        (e: unknown) => alError?.(e),
      );
    },
    escucharDoc(doc, cb, alError) {
      return RUTA_DOC[doc](t).onSnapshot(
        (d: FS) => cb(d.exists ? (d.data() as Crudo) : null),
        (e: unknown) => alError?.(e),
      );
    },
    guardar: (col, id, datos) => t.collection(col).doc(idDoc(col, id)).set(sinId(datos)),
    borrar: (col, id) => t.collection(col).doc(idDoc(col, id)).delete(),
    guardarDoc: (doc, datos) => RUTA_DOC[doc](t).set(sinId(datos), { merge: true }),
  };
}

/** Primera vez que la cuenta entra: copia el catálogo, la Configuración, las recetas y los insumos iniciales. */
export async function iniciarCuenta(uid: string): Promise<void> {
  const db = await firestore(true);
  const t = tiendaRef(db, uid);
  const raiz = await t.get();
  if (raiz.exists && (raiz.data() as Crudo).iniciado) return;
  const s = semilla(false);
  const lote = db.batch();
  lote.set(t, { ...sinId(s.ajustes), iniciado: true }, { merge: true });
  lote.set(RUTA_DOC.config(t), sinId(s.config), { merge: true });
  for (const p of s.catalogo) lote.set(t.collection("catalogo").doc(p.id), sinId(p));
  for (const r of s.recetas) lote.set(t.collection("recetas").doc(r.id), sinId(r));
  for (const i of s.insumos) lote.set(t.collection("insumos").doc(i.id), sinId(i));
  await lote.commit();
}
