export type GameMode = 'classic' | 'expert' | 'infinite' | 'timed' | 'daily' | 'challenge' | 'chaos'

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export interface Move {
  row: number
  col: number
}

export interface GridSize {
  rows: number
  cols: number
  label: string
}

export interface GameConfig {
  mode: GameMode
  size: number
  seed?: number
}

export interface GameSnapshot {
  grid: boolean[][]
  moveCount: number
  moves: Move[]
  status: GameStatus
  elapsedTime: number
}
