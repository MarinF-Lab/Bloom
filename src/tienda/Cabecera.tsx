import { SEASONS } from "../data/tienda";
import { clp } from "../core/money";
import { Bag, Calendar, Chat, Clock, Instagram, Sparkle, Truck } from "../ui/icons";
import { Logo } from "../ui/Logo";
import { Eyebrow, externo } from "./comun";
import { instagramUrl, textoAnticipacion, useTienda, whatsappUrl } from "./contexto";

export function AvisoTemporada() {
  const { config } = useTienda();
  if (!config.abierta) {
    return (
      <div role="status" className="bg-cocoa text-cream">
        <div className="mx-auto max-w-[1180px] px-6 py-3 text-center text-[14px]">
          <strong className="font-semibold">Por ahora no estamos recibiendo pedidos.</strong> Puedes ver el catálogo y escribirnos por WhatsApp.
        </div>
      </div>
    );
  }
  if (config.temporada === "Ninguna") return null;
  const s = SEASONS[config.temporada];
  return (
    <div style={{ background: s.bg, color: s.fg }}>
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 px-6 py-3 text-center text-[14px]">
        <Sparkle size={16} />
        <strong className="font-semibold">{s.title}</strong>
        <span>{s.text}</span>
      </div>
    </div>
  );
}

const NAV = [
  ["#catalogo", "Catálogo"],
  ["#arma", "Arma tu torta"],
  ["#packs", "Packs"],
  ["#encargos", "Encargos"],
  ["#preguntas", "Preguntas"],
  ["#contacto", "Contacto"],
] as const;

export function Cabecera({ cartCount }: { cartCount: number }) {
  return (
    <header className="border-b border-line bg-cream">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-[26px] gap-y-2.5 px-6 py-3">
        <a href="#inicio" className="flex items-center gap-2.5 text-ink">
          <Logo className="size-[50px] rounded-full border border-line" />
          <span className="font-display text-[30px] font-semibold italic">Bloom</span>
        </a>
        <nav aria-label="Principal" className="flex flex-1 flex-wrap gap-x-5 text-[14px]">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="py-2.5">
              {label}
            </a>
          ))}
        </nav>
        <a href="#pedido" className="flex min-h-11 items-center gap-2 rounded-[22px] bg-cocoa px-[18px] text-[14px] font-medium text-cream">
          <Bag size={18} />
          Mi pedido ({cartCount})
        </a>
      </div>
    </header>
  );
}

export function Portada() {
  const { config } = useTienda();
  return (
    <section id="inicio" className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-11 px-6 pt-14 pb-[60px]">
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
        <Eyebrow>PASTELERÍA CASERA · RETIRO</Eyebrow>
        <h1 className="m-0 font-display text-[clamp(44px,6vw,70px)] font-semibold leading-none text-ink">
          Dulces momentos que <span className="italic text-rose-deep">florecen</span>
        </h1>
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.65] text-muted">
          {config.texto}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#catalogo" className="flex min-h-12 items-center rounded-3xl bg-cocoa px-[26px] font-medium text-cream">
            Ver catálogo
          </a>
          <a href="#arma" className="flex min-h-12 items-center rounded-3xl bg-rose px-[26px] font-medium text-rose-ink">
            Arma tu torta
          </a>
        </div>
        <div className="flex flex-wrap gap-2 text-[13px] font-medium">
          <span className="flex items-center gap-1.5 rounded-[14px] bg-olive-soft px-3 py-2 text-olive-ink">
            <Clock size={14} />
            Pedidos con {textoAnticipacion(config.horasMinimas)} de anticipación
          </span>
          {config.envioGratisDesde > 0 && (
            <span className="flex items-center gap-1.5 rounded-[14px] bg-honey px-3 py-2 text-honey-ink">
              <Truck size={14} />
              Despacho gratis sobre {clp(config.envioGratisDesde)}
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-[14px] bg-rose-soft px-3 py-2 text-rose-ink">
            <Calendar size={14} sw={2} />
            {config.horario}
          </span>
        </div>
      </div>
      <div className="relative mx-auto max-w-[460px] flex-[1_1_340px]">
        <div className="absolute inset-[8%_-4%_-4%_8%] rounded-[40px] bg-rose" />
        <Logo
          alt="Logo de Bloom Pastelería: un gato blanco dormido rodeado de una rama de flores de cerezo"
          className="relative block aspect-square w-full rounded-[36px] border border-line"
        />
      </div>
    </section>
  );
}

export function Urgente() {
  const { config } = useTienda();
  const boton = "flex min-h-[46px] items-center gap-2 rounded-[23px] px-5 text-[14px] font-medium";
  return (
    <section aria-labelledby="urgente-t" className="bg-rose-deep text-paper">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-7 gap-y-3.5 px-6 py-[22px]">
        <div className="min-w-0 flex-[1_1_420px]">
          <h2 id="urgente-t" className="m-0 font-display text-[30px] font-semibold leading-[1.1]">
            ¿Necesitas un pedido urgente?
          </h2>
          <p className="mt-1 mb-0 text-[14.5px] text-[#FBE3EA]">
            Si tenemos los insumos, te hacemos un espacio. Escríbenos directamente por cualquiera de estos medios.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a href={whatsappUrl(config.whatsapp)} {...externo} className={boton + " bg-paper text-rose-ink"}>
            <Chat size={17} />
            WhatsApp
          </a>
          <a href={instagramUrl(config.instagram)} {...externo} className={boton + " bg-paper text-rose-ink"}>
            <Instagram size={17} />
            Instagram
          </a>
          <a href="#encargos" className={boton + " border-[1.5px] border-[#FBE3EA] text-paper"}>
            Formulario
          </a>
        </div>
      </div>
    </section>
  );
}
