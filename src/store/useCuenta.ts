// Sesión de la gestión: solo la dueña de Bloom, con la cuenta de Google bloompasteleriacl@gmail.com.
// Cualquier otra cuenta queda fuera; las reglas de Firestore lo hacen cumplir también.

import { useCallback, useEffect, useRef, useState } from "react";
import { almacenCuenta, almacenEjemplo, iniciarCuenta, type Almacen } from "./almacen";
import { CORREO_DUENA, entrar, escucharSesion, esLaDuena, reclamarEnlace, salir, type Usuario } from "./firebase";

/** Solo para pruebas en el computador (localhost/?prueba): datos en memoria, sin Firebase. */
const modoPrueba = () => /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).has("prueba");

export type Sesion =
  | { modo: "cargando" }
  | { modo: "fuera" }
  | { modo: "prueba"; almacen: Almacen }
  | { modo: "cuenta"; usuario: Usuario; almacen: Almacen };

export const NO_ES_LA_DUENA = `Esta gestión es solo para la dueña de Bloom. Entra con ${CORREO_DUENA}.`;

export function useCuenta() {
  const [sesion, setSesion] = useState<Sesion>(() => (modoPrueba() ? { modo: "prueba", almacen: almacenEjemplo() } : { modo: "cargando" }));
  const [aviso, setAviso] = useState("");
  const rechazada = useRef(false);

  useEffect(() => {
    if (modoPrueba()) return;
    let vivo = true;
    let quitar: (() => void) | undefined;
    escucharSesion(async (u) => {
      if (!vivo) return;
      if (!u) {
        setSesion({ modo: "fuera" });
        return;
      }
      setSesion({ modo: "cargando" });
      try {
        // Solo la cuenta de la dueña; cualquier otra se cierra antes de tocar datos.
        if (!esLaDuena(u)) {
          rechazada.current = true;
          setAviso(NO_ES_LA_DUENA);
          await salir().catch(() => {});
          return;
        }
        rechazada.current = false;
        await reclamarEnlace(u.uid);
        setAviso("");
        await iniciarCuenta(u.uid);
        const almacen = await almacenCuenta(u.uid);
        if (vivo) setSesion({ modo: "cuenta", usuario: u, almacen });
      } catch {
        setAviso("No pude abrir tus datos. Revisa la conexión y que las reglas de Firebase estén publicadas.");
        await salir().catch(() => {});
      }
    })
      .then((q) => {
        if (vivo) quitar = q;
        else q();
      })
      .catch(() => {
        setAviso("No pude conectar con Firebase. Revisa la conexión.");
        if (vivo) setSesion({ modo: "fuera" });
      });
    return () => {
      vivo = false;
      quitar?.();
    };
  }, []);

  const iniciarSesion = useCallback(async () => {
    if (!rechazada.current) setAviso("");
    try {
      await entrar();
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/unauthorized-domain") setAviso("Este sitio todavía no está autorizado en Firebase (Authentication → Settings → Authorized domains).");
      else if (code === "auth/operation-not-allowed") setAviso("Falta habilitar el acceso con Google en Firebase (Authentication → Sign-in method).");
      else if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setAviso("No pude iniciar sesión con Google.");
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    if (modoPrueba()) return;
    await salir().catch(() => {});
  }, []);

  return { sesion, aviso, iniciarSesion, cerrarSesion };
}
