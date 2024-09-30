import { SetStore } from '@/type-utils'
import { type Socket } from 'socket.io-client'
import { create } from 'zustand'

type StoreValues = {
  socket: Socket | null
}

type StoreFunctions = {
  setSocket: SetStore<StoreValues['socket']>
}

type Store = StoreValues & StoreFunctions

const initialStoreValues: StoreValues = {
  socket: null
}

export const useWS = create<Store>((set) => ({
  ...initialStoreValues,
  setSocket: socket => set({ socket })
}))