import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routes.tsx";
import { RouterProvider } from "react-router-dom";
import { IconContext } from "react-icons";
import "./index.css";
import socket from "./socket.ts"; // important!

socket;
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <IconContext.Provider value={{ className: "react-icons" }}>
        <RouterProvider router={router} />
      </IconContext.Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
