import type { DifficultyTier } from './types'
import { getMovesCount } from './difficulty'

export class Board {
  readonly size: number
  private grid: boolean[][]

  constructor(size: number, initial?: boolean[][]) {
    this.size = size
    this.grid = initial
      ? initial.map((row) => [...row])
      : Array.from({ length: size }, () => Array(size).fill(false))
  }

  get(row: number, col: number): boolean {
    return this.grid[row]?.[col] ?? false
  }

  set(row: number, col: number, value: boolean): void {
    if (this.isInBounds(row, col)) {
      this.grid[row][col] = value
    }
  }

  toggle(row: number, col: number): void {
    if (!this.isInBounds(row, col)) return
    this.grid[row][col] = !this.grid[row][col]
    for (const [nr, nc] of this.neighbors(row, col)) {
      this.grid[nr][nc] = !this.grid[nr][nc]
    }
  }

  isWin(): boolean {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c]) return false
      }
    }
    return true
  }

  clone(): Board {
    const cloned = new Board(this.size)
    cloned.grid = this.grid.map((row) => [...row])
    return cloned
  }

  reset(): void {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = false
      }
    }
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
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] !== other.grid[r][c]) return false
      }
    }
    return true
  }

  private neighbors(row: number, col: number): [number, number][] {
    const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    const result: [number, number][] = []
    for (const [dr, dc] of dirs) {
      const nr = row + dr
      const nc = col + dc
      if (this.isInBounds(nr, nc)) {
        result.push([nr, nc])
      }
    }
    return result
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
