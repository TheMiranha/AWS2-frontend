import { useEffect } from "react";
import { toast } from "sonner";
import { useWS } from "../ws/store";

type NotificationType = 'success' | 'error' | 'warning'

type Notification = {
  type: NotificationType,
  message: string
}

export function NotificationsProvider() {

  const { socket } = useWS()

  const initializeListeners = () => {
    if (!socket) return

    socket.on('notifications', (data: Notification) => {
      const { type, message: description } = data
      switch (type) {
        case 'success':
          toast.success('Sucesso', { description })
          break
        case 'warning':
          toast.warning('Aviso', { description })
          break
        case 'error':
          toast.error('Erro', { description })
          break
        default:
          toast(description)
          break
      }
    })

  }

  useEffect(() => {
    if (!socket) return
    initializeListeners()
  }, [socket])

  return false

}