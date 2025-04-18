"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  crashGamesSocket: Socket | null;
  crashGamesConnected: boolean;

  usersSocket: Socket | null;
  usersConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  crashGamesSocket: null,
  crashGamesConnected: false,
  usersSocket: null,
  usersConnected: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [crashGamesSocket, setCrashGamesSocket] = useState<Socket | null>(null);
  const [usersSocket, setUsersSocket] = useState<Socket | null>(null);
  const [crashGamesConnected, setCrashGamesConnected] = useState(false);
  const [usersConnected, setUsersConnected] = useState(false);

  useEffect(() => {
    const crashGamesSocketInstance = io(
      `${process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL}/crash-games`,
      {
        transports: ["websocket"],
        autoConnect: true,
      }
    );

    const usersSocketInstance = io(
      `${process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL}/users`,
      {
        transports: ["websocket"],
        autoConnect: true,
      }
    );

    crashGamesSocketInstance.on("connect", () => {
      setCrashGamesConnected(true);
    });
    crashGamesSocketInstance.on("disconnect", () =>
      setCrashGamesConnected(false)
    );

    usersSocketInstance.on("connect", () => setUsersConnected(true));
    usersSocketInstance.on("disconnect", () => setUsersConnected(false));

    setCrashGamesSocket(crashGamesSocketInstance);
    setUsersSocket(usersSocketInstance);

    return () => {
      if (crashGamesSocketInstance) crashGamesSocketInstance.disconnect();

      if (usersSocketInstance) usersSocketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        crashGamesSocket,
        usersSocket,
        crashGamesConnected,
        usersConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
