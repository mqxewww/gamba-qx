import { useEffect } from "react";
import { Socket } from "socket.io-client";

type EventCallback<T> = (data: T) => void;

export function useSocketEvent<K>(
  socket: Socket | null,
  event: string,
  callback: EventCallback<K>
): void {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
}
