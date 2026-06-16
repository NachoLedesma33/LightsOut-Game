import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameMode, DifficultyTier } from '../core/types'

export interface GameRecord {
  id: string
  date: string
  size: number
  mode: GameMode
  difficulty: DifficultyTier
  moves: number
  time: number
  hintsUsed: number
  won: boolean
}

export interface StatisticsState {
  totalGames: number
  wonGames: number
  gamesBySize: Record<string, number>
  gamesByDifficulty: Record<DifficultyTier, number>
  totalMoves: number
  totalTime: number
  totalHints: number
  bestTime: Record<string, number | null>
  leastMoves: Record<string, number | null>
  currentStreak: number
  bestStreak: number
  lastPlayedDate: string | null
  recentGames: GameRecord[]
}

interface StatisticsActions {
  recordGame: (record: GameRecord) => void
  clearStats: () => void
}

type StatisticsStore = StatisticsState & StatisticsActions

function makeKey(size: number, difficulty: DifficultyTier, mode: GameMode): string {
  return `${size}x${size}_${difficulty}_${mode}`
}

const initialState: StatisticsState = {
  totalGames: 0,
  wonGames: 0,
  gamesBySize: {},
  gamesByDifficulty: { easy: 0, medium: 0, hard: 0, expert: 0 },
  totalMoves: 0,
  totalTime: 0,
  totalHints: 0,
  bestTime: {},
  leastMoves: {},
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
  recentGames: [],
}

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set) => ({
      ...initialState,

      recordGame: (record) =>
        set((state) => {
          const key = makeKey(record.size, record.difficulty, record.mode)
          const newRecent = [record, ...state.recentGames].slice(0, 50)

          const wonDelta = record.won ? 1 : 0
          const newStreak = record.won ? state.currentStreak + 1 : 0

          const prevBestTime = state.bestTime[key] ?? Infinity
          const prevLeastMoves = state.leastMoves[key] ?? Infinity

          return {
            totalGames: state.totalGames + 1,
            wonGames: state.wonGames + wonDelta,
            gamesBySize: {
              ...state.gamesBySize,
              [record.size + 'x' + record.size]: (state.gamesBySize[record.size + 'x' + record.size] ?? 0) + 1,
            },
            gamesByDifficulty: {
              ...state.gamesByDifficulty,
              [record.difficulty]: state.gamesByDifficulty[record.difficulty] + 1,
            },
            totalMoves: state.totalMoves + record.moves,
            totalTime: state.totalTime + record.time,
            totalHints: state.totalHints + record.hintsUsed,
            bestTime: record.won && record.time < prevBestTime
              ? { ...state.bestTime, [key]: record.time }
              : state.bestTime,
            leastMoves: record.won && record.moves < prevLeastMoves
              ? { ...state.leastMoves, [key]: record.moves }
              : state.leastMoves,
            currentStreak: newStreak,
            bestStreak: Math.max(state.bestStreak, newStreak),
            lastPlayedDate: record.date,
            recentGames: newRecent,
          }
        }),

      clearStats: () => set({ ...initialState }),
    }),
    { name: 'lightsout-statistics' },
  ),
)
