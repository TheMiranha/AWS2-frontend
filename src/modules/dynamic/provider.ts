import { useEffect } from "react"
import { useWS } from "../ws/store"
import { useDynamic } from "./store"
import { Dynamics } from "./types"

export function DynamicProvider() {

  const { socket } = useWS()
  const { listeners } = useDynamic()

  const handleDynamic = (data: Dynamics) => {
    switch (data.service) {
      case 'ecr':
        listeners.ecr.forEach(fn => fn(data))
        break
    }
  }

  const prepareListeners = () => {
    socket?.removeListener('dynamic', handleDynamic)
    socket?.on('dynamic', handleDynamic)
  }

  useEffect(() => {
    prepareListeners()
  }, [socket, listeners])

  return false
}