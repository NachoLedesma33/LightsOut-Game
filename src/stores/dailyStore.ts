import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getDailyDateKey } from '../core/dailyPuzzle'

export interface DailyResult {
  time: number
  moves: number
  hintsUsed: number
  completedAt: string
}

interface DailyState {
  completedPuzzles: Record<string, DailyResult>
  currentStreak: number
  bestStreak: number
}

interface DailyActions {
  recordCompletion: (result: Omit<DailyResult, 'completedAt'>) => void
  isTodayCompleted: () => boolean
  getTodayResult: () => DailyResult | null
  clearDaily: () => void
}

type DailyStore = DailyState & DailyActions

const initialState: DailyState = {
  completedPuzzles: {},
  currentStreak: 0,
  bestStreak: 0,
}

export const useDailyStore = create<DailyStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      recordCompletion: (result) =>
        set((state) => {
          const today = getDailyDateKey()
          if (state.completedPuzzles[today]) return state

          const yesterday = getPreviousDateKey(today)
          const completedYesterday = !!state.completedPuzzles[yesterday]
          const newStreak = completedYesterday ? state.currentStreak + 1 : 1

          return {
            completedPuzzles: {
              ...state.completedPuzzles,
              [today]: { ...result, completedAt: new Date().toISOString() },
            },
            currentStreak: newStreak,
            bestStreak: Math.max(state.bestStreak, newStreak),
          }
        }),

      isTodayCompleted: () => {
        const today = getDailyDateKey()
        return today in get().completedPuzzles
      },

      getTodayResult: () => {
        const today = getDailyDateKey()
        return get().completedPuzzles[today] ?? null
      },

      clearDaily: () => set({ ...initialState }),
    }),
    { name: 'lightsout-daily' },
  ),
)

function getPreviousDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const prev = new Date(Date.UTC(y, m - 1, d - 1))
  return `${prev.getUTCFullYear()}-${String(prev.getUTCMonth() + 1).padStart(2, '0')}-${String(prev.getUTCDate()).padStart(2, '0')}`
}
