import { PRODUCTS, TAG_STYLE, TINTS, type Etiqueta } from "../data/productos";
import { clp } from "../core/money";
import { WEB_GESTION } from "../store/firebase";
import { enAndroid, type useFotos } from "../store/useFotos";
import { Cake } from "../ui/icons";
import { Switch } from "../ui/Switch";

type Fotos = ReturnType<typeof useFotos>;

const BOTON = "flex min-h-9 items-center rounded-[18px] px-3 text-[12px] font-semibold";

export function Catalogo({ hidden, onToggle, f }: { hidden: Record<string, boolean>; onToggle: (id: string) => void; f: Fotos }) {
  const disponibles = PRODUCTS.filter((p) => !hidden[p.id]).length;

  return (
    <div className="flex flex-col gap-2.5">
      <Sesion f={f} />
      <div className="text-[13px] text-muted">{disponibles} de {PRODUCTS.length} productos disponibles en la tienda</div>
      {PRODUCTS.map((p) => {
        const on = !hidden[p.id];
        const tags: Etiqueta[] = on ? p.tags : ["Agotado"];
        const foto = f.fotos[p.id];
        const ocupado = f.ocupado === p.id;
        return (
          <article key={p.id} className="flex items-center gap-3 rounded-[18px] border border-line bg-paper py-3 pr-2 pl-3">
            <div className="flex size-[52px] flex-none items-center justify-center overflow-hidden rounded-[14px] text-cocoa" style={{ background: TINTS[p.kind] }}>
              {foto ? <img src={foto} alt={`Foto de ${p.name}`} className="size-full object-cover" /> : <Cake size={26} sw={1.6} />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="font-display text-[18px] font-semibold leading-[1.1]">{p.name}</div>
              <div className="text-[12px] text-muted">{p.sizeShort} · {clp(p.price)}</div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((t) => (
                    <span key={t} className="rounded-[9px] px-2 py-0.5 text-[10px] font-semibold" style={{ background: TAG_STYLE[t][0], color: TAG_STYLE[t][1] }}>{t}</span>
                  ))}
                </div>
              )}
              {f.usuario && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <label className={BOTON + " cursor-pointer bg-rose text-rose-ink" + (ocupado ? " opacity-60" : "")}>
                    {ocupado ? "Guardando…" : foto ? "Cambiar foto" : "Subir foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={ocupado}
                      aria-label={`Subir foto de ${p.name}`}
                      onChange={(e) => { void f.subir(p.id, e.target.files?.[0]); e.target.value = ""; }}
                    />
                  </label>
                  {foto && (
                    <button type="button" disabled={ocupado} onClick={() => void f.quitar(p.id)} className={BOTON + " border border-line bg-transparent text-muted"}>
                      Quitar
                    </button>
                  )}
                </div>
              )}
            </div>
            <Switch on={on} label={`Mostrar ${p.name} en la tienda`} onToggle={() => onToggle(p.id)} />
          </article>
        );
      })}
      <div className="text-center text-[11px] text-muted">Al apagar un producto aparece como «Agotado» en la tienda. Las fotos se achican solas para que la tienda cargue rápido.</div>
    </div>
  );
}

/** Entrar con Google para subir fotos, como en Shop. */
function Sesion({ f }: { f: Fotos }) {
  const caja = "flex flex-col gap-2 rounded-[18px] bg-rose-soft px-3.5 py-3 text-[13px] text-rose-ink";
  if (enAndroid()) {
    return (
      <div className={caja}>
        <span>Para subir fotos de los productos, abre la gestión en el navegador y entra con Google.</span>
        <a href={WEB_GESTION} target="_blank" rel="noopener noreferrer" className={BOTON + " self-start bg-rose-deep text-paper"}>Abrir en el navegador</a>
      </div>
    );
  }
  return (
    <div className={caja}>
      {f.usuario ? (
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate">Fotos de {f.usuario.email ?? f.usuario.displayName ?? "tu cuenta"}</span>
          <button type="button" onClick={() => void f.cerrarSesion()} className={BOTON + " flex-none border border-rose-ink/30 bg-transparent text-rose-ink"}>Salir</button>
        </div>
      ) : (
        <>
          <span>Entra con Google para subir fotos de los productos. Se ven en la tienda en lugar del dibujo.</span>
          <button type="button" onClick={() => void f.iniciarSesion()} className={BOTON + " self-start border-none bg-rose-deep text-paper"}>Entrar con Google</button>
        </>
      )}
      {f.aviso && <span role="status" className="text-[12px]">{f.aviso}</span>}
    </div>
  );
}
