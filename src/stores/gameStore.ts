import { create } from 'zustand'
import { GameManager } from '../core/gameManager'
import type { Move, GameStatus, GameMode, DifficultyTier } from '../core/types'

interface GameState {
  grid: boolean[][]
  size: number
  mode: GameMode
  difficulty: DifficultyTier
  status: GameStatus
  moveCount: number
  moves: Move[]
  elapsedTime: number
}

interface GameActions {
  initGame: (size: number, difficulty?: DifficultyTier, mode?: GameMode) => void
  makeMove: (row: number, col: number) => void
  reset: () => void
  undo: () => void
  destroy: () => void
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

export const useGameStore = create<GameState & GameActions>((set) => ({
  grid: [],
  size: 5,
  mode: 'classic',
  difficulty: 'medium',
  status: 'idle',
  moveCount: 0,
  moves: [],
  elapsedTime: 0,

  initGame: (size, difficulty = 'medium', mode = 'classic') => {
    if (manager) {
      manager.destroy()
    }
    manager = new GameManager(size, mode, difficulty)
    manager!.init()
    set(() => ({ size, mode, difficulty }))
    syncFromManager(set)
    startTimer(set)
  },

  makeMove: (row, col) => {
    if (!manager || manager.status !== 'playing') return
    manager.makeMove(row, col)
    syncFromManager(set)
  },

  reset: () => {
    if (!manager) return
    manager.reset()
    syncFromManager(set)
    startTimer(set)
  },

  undo: () => {
    if (!manager) return
    manager.undo()
    syncFromManager(set)
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
    })
  },
}))
