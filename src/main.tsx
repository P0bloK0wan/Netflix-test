import React from "react";
import { createRoot } from "react-dom/client";
import { CatalogLoader } from "./components/CatalogLoader";
import "./styles.css";
import "./motion.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CatalogLoader />
  </React.StrictMode>,
);
