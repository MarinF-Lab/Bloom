import logo from "../assets/logo.jpg";

export { logo };

/** Logo completo (gatito, rama y texto). */
export function Logo({ className = "", alt = "" }: { className?: string; alt?: string }) {
  return <img src={logo} alt={alt} draggable={false} className={"object-cover " + className} />;
}

/** Solo el gatito dormido, recortado del logo. `width` en px; el alto sale de la proporción. */
export function Gatito({ width, className = "", alt = "" }: { width: number; className?: string; alt?: string }) {
  const img = width * 2.02;
  return (
    <div className={"relative shrink-0 overflow-hidden " + className} style={{ width, height: Math.round(width * 0.806) }}>
      <img
        src={logo}
        alt={alt}
        draggable={false}
        className="absolute max-w-none"
        style={{ width: img, height: img, left: -img * 0.272, top: -img * 0.288 }}
      />
    </div>
  );
}
