// Datos en vivo de la gestión y las acciones para cambiarlos. Funciona igual con la cuenta o en modo ejemplo.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AJUSTES_INICIALES, CONFIG_INICIAL, idCliente, normalizarAjustes, normalizarCliente, normalizarConfig, normalizarInsumo,
  normalizarPedido, normalizarProducto, normalizarReceta,
  type Ajustes, type Cliente, type Config, type Insumo, type Pedido, type Producto, type Receta,
} from "../core/modelo";
import type { Estado } from "../core/orders";
import type { Almacen, Registro } from "./almacen";
import { achicarImagen } from "./firebase";

export interface Datos {
  listo: boolean;
  config: Config;
  ajustes: Ajustes;
  catalogo: Producto[];
  pedidos: Pedido[];
  recetas: Receta[];
  clientes: Cliente[];
  insumos: Insumo[];
  fotos: Record<string, string>;
}

const VACIO: Datos = { listo: false, config: CONFIG_INICIAL, ajustes: AJUSTES_INICIALES, catalogo: [], pedidos: [], recetas: [], clientes: [], insumos: [], fotos: {} };

const porNombre = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name, "es");

export function useDatos(almacen: Almacen) {
  const [d, setD] = useState<Datos>(VACIO);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    setD(VACIO);
    const llegaron = new Set<string>();
    const marca = (k: string) => {
      llegaron.add(k);
      return llegaron.size >= 7;
    };
    const error = () => setAviso("No pude leer tus datos. Revisa la conexión y las reglas de Firebase.");
    const col = <K extends keyof Datos>(k: K, conv: (rs: Registro[]) => Datos[K]) => (rs: Registro[]) =>
      setD((x) => ({ ...x, [k]: conv(rs), listo: x.listo || marca(k) }));
    const quitar = [
      almacen.escuchar("catalogo", col("catalogo", (rs) => rs.map((r) => normalizarProducto(r.id, r)).sort((a, b) => a.orden - b.orden || porNombre(a, b))), error),
      almacen.escuchar("pedidos", col("pedidos", (rs) => rs.map((r) => normalizarPedido(r.id, r))), error),
      almacen.escuchar("recetas", col("recetas", (rs) => rs.map((r) => normalizarReceta(r.id, r)).sort(porNombre)), error),
      almacen.escuchar("clientes", col("clientes", (rs) => rs.map((r) => normalizarCliente(r.id, r)).sort(porNombre)), error),
      almacen.escuchar("insumos", col("insumos", (rs) => rs.map((r) => normalizarInsumo(r.id, r)).sort((a, b) => a.level - b.level || porNombre(a, b))), error),
      almacen.escuchar("fotos", col("fotos", (rs) => Object.fromEntries(rs.filter((r) => typeof r.img === "string").map((r) => [r.id, r.img as string]))), error),
      almacen.escucharDoc("config", (c) => setD((x) => ({ ...x, config: normalizarConfig(c), listo: x.listo || marca("config") })), error),
      almacen.escucharDoc("ajustes", (a) => setD((x) => ({ ...x, ajustes: normalizarAjustes(a) }))),
    ];
    return () => quitar.forEach((q) => q());
  }, [almacen]);

  /** Ejecuta un cambio y avisa si falla (sin internet los cambios quedan en cola y se suben solos). */
  const hacer = useCallback(
    async (f: () => Promise<void>) => {
      try {
        setAviso("");
        await f();
      } catch {
        setAviso("No pude guardar el cambio. Revisa la conexión y las reglas de Firebase.");
      }
    },
    [],
  );

  const acciones = useMemo(
    () => ({
      guardarPedido: (p: Pedido) =>
        hacer(async () => {
          await almacen.guardar("pedidos", p.id, p);
          // El cliente se crea o se completa solo al guardar su pedido.
          const id = idCliente(p.cliente);
          const actual = d.clientes.find((c) => c.id === id);
          if (!actual) await almacen.guardar("clientes", id, { name: p.cliente, whatsapp: p.whatsapp, canal: p.canal, cumple: "" });
          else if (!actual.whatsapp && p.whatsapp) await almacen.guardar("clientes", id, { ...actual, whatsapp: p.whatsapp });
        }),
      borrarPedido: (id: string) => hacer(() => almacen.borrar("pedidos", id)),
      cambiarEstado: (p: Pedido, estado: Estado) => hacer(() => almacen.guardar("pedidos", p.id, { ...p, estado })),
      confirmar: (p: Pedido) => hacer(() => almacen.guardar("pedidos", p.id, { ...p, nuevo: false })),
      rechazar: (p: Pedido) => hacer(() => almacen.guardar("pedidos", p.id, { ...p, nuevo: false, rechazado: true })),
      guardarProducto: (p: Producto) => hacer(() => almacen.guardar("catalogo", p.id, p)),
      borrarProducto: (id: string) =>
        hacer(async () => {
          await almacen.borrar("catalogo", id);
          if (d.fotos[id]) await almacen.borrar("fotos", id);
        }),
      guardarReceta: (r: Receta) => hacer(() => almacen.guardar("recetas", r.id, r)),
      borrarReceta: (id: string) => hacer(() => almacen.borrar("recetas", id)),
      guardarCliente: (c: Cliente) => hacer(() => almacen.guardar("clientes", c.id, c)),
      borrarCliente: (id: string) => hacer(() => almacen.borrar("clientes", id)),
      guardarInsumo: (i: Insumo) => hacer(() => almacen.guardar("insumos", i.id, i)),
      borrarInsumo: (id: string) => hacer(() => almacen.borrar("insumos", id)),
      guardarConfig: (c: Config) => hacer(() => almacen.guardarDoc("config", c)),
      guardarAjustes: (a: Ajustes) => hacer(() => almacen.guardarDoc("ajustes", a)),
      subirFoto: async (id: string, file: File | undefined) => {
        if (!file) return;
        try {
          setAviso("Achicando la foto…");
          const img = await achicarImagen(file);
          await almacen.guardar("fotos", id, { img, actualizado: new Date().toISOString() });
          setAviso("");
        } catch (e) {
          setAviso(e instanceof Error && e.message.startsWith("No pude") ? e.message : "No pude guardar la foto. Revisa la conexión o las reglas de Firebase.");
        }
      },
      quitarFoto: (id: string) => hacer(() => almacen.borrar("fotos", id)),
    }),
    [almacen, hacer, d.clientes, d.fotos],
  );

  return { ...d, aviso, ...acciones };
}

export type UsoDatos = ReturnType<typeof useDatos>;
