import { create } from "zustand"

type AppState = {
  isReady: boolean
  setReady: (isReady: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isReady: true,
  setReady: (isReady) => set({ isReady }),
}))
