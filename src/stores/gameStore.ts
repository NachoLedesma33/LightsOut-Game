import { create } from 'zustand'
import { GameManager } from '../core/gameManager'
import type { Move, GameStatus, GameMode, DifficultyTier, HintLevel, HintData } from '../core/types'
import { useStatisticsStore } from './statisticsStore'

interface GameState {
  grid: boolean[][]
  size: number
  mode: GameMode
  difficulty: DifficultyTier
  status: GameStatus
  moveCount: number
  moves: Move[]
  elapsedTime: number
  hintLevel: HintLevel
  hintData: HintData | null
  hintsUsed: number
}

interface GameActions {
  initGame: (size: number, difficulty?: DifficultyTier, mode?: GameMode) => void
  makeMove: (row: number, col: number) => void
  reset: () => void
  undo: () => void
  destroy: () => void
  useHint: () => void
}

let manager: GameManager | null = null
let timerInterval: ReturnType<typeof setInterval> | null = null

function syncFromManager(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  if (!manager) return
  const snap = manager.getSnapshot()
  set(() => ({
    grid: snap.grid,
    moveCount: snap.moveCount,
    moves: snap.moves,
    status: snap.status,
    elapsedTime: snap.elapsedTime,
  }))
}

function startTimer(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  stopTimer()
  timerInterval = setInterval(() => {
    const m = manager
    if (m?.isRunning) {
      set(() => ({ elapsedTime: m.elapsedTime }))
    }
  }, 250)
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  grid: [],
  size: 5,
  mode: 'classic',
  difficulty: 'medium',
  status: 'idle',
  moveCount: 0,
  moves: [],
  elapsedTime: 0,
  hintLevel: 0,
  hintData: null,
  hintsUsed: 0,

  initGame: (size, difficulty = 'medium', mode = 'classic') => {
    if (manager) {
      manager.destroy()
    }
    manager = new GameManager(size, mode, difficulty)
    manager!.init()
    set(() => ({ size, mode, difficulty, hintLevel: 0, hintData: null, hintsUsed: 0 }))
    syncFromManager(set)
    startTimer(set)
  },

  makeMove: (row, col) => {
    if (!manager || manager.status !== 'playing') return
    const won = manager.makeMove(row, col)
    manager.resetHints()
    syncFromManager(set)
    set(() => ({ hintLevel: 0, hintData: null }))

    if (won) {
      const state = get()
      useStatisticsStore.getState().recordGame({
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        date: new Date().toISOString(),
        size: state.size,
        mode: state.mode,
        difficulty: state.difficulty,
        moves: state.moveCount,
        time: state.elapsedTime,
        hintsUsed: state.hintsUsed,
        won: true,
      })
    }
  },

  reset: () => {
    if (!manager) return
    manager.reset()
    syncFromManager(set)
    startTimer(set)
    set(() => ({ hintLevel: 0, hintData: null, hintsUsed: 0 }))
  },

  undo: () => {
    if (!manager) return
    manager.undo()
    manager.resetHints()
    syncFromManager(set)
    set(() => ({ hintLevel: 0, hintData: null }))
  },

  useHint: () => {
    if (!manager || manager.status !== 'playing') return
    const hintData = manager.advanceHint()
    set((s) => ({ hintLevel: manager.hintLevel, hintData, hintsUsed: s.hintsUsed + 1 }))
  },

  destroy: () => {
    if (manager) {
      manager.destroy()
      manager = null
    }
    stopTimer()
    set({
      grid: [],
      size: 5,
      mode: 'classic',
      difficulty: 'medium',
      status: 'idle',
      moveCount: 0,
      moves: [],
      elapsedTime: 0,
      hintLevel: 0,
      hintData: null,
      hintsUsed: 0,
    })
  },
}))
