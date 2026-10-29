import logo from "../assets/logo.jpg";
import gatito from "../assets/gatito.jpg";

export { logo };

/** Logo completo (gatito, rama y el nombre Bloom). */
export function Logo({ className = "", alt = "" }: { className?: string; alt?: string }) {
  return <img src={logo} alt={alt} draggable={false} className={"object-cover " + className} />;
}

/** Solo el gatito dormido con la rama, sin palabras. `width` en px (es cuadrado). */
export function Gatito({ width, className = "", alt = "" }: { width: number; className?: string; alt?: string }) {
  return <img src={gatito} alt={alt} draggable={false} width={width} height={width} className={"block shrink-0 object-cover " + className} style={{ width, height: width }} />;
}
