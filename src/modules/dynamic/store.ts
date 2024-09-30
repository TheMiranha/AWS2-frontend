import { Dynamics, Service } from "./types"
import { create } from "zustand"

type StoreValues = {
  listeners: Record<Service, ((e: Dynamics) => void)[]>
}

type StoreFunctions = {
  addListener: (e: { service: Service, fn: ((e: Dynamics) => void) }) => void,
  removeListener: (e: { service: Service, fn: ((e: Dynamics) => void) }) => void
}

type Store = StoreValues & StoreFunctions

const initialValues: StoreValues = {
  listeners: {
    ecr: []
  }
}

export const useDynamic = create<Store>(set => ({
  ...initialValues,
  addListener: (listener) => set(prev => ({
    listeners: {
      ...prev.listeners,
      [listener.service]: [...prev.listeners[listener.service], listener.fn]
    }
  })),
  removeListener: (listener) => set(prev => ({
    listeners: {
      ...prev.listeners,
      [listener.service]: prev.listeners[listener.service].filter(fn => fn != listener.fn)
    }
  })),
}))