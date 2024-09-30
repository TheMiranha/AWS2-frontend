import { SetStore } from "@/type-utils"
import { Image } from "./types"
import { create } from 'zustand'

type StoreValues = {
  images: Image[]
}

type StoreFunctions = {
  setImages: SetStore<StoreValues['images']>
}

type Store = StoreValues & StoreFunctions

const initialValues: StoreValues = {
  images: []
}

export const useECR = create<Store>(set => ({
  ...initialValues,
  setImages: images => set({ images })
}))