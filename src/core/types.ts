export type GameMode = 'classic' | 'expert' | 'infinite' | 'timed' | 'daily' | 'challenge' | 'chaos'

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export type DifficultyTier = 'easy' | 'medium' | 'hard' | 'expert'

export interface Move {
  row: number
  col: number
}

export interface GridSize {
  rows: number
  cols: number
  label: string
}

export type HintLevel = 0 | 1 | 2 | 3 | 4

export interface HintData {
  level: HintLevel
  moves: Move[]
  heatMap: number[][] | null
  description: string
  penaltyScore: number
  penaltyExp: number
}

export interface GameConfig {
  mode: GameMode
  size: number
  seed?: number
  difficulty?: DifficultyTier
}

export interface GameSnapshot {
  grid: boolean[][]
  moveCount: number
  moves: Move[]
  status: GameStatus
  elapsedTime: number
}
