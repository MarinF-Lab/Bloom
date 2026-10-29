import { Google } from "../ui/icons";
import { Gatito } from "../ui/Logo";

/** Inicio de la gestión: solo la dueña de Bloom, con su cuenta de Google. */
export function Entrar({ cargando, aviso, onEntrar }: { cargando: boolean; aviso: string; onEntrar: () => void }) {
  const boton = "flex min-h-12 w-full items-center justify-center gap-2.5 rounded-3xl px-5 text-[15px] font-medium";
  return (
    <div className="bg-cream">
      <div className="mx-auto flex h-dvh max-w-[480px] flex-col items-center justify-center gap-5 px-6 text-center text-ink sm:border-x sm:border-line">
        <Gatito width={180} alt="Gatito dormido del logo de Bloom" />
        <div>
          <h1 className="m-0 font-display text-[34px] font-semibold leading-tight">Bloom · Gestión</h1>
          <p className="mx-auto mt-2 mb-0 max-w-[320px] text-[14px] leading-relaxed text-muted">
            Acceso solo para la dueña de Bloom. Entra con la cuenta de Google de la tienda.
          </p>
        </div>
        {cargando ? (
          <div role="status" className="text-[14px] text-muted">Abriendo tus datos…</div>
        ) : (
          <div className="flex w-full max-w-[320px] flex-col gap-2.5">
            <button type="button" onClick={onEntrar} className={boton + " border border-line-2 bg-paper text-ink"}>
              <Google size={18} />
              Entrar con Google
            </button>
          </div>
        )}
        {aviso && <p role="status" className="m-0 max-w-[340px] rounded-xl bg-rose-soft px-3 py-2 text-[13px] text-rose-ink">{aviso}</p>}
      </div>
    </div>
  );
}
