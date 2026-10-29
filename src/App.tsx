import { useEffect, useState } from "react";
import { Tienda } from "./tienda/Tienda";
import { Gestion } from "./gestion/Gestion";

type Vista = "tienda" | "gestion";

/** La web abre la tienda; la app de Android abre la gestión. "#gestion" y "#tienda" eligen a mano. */
function vistaDesdeHash(actual: Vista): Vista {
  if (location.hash === "#gestion") return "gestion";
  if (location.hash === "#tienda") return "tienda";
  return actual;
}

const inicial: Vista = vistaDesdeHash("Capacitor" in window ? "gestion" : "tienda");

export function App() {
  const [vista, setVista] = useState<Vista>(inicial);

  // Los enlaces internos de la tienda (#catalogo, #pedido…) no cambian de pantalla.
  useEffect(() => {
    const onHash = () => setVista((v) => vistaDesdeHash(v));
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = vista === "gestion" ? "Bloom · App de gestión" : "Bloom Pastelería";
  }, [vista]);

  return vista === "gestion" ? <Gestion /> : <Tienda />;
}
