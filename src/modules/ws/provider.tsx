import { useEffect } from "react";
import { io } from "socket.io-client";
import { useWS } from "./store";

export function WSProvider() {

  const { setSocket } = useWS()

  const initializeConnection = () => {
    const connection = io('http://localhost:3000', { transports: ['websocket'] })

    setSocket(connection)
  }

  useEffect(() => {
    initializeConnection()
  }, [])

  return false

}