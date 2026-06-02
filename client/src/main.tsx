import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import LoadingOverlay from "@/shared/components/ui/LoadingOverlay";
import "@/styles/globals.css";

import { StoreProvider } from "@/app/providers/StoreProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        <LoadingOverlay />
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
