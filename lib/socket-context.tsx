"use client";

import { defaultUsersListData } from "@/domains/users/data/default-users-list.data";
import { User } from "@/domains/users/types/user.type";
import { UsersList } from "@/domains/users/types/users-list.type";
import { useSocketEvent } from "@/lib/use-socket-event";
import { usePathname, useSearchParams } from "next/navigation";

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
  crashGamesSocketConnected: boolean;

  usersSocket: Socket | null;
  usersSocketConnected: boolean;

  userData: User | null;
  usersList: UsersList;
}

const SocketContext = createContext<SocketContextType>({
  crashGamesSocket: null,
  crashGamesSocketConnected: false,
  usersSocket: null,
  usersSocketConnected: false,
  userData: null,
  usersList: defaultUsersListData,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [crashGamesSocket, setCrashGamesSocket] = useState<Socket | null>(null);
  const [usersSocket, setUsersSocket] = useState<Socket | null>(null);
  const [crashGamesSocketConnected, setCrashGamesSocketConnected] =
    useState(false);
  const [usersSocketConnected, setUsersSocketConnected] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<UsersList>(defaultUsersListData);
  const [isInitialized, setIsInitialized] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      window.history.replaceState({}, "", pathname);
    }

    setIsInitialized(true);
  }, [searchParams, pathname]);

  useEffect(() => {
    if (!isInitialized) return;

    const authOptions = {
      transports: ["websocket"],
      autoConnect: true,
    };

    const crashGamesSocketInstance = io(
      `${process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL}/crash-games`,
      authOptions
    );

    const usersSocketInstance = io(
      `${process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL}/users`,
      authOptions
    );

    crashGamesSocketInstance.on("connect", () => {
      setCrashGamesSocketConnected(true);

      crashGamesSocketInstance.emit("client/game_client_connected", {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("email"),
      });
    });
    crashGamesSocketInstance.on("disconnect", () =>
      setCrashGamesSocketConnected(false)
    );

    usersSocketInstance.on("connect", () => {
      setUsersSocketConnected(true);

      usersSocketInstance.emit("client/user_client_connected", {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("email"),
      });
    });
    usersSocketInstance.on("disconnect", () => setUsersSocketConnected(false));

    setCrashGamesSocket(crashGamesSocketInstance);
    setUsersSocket(usersSocketInstance);

    return () => {
      if (crashGamesSocketInstance) crashGamesSocketInstance.disconnect();

      if (usersSocketInstance) usersSocketInstance.disconnect();
    };
  }, [isInitialized]);

  useSocketEvent<User>(usersSocket, "server/user_data", (data) => {
    console.log({ data });
    setUserData(data);
  });

  useSocketEvent<UsersList>(usersSocket, "server/users_list", (data) => {
    setUsersList(data);
  });

  useSocketEvent<unknown>(crashGamesSocket, "server/error", (data) => {
    console.log(`Error from crashGamesSocket 'server/error', ${data}`);
  });

  useSocketEvent<unknown>(usersSocket, "server/error", (data) => {
    console.log(`Error from usersSocket 'server/error', ${data}`);
  });

  return (
    <SocketContext.Provider
      value={{
        crashGamesSocket,
        usersSocket,
        crashGamesSocketConnected,
        usersSocketConnected,
        userData,
        usersList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
