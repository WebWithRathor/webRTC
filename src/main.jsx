import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Approutes from "./routes/Approutes.jsx";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./contexts/Socket.jsx";
import { PeerProvider } from "./contexts/Peer.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PeerProvider>
      <SocketProvider>
        <Approutes />
      </SocketProvider>
    </PeerProvider>
  </BrowserRouter>
);
