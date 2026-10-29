import { useState } from "react";
import { TEMPORADAS, nuevoId, soloDigitos, telefonoLegible, type Config } from "../core/modelo";
import { WEB_TIENDA } from "../store/firebase";
import type { Sesion } from "../store/useCuenta";
import { Area, Fila, Interruptor, Numero, Selector, Texto } from "../ui/Campos";
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO, Hoja, Seccion } from "../ui/Hoja";
import { Trash } from "../ui/icons";

/** Configuración compartida: se edita aquí y la tienda la muestra. */
export function Configuracion({ config, sesion, onGuardar, onSalir, onCerrar }: {
  config: Config;
  sesion: Extract<Sesion, { modo: "cuenta" | "prueba" }>;
  onGuardar: (c: Config) => Promise<void>;
  onSalir: () => void;
  onCerrar: () => void;
}) {
  const [c, setC] = useState<Config>(config);
  const [guardando, setGuardando] = useState(false);
  const set = <K extends keyof Config>(k: K, v: Config[K]) => setC((x) => ({ ...x, [k]: v }));
  const cambiado = JSON.stringify(c) !== JSON.stringify(config);

  async function guardar() {
    setGuardando(true);
    await onGuardar({ ...c, whatsapp: soloDigitos(c.whatsapp), instagram: c.instagram.replace(/^@/, "").trim(), zonas: c.zonas.filter((z) => z.label.trim()) });
    setGuardando(false);
    onCerrar();
  }

  return (
    <Hoja
      titulo="Configuración"
      onCerrar={onCerrar}
      pie={
        <>
          <button type="button" onClick={onCerrar} className={BOTON_SECUNDARIO}>Cancelar</button>
          <button type="button" onClick={guardar} disabled={!cambiado || guardando} className={BOTON_PRINCIPAL}>{guardando ? "Guardando…" : "Guardar"}</button>
        </>
      }
    >
      <p className="m-0 text-[13px] text-muted">Lo que cambies aquí se ve en la tienda.</p>

      <Seccion titulo="Perfil y contacto">
        <Texto label="Nombre de la tienda" value={c.nombre} onChange={(v) => set("nombre", v)} />
        <Area label="Texto de bienvenida" value={c.texto} onChange={(v) => set("texto", v)} />
        <Texto label="WhatsApp" value={c.whatsapp} onChange={(v) => set("whatsapp", v)} inputMode="tel" placeholder="56912345678" nota={c.whatsapp ? `Se muestra como ${telefonoLegible(c.whatsapp)}. Con código de país, sin +.` : "Con código de país, sin +."} />
        <Texto label="Instagram" value={c.instagram} onChange={(v) => set("instagram", v)} placeholder="_bloompasteleria.cl" nota="Solo el usuario, sin @." />
        <Texto label="Horario" value={c.horario} onChange={(v) => set("horario", v)} />
        <Texto label="Ubicación" value={c.ubicacion} onChange={(v) => set("ubicacion", v)} />
      </Seccion>

      <Seccion titulo="Despacho" nota="Una zona con costo $0 es retiro sin costo.">
        {c.zonas.map((z, i) => (
          <div key={z.key} className="flex flex-col gap-2 border-b border-dashed border-line pb-3">
            <Texto label={`Zona ${i + 1}`} value={z.label} onChange={(v) => set("zonas", c.zonas.map((x) => (x.key === z.key ? { ...x, label: v } : x)))} />
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Numero label="Costo" prefijo="$" value={z.fee} onChange={(v) => set("zonas", c.zonas.map((x) => (x.key === z.key ? { ...x, fee: v } : x)))} />
              </div>
              <button type="button" aria-label={`Quitar ${z.label || "zona"}`} onClick={() => set("zonas", c.zonas.filter((x) => x.key !== z.key))} className="flex min-h-11 flex-none items-center gap-1.5 rounded-[14px] border border-line-2 bg-transparent px-3 text-[13px] text-muted">
                <Trash size={16} /> Quitar
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => set("zonas", [...c.zonas, { key: nuevoId("z"), label: "", fee: 0 }])} className="min-h-11 rounded-2xl border-[1.5px] border-dashed border-[#C9B79F] bg-transparent text-[14px] font-medium text-cocoa">
          + Agregar zona
        </button>
        <Numero label="Despacho gratis desde" prefijo="$" value={c.envioGratisDesde} onChange={(v) => set("envioGratisDesde", v)} nota="0 = el despacho nunca es gratis." />
      </Seccion>

      <Seccion titulo="Tienda y pedidos">
        <Interruptor label="Tienda abierta" nota={c.abierta ? "Recibe pedidos." : "Muestra el catálogo, pero no recibe pedidos."} on={c.abierta} onChange={(v) => set("abierta", v)} />
        <Fila>
          <Numero label="Anticipación (horas)" value={c.horasMinimas} onChange={(v) => set("horasMinimas", v)} />
          <Numero label="Abono (%)" value={c.abonoPct} max={100} onChange={(v) => set("abonoPct", Math.min(100, v))} />
        </Fila>
        <Numero label="Pedidos por día" value={c.cuposPorDia} min={1} onChange={(v) => set("cuposPorDia", Math.max(1, v))} nota="Para los cupos de Pedidos y Agenda." />
        <Selector label="Aviso de temporada" value={c.temporada} opciones={TEMPORADAS} onChange={(v) => set("temporada", v)} />
      </Seccion>

      <Seccion titulo="Cuenta">
        {sesion.modo === "cuenta" ? (
          <p className="m-0 text-[14px]">Entraste como <strong className="font-semibold">{sesion.usuario.email ?? sesion.usuario.displayName}</strong>. Solo esta cuenta puede abrir la gestión.</p>
        ) : (
          <p className="m-0 text-[14px]">Modo de prueba local: los cambios se pierden al recargar.</p>
        )}
        <a href={WEB_TIENDA} target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium underline">Ver la tienda</a>
        <button type="button" onClick={onSalir} className={BOTON_SECUNDARIO}>Cerrar sesión</button>
      </Seccion>
    </Hoja>
  );
}
