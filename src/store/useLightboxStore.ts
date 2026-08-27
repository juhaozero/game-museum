import { create } from 'zustand'
import type { ScreenshotItem } from '@/types/manifest'

type LightboxState = {
  items: ScreenshotItem[]
  index: number
  isOpen: boolean
  openAt: (items: ScreenshotItem[], index: number) => void
  close: () => void
  setIndex: (index: number) => void
  next: () => void
  prev: () => void
}

export const useLightboxStore = create<LightboxState>((set, get) => ({
  items: [],
  index: 0,
  isOpen: false,
  openAt: (items, index) => {
    if (items.length === 0) return
    const safeIndex = Math.max(0, Math.min(index, items.length - 1))
    set({ items, index: safeIndex, isOpen: true })
  },
  close: () => set({ isOpen: false }),
  setIndex: (index) => {
    const { items } = get()
    if (items.length === 0) return
    set({ index: Math.max(0, Math.min(index, items.length - 1)) })
  },
  next: () => {
    const { items, index } = get()
    if (items.length === 0) return
    set({ index: (index + 1) % items.length })
  },
  prev: () => {
    const { items, index } = get()
    if (items.length === 0) return
    set({ index: (index - 1 + items.length) % items.length })
  },
}))
