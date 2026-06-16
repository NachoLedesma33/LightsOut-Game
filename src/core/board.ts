import type { DifficultyTier } from './types'
import { getMovesCount } from './difficulty'

export class Board {
  readonly size: number
  private grid: boolean[][]
  private lightsOn: number = 0

  constructor(size: number, initial?: boolean[][]) {
    this.size = size
    if (initial) {
      this.grid = initial.map((row) => [...row])
      this.lightsOn = initial.reduce((sum, row) => sum + row.filter(Boolean).length, 0)
    } else {
      this.grid = Array.from({ length: size }, () => Array(size).fill(false))
      this.lightsOn = 0
    }
  }

  get(row: number, col: number): boolean {
    return this.grid[row]?.[col] ?? false
  }

  set(row: number, col: number, value: boolean): void {
    if (this.isInBounds(row, col)) {
      const prev = this.grid[row][col]
      if (prev !== value) {
        this.grid[row][col] = value
        this.lightsOn += value ? 1 : -1
      }
    }
  }

  toggle(row: number, col: number): void {
    if (!this.isInBounds(row, col)) return

    const flip = (r: number, c: number) => {
      this.grid[r][c] = !this.grid[r][c]
      this.lightsOn += this.grid[r][c] ? 1 : -1
    }

    flip(row, col)
    const n = this.size
    if (row > 0) flip(row - 1, col)
    if (row < n - 1) flip(row + 1, col)
    if (col > 0) flip(row, col - 1)
    if (col < n - 1) flip(row, col + 1)
  }

  isWin(): boolean {
    return this.lightsOn === 0
  }

  clone(): Board {
    return new Board(this.size, this.grid)
  }

  reset(): void {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = false
      }
    }
    this.lightsOn = 0
  }

  forEach(fn: (row: number, col: number, value: boolean) => void): void {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        fn(r, c, this.grid[r][c])
      }
    }
  }

  toArray(): boolean[][] {
    return this.grid.map((row) => [...row])
  }

  equals(other: Board): boolean {
    if (this.size !== other.size) return false
    if (this.lightsOn !== other.lightsOn) return false
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] !== other.grid[r][c]) return false
      }
    }
    return true
  }

  private isInBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size
  }

  static generateSolvable(size: number, movesCount: number, seed?: number): Board {
    const rng = seed !== undefined ? createRng(seed) : Math.random
    const board = new Board(size)
    const total = size * size
    let remaining = movesCount

    while (remaining > 0) {
      const idx = Math.floor(rng() * total)
      const row = Math.floor(idx / size)
      const col = idx % size
      board.toggle(row, col)
      remaining--
    }

    return board
  }

  static generateSolvableWithDifficulty(
    size: number,
    tier: DifficultyTier,
    seed?: number,
  ): Board {
    const rng = seed !== undefined ? createRng(seed) : Math.random
    const movesCount = getMovesCount(size, tier, rng)

    let board: Board
    let attempts = 0
    const maxAttempts = 10

    do {
      board = Board.generateSolvable(size, movesCount, seed !== undefined ? seed + attempts : undefined)
      attempts++
    } while (board.isWin() && attempts < maxAttempts)

    return board
  }
}

function createRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}
