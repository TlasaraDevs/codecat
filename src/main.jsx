import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bangers/400.css";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App.jsx";
import { trackPageView } from "@/lib/analytics";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Outside React, so StrictMode's double effects can't record a view twice.
trackPageView();
