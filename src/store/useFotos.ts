// Sesión de Google y fotos de productos para la app de gestión (como en Shop).

import { useCallback, useEffect, useState } from "react";
import { achicarImagen, entrar, escucharSesion, guardarFoto, leerFotos, quitarFoto, reclamarEnlace, salir, type Usuario } from "./firebase";

export const enAndroid = () => "Capacitor" in window;

export function useFotos(ids: readonly string[]) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [fotos, setFotos] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState<string | null>(null);
  const clave = ids.join(",");

  useEffect(() => {
    if (enAndroid()) return; // Google no deja iniciar sesión dentro de la app; se usa el navegador.
    let quitar: (() => void) | undefined;
    let vivo = true;
    escucharSesion(async (u) => {
      if (!vivo) return;
      setUsuario(u);
      if (!u) { setFotos({}); return; }
      try {
        const ok = await reclamarEnlace(u.uid);
        if (!ok) setAviso("La dirección «bloom» ya es de otra cuenta: la tienda no mostrará estas fotos.");
        setFotos(await leerFotos(u.uid, clave.split(",")));
      } catch {
        setAviso("No pude leer las fotos. Revisa la conexión o las reglas de Firebase.");
      }
    })
      .then((q) => { if (vivo) quitar = q; else q(); })
      .catch(() => setAviso("No pude conectar con Firebase. Revisa la conexión."));
    return () => { vivo = false; quitar?.(); };
  }, [clave]);

  const iniciarSesion = useCallback(async () => {
    setAviso("");
    try {
      await entrar();
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/unauthorized-domain") setAviso("Este sitio todavía no está autorizado en Firebase.");
      else if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setAviso("No pude iniciar sesión con Google.");
    }
  }, []);

  const subir = useCallback(
    async (id: string, file: File | undefined) => {
      if (!file || !usuario) return;
      setOcupado(id);
      setAviso("Achicando la foto…");
      try {
        const url = await achicarImagen(file);
        await guardarFoto(usuario.uid, id, url);
        setFotos((f) => ({ ...f, [id]: url }));
        setAviso("");
      } catch (e) {
        setAviso(e instanceof Error && e.message.startsWith("No pude") ? e.message : "No pude guardar la foto. Revisa la conexión o las reglas de Firebase.");
      } finally {
        setOcupado(null);
      }
    },
    [usuario],
  );

  const quitarDe = useCallback(
    async (id: string) => {
      if (!usuario) return;
      setOcupado(id);
      try {
        await quitarFoto(usuario.uid, id);
        setFotos((f) => {
          const c = { ...f };
          delete c[id];
          return c;
        });
      } catch {
        setAviso("No pude quitar la foto.");
      } finally {
        setOcupado(null);
      }
    },
    [usuario],
  );

  return { usuario, fotos, aviso, ocupado, iniciarSesion, cerrarSesion: salir, subir, quitar: quitarDe };
}
