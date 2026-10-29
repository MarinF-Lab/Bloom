import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "./index.css";
import { App } from "./App";

// App instalable: el service worker solo en la página publicada (https), no en el visor de claude.ai
// ni dentro de la app de Android (que ya trae todo).
const inClaude = /claude\.ai|claudeusercontent/.test(location.hostname) || window.top !== window || "Capacitor" in window;
if ("serviceWorker" in navigator && location.protocol === "https:" && !inClaude) {
  addEventListener("load", () => { navigator.serviceWorker.register("./sw.js").catch(() => {}); });
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<StrictMode><App /></StrictMode>);
