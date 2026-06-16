import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface InfiniteState {
  highScore: number
  bestStreak: number
  totalBoards: number
  setHighScore: (score: number) => void
  setBestStreak: (streak: number) => void
  incrementTotalBoards: () => void
}

export const useInfiniteStore = create<InfiniteState>()(
  persist(
    (set) => ({
      highScore: 0,
      bestStreak: 0,
      totalBoards: 0,
      setHighScore: (score) => set((s) => ({ highScore: Math.max(s.highScore, score) })),
      setBestStreak: (streak) => set((s) => ({ bestStreak: Math.max(s.bestStreak, streak) })),
      incrementTotalBoards: () => set((s) => ({ totalBoards: s.totalBoards + 1 })),
    }),
    { name: 'lightsout-infinite' },
  ),
)
