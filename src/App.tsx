import { useEffect, useState } from "react";
import { Tienda } from "./tienda/Tienda";
import { Gestion } from "./gestion/Gestion";
import { vistaDesdeHash, vistaInicial } from "./core/vista";

const inicial = vistaInicial(location.href, "Capacitor" in window);

export function App() {
  const [vista, setVista] = useState(inicial);

  // Los enlaces internos de la tienda (#catalogo, #pedido…) no cambian de pantalla.
  useEffect(() => {
    const onHash = () => setVista((v) => vistaDesdeHash(location.hash, v));
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = vista === "gestion" ? "Bloom · App de gestión" : "Bloom Pastelería";
  }, [vista]);

  return vista === "gestion" ? <Gestion /> : <Tienda />;
}
