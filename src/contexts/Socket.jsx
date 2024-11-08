// SocketContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(() => null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000",
      {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        timeout: 10000,
      }
    );

    setSocket(newSocket);
    return () => {
      newSocket.off();
      newSocket.disconnect();
    };
  }, []);

  const memoizedSocket = useMemo(() => socket, [socket]);

  return (
    <SocketContext.Provider value={memoizedSocket}>
      {children}
    </SocketContext.Provider>
  );
};
