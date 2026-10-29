// Íconos de trazo del diseño, en línea. Todos son decorativos (aria-hidden).

import type { CSSProperties, ReactNode } from "react";

interface P {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

function Svg({ size = 20, sw = 1.8, fill = false, className, style, children }: P & { sw?: number; fill?: boolean; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
}

export const Plus = (p: P) => <Svg sw={2} {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const Bell = (p: P) => <Svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" /><path d="M10 20a2 2 0 0 0 4 0" /></Svg>;
export const ChevronRight = (p: P) => <Svg sw={2.4} {...p}><path d="M9 6l6 6-6 6" /></Svg>;
export const ChevronDown = (p: P) => <Svg sw={2} {...p}><path d="M6 9l6 6 6-6" /></Svg>;
export const Cake = (p: P & { sw?: number }) => <Svg {...p}><path d="M4 20h16M5 20v-6h14v6M5 14c2 1.5 4 1.5 7 0s5-1.5 7 0M8 14v-3h8v3M12 11V7" /></Svg>;
export const Book = (p: P & { sw?: number }) => <Svg {...p}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6" /></Svg>;
export const Clipboard = (p: P) => <Svg {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h4" /></Svg>;
export const Calendar = (p: P & { sw?: number }) => <Svg {...p}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></Svg>;
export const Dots = (p: P) => <Svg fill {...p}><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></Svg>;
export const Sparkle = (p: P) => <Svg fill {...p}><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" /></Svg>;
export const Bag = (p: P) => <Svg {...p}><path d="M5 8h14l-1.2 11H6.2z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></Svg>;
export const Clock = (p: P) => <Svg sw={2} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const Truck = (p: P) => <Svg sw={2} {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></Svg>;
export const Chat = (p: P) => <Svg {...p}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></Svg>;
export const Instagram = (p: P) => <Svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /></Svg>;
export const Gift = (p: P) => <Svg sw={1.6} {...p}><rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M2.5 9h19M12 9v11M12 9c-1.5-3-5-4-5.5-2S9 9 12 9zM12 9c1.5-3 5-4 5.5-2S15 9 12 9z" /></Svg>;
export const Photo = (p: P) => <Svg sw={1.5} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 8" /></Svg>;

// Ilustraciones grandes de las tarjetas del catálogo.
export const BigTorta = (p: P) => <Svg sw={1.1} {...p}><path d="M3.5 20.5h17M5 20.5v-6.5h14v6.5M5 14c2 1.5 4 1.5 7 0s5-1.5 7 0M8 14v-3h8v3M12 11V7.5" /><path d="M12 4.5c.8.8.8 1.7 0 2.5-.8-.8-.8-1.7 0-2.5z" /></Svg>;
export const BigPie = (p: P) => <Svg sw={1.1} {...p}><path d="M3 13h18l-1.5 5.5h-15z" /><path d="M3 13c2-5 16-5 18 0" /><path d="M7 11l2 2M11 9.6l1.5 3.4M16 10.2l-1 2.8" /></Svg>;
export const BigPostre = (p: P) => <Svg sw={1.1} {...p}><rect x="3.5" y="8" width="17" height="11" rx="1.5" /><path d="M3.5 11.5h17M3.5 15h17" /><path d="M7 6l.5 2M12 5v3M17 6l-.5 2" /></Svg>;
export const BigPan = (p: P) => <Svg sw={1.1} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 12c0-1 1.5-1.5 2.2-.6.9 1.2-.2 3.3-2.2 3.4-2.6.1-4-2.8-2.6-5 1.7-2.6 6-2.4 7.4.7 1.5 3.4-.8 7.1-4.8 7.2" /></Svg>;
export const Gear = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Svg>;
export const Trash = (p: P) => <Svg {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>;
export const Google = (p: P) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" aria-hidden="true" className={p.className}>
    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4z" />
  </svg>
);
