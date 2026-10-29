import { useState, type FormEvent } from "react";
import { ENCARGO_TIPOS, PACKS, faq } from "../data/tienda";
import { fechaLarga, linkWhatsApp } from "../core/cart";
import { soloDigitos } from "../core/modelo";
import { enviarPedidoTienda } from "../store/useTiendaPublica";
import { instagramUrl, useTienda, whatsappUrl } from "./contexto";
import { Gift } from "../ui/icons";
import { Gatito } from "../ui/Logo";
import { Eyebrow, H2, area, campo, externo } from "./comun";

const CAJA = "mx-auto max-w-[1180px] px-6";

export function Packs() {
  const { config } = useTienda();
  return (
    <section id="packs" className="bg-honey">
      <div className={CAJA + " flex flex-col gap-[26px] py-16"}>
        <div>
          <Eyebrow className="text-honey-ink">PACKS Y CAJAS</Eyebrow>
          <H2 className="mt-1.5">Para regalar y celebrar</H2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {PACKS.map((k) => (
            <article key={k.name} className="flex flex-col gap-2.5 rounded-3xl bg-paper p-[22px]">
              <div className="flex size-[52px] items-center justify-center rounded-2xl bg-rose-soft text-rose-deep">
                <Gift size={26} />
              </div>
              <h3 className="m-0 font-display text-[26px] font-semibold leading-[1.1]">{k.name}</h3>
              <p className="m-0 flex-1 text-[14px] leading-[1.55] text-muted">{k.desc}</p>
              <a
                href={linkWhatsApp(config.whatsapp, "Hola Bloom, quiero cotizar: " + k.name)}
                {...externo}
                className="flex min-h-11 items-center self-start rounded-[22px] bg-cocoa px-5 text-[14px] font-medium text-cream"
              >
                Cotizar
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Encargos() {
  const { config } = useTienda();
  const [enviado, setEnviado] = useState(false);

  // El encargo se manda por WhatsApp con lo que escribió la persona.
  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => String(d.get(k) ?? "").trim();
    const lineas = [
      `Hola Bloom, quiero hacer un encargo: ${v("tipo")}.`,
      v("nombre") && `Nombre: ${v("nombre")}.`,
      v("telefono") && `Teléfono: ${v("telefono")}.`,
      v("fecha") && `Fecha: ${fechaLarga(v("fecha"))}.`,
      v("detalle") && `Idea: ${v("detalle")}`,
    ].filter(Boolean);
    window.open(linkWhatsApp(config.whatsapp, lineas.join(" ")), "_blank", "noopener");
    setEnviado(true);
    // También queda en la gestión, si dejó nombre y teléfono.
    if (v("nombre") && soloDigitos(v("telefono")).length >= 8) {
      void enviarPedidoTienda({
        cliente: v("nombre").slice(0, 120),
        whatsapp: soloDigitos(v("telefono")).slice(0, 40),
        items: [{ nombre: `Encargo: ${v("tipo")}`, cant: 1, precio: 0 }],
        producto: `Encargo: ${v("tipo")}`.slice(0, 300),
        precio: 0,
        abono: 0,
        fecha: v("fecha"),
        entrega: "",
        notas: v("detalle").slice(0, 300),
      });
    }
  }

  return (
    <section id="encargos" className="bg-rose">
      <div className={CAJA + " flex flex-wrap items-start gap-10 py-[72px]"}>
        <div className="min-w-0 flex-[1_1_300px]">
          <Eyebrow className="text-rose-ink">ENCARGOS PERSONALIZADOS</Eyebrow>
          <H2 className="mt-1.5 mb-3">Mesas dulces y pedidos especiales</H2>
          <p className="m-0 text-[15px] leading-[1.65] text-[#6B3A48]">Cumpleaños, baby showers, matrimonios o un antojo. Cuéntanos la idea y la diseñamos contigo.</p>
        </div>
        <form onSubmit={enviar} className="grid min-w-0 flex-[1.4_1_420px] grid-cols-1 gap-4 rounded-[28px] bg-paper p-[26px] sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="enc-nombre" className="text-[13px] font-medium">Nombre</label>
            <input id="enc-nombre" name="nombre" type="text" autoComplete="name" className={campo} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="enc-tel" className="text-[13px] font-medium">Teléfono</label>
            <input id="enc-tel" name="telefono" type="tel" autoComplete="tel" placeholder="+56 9" className={campo} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="enc-tipo" className="text-[13px] font-medium">¿Qué necesitas?</label>
            <select id="enc-tipo" name="tipo" className={campo + " px-3"}>
              {ENCARGO_TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="enc-fecha" className="text-[13px] font-medium">Fecha</label>
            <input id="enc-fecha" name="fecha" type="date" className={campo} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="enc-detalle" className="text-[13px] font-medium">Cuéntanos tu idea</label>
            <textarea id="enc-detalle" name="detalle" rows={3} placeholder="Cantidad de personas, sabores, colores, temática…" className={area} />
          </div>
          <div className="flex flex-wrap items-center gap-3.5 sm:col-span-2">
            <button type="submit" className="min-h-[50px] rounded-[25px] border-none bg-rose-deep px-7 text-[15px] font-medium text-paper">
              Enviar encargo
            </button>
            {enviado && <span role="status" className="text-[14px] font-medium text-olive-ink">¡Gracias! Te escribiremos para confirmar tu encargo.</span>}
          </div>
        </form>
      </div>
    </section>
  );
}

export function Sobre() {
  return (
    <section id="sobre" className={CAJA + " flex flex-wrap items-center gap-9 py-[72px]"}>
      <Gatito width={220} alt="Gatito dormido del logo de Bloom" className="rounded-[28px] bg-cream" />
      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
        <Eyebrow>SOBRE MÍ</Eyebrow>
        <H2>Hecho con amor en Retiro</H2>
        <p className="m-0 max-w-[600px] text-[16px] leading-[1.7] text-muted">
          Bloom es una pastelería casera y personalizada, hecha con amor en Retiro. Cada torta, pie y postre se prepara por encargo para tus momentos especiales.
        </p>
        <p className="m-0 max-w-[600px] text-[14px] leading-[1.7] text-faint">[Tu historia: cómo empezó Bloom y qué te inspira]</p>
      </div>
    </section>
  );
}

export function Preguntas() {
  const { config } = useTienda();
  return (
    <section id="preguntas" className="border-y border-line bg-paper">
      <div className={CAJA + " flex flex-col gap-6 py-16"}>
        <div>
          <Eyebrow>PREGUNTAS FRECUENTES</Eyebrow>
          <H2 className="mt-1.5">Antes de pedir</H2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
          {faq(config).map((f) => (
            <div key={f.q} className="flex flex-col gap-1.5 rounded-[20px] bg-cream px-5 py-[18px]">
              <h3 className="m-0 text-[15px] font-semibold">{f.q}</h3>
              <p className="m-0 text-[14px] leading-[1.6] text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pie() {
  const { config } = useTienda();
  return (
    <footer className="bg-cocoa text-cream">
      <div className={CAJA + " flex flex-wrap items-center justify-between gap-5 py-9"}>
        <div className="flex items-center gap-3.5">
          <Gatito width={96} className="rounded-2xl bg-cream" />
          <div>
            <div className="font-display text-[30px] font-semibold italic leading-none">Bloom</div>
            <div className="mt-1 text-[12px] text-foam">Dulces momentos que florecen</div>
          </div>
        </div>
        <nav aria-label="Redes" className="flex flex-wrap gap-x-[18px] gap-y-2 text-[14px]">
          <a href={whatsappUrl(config.whatsapp)} {...externo} className="py-2.5 text-cream underline">WhatsApp</a>
          <a href={instagramUrl(config.instagram)} {...externo} className="py-2.5 text-cream underline">Instagram</a>
          <a href="#encargos" className="py-2.5 text-cream underline">Encargos</a>
        </nav>
        <div className="text-[12px] text-foam">© {new Date().getFullYear()} {config.nombre}</div>
      </div>
    </footer>
  );
}
