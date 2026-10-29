// Sesión de la gestión: con la cuenta de Google (datos en Firestore) o en modo ejemplo (memoria).

import { useCallback, useEffect, useRef, useState } from "react";
import { almacenCuenta, almacenEjemplo, iniciarCuenta, type Almacen } from "./almacen";
import { entrar, escucharSesion, reclamarEnlace, salir, type Usuario } from "./firebase";

export const enAndroid = () => "Capacitor" in window;

export type Sesion =
  | { modo: "cargando" }
  | { modo: "fuera" }
  | { modo: "ejemplo"; almacen: Almacen }
  | { modo: "cuenta"; usuario: Usuario; almacen: Almacen };

export function useCuenta() {
  const [sesion, setSesion] = useState<Sesion>(() => (enAndroid() ? { modo: "fuera" } : { modo: "cargando" }));
  const [aviso, setAviso] = useState("");
  const enEjemplo = useRef(false);

  useEffect(() => {
    if (enAndroid()) return; // Google no deja iniciar sesión dentro de la app; se usa el navegador.
    let vivo = true;
    let quitar: (() => void) | undefined;
    escucharSesion(async (u) => {
      if (!vivo) return;
      if (!u) {
        if (!enEjemplo.current) setSesion({ modo: "fuera" });
        return;
      }
      setSesion({ modo: "cargando" });
      try {
        await iniciarCuenta(u.uid);
        const ok = await reclamarEnlace(u.uid);
        setAviso(ok ? "" : "La tienda está vinculada a otra cuenta: lo que guardes aquí no se verá en la tienda.");
        const almacen = await almacenCuenta(u.uid);
        enEjemplo.current = false;
        if (vivo) setSesion({ modo: "cuenta", usuario: u, almacen });
      } catch {
        setAviso("No pude abrir tus datos. Revisa la conexión y que las reglas de Firebase estén publicadas.");
        if (vivo) setSesion({ modo: "fuera" });
      }
    })
      .then((q) => {
        if (vivo) quitar = q;
        else q();
      })
      .catch(() => {
        setAviso("No pude conectar con Firebase. Revisa la conexión.");
        if (vivo && !enEjemplo.current) setSesion({ modo: "fuera" });
      });
    return () => {
      vivo = false;
      quitar?.();
    };
  }, []);

  const iniciarSesion = useCallback(async () => {
    setAviso("");
    try {
      await entrar();
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/unauthorized-domain") setAviso("Este sitio todavía no está autorizado en Firebase (Authentication → Settings → Authorized domains).");
      else if (code === "auth/operation-not-allowed") setAviso("Falta habilitar el acceso con Google en Firebase (Authentication → Sign-in method).");
      else if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setAviso("No pude iniciar sesión con Google.");
    }
  }, []);

  const verEjemplo = useCallback(() => {
    enEjemplo.current = true;
    setAviso("");
    setSesion({ modo: "ejemplo", almacen: almacenEjemplo() });
  }, []);

  const cerrarSesion = useCallback(async () => {
    if (enEjemplo.current) {
      enEjemplo.current = false;
      setSesion({ modo: "fuera" });
      return;
    }
    await salir().catch(() => {});
  }, []);

  return { sesion, aviso, iniciarSesion, verEjemplo, cerrarSesion };
}
