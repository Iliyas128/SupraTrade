import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
    <HelmetProvider>
      <div className="page-background">
        <App />
      </div>
    </HelmetProvider>
    </I18nextProvider>
  </StrictMode>,
);
