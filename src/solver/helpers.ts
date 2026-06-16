import type { Move } from '../core/types'

export function cloneGrid(grid: boolean[][]): boolean[][] {
  return grid.map((row) => [...row])
}

export function stateKey(grid: boolean[][]): string {
  return grid.map((row) => row.map((c) => (c ? '1' : '0')).join('')).join('')
}

export function gridToMask(grid: boolean[][]): number {
  const size = grid.length
  let mask = 0
  for (let i = 0; i < size * size; i++) {
    const r = Math.floor(i / size)
    const c = i % size
    if (grid[r][c]) mask |= 1 << i
  }
  return mask
}

export function maskToGrid(mask: number, size: number): boolean[][] {
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))
  for (let i = 0; i < size * size; i++) {
    if (mask & (1 << i)) {
      const r = Math.floor(i / size)
      const c = i % size
      grid[r][c] = true
    }
  }
  return grid
}

export function toggleMask(mask: number, idx: number, size: number): number {
  const r = Math.floor(idx / size)
  const c = idx % size
  mask ^= 1 << idx
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  for (const [dr, dc] of dirs) {
    const nr = r + dr
    const nc = c + dc
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      mask ^= 1 << (nr * size + nc)
    }
  }
  return mask
}

export function applyMoves(board: boolean[][], moves: Move[]): boolean[][] {
  const grid = cloneGrid(board)
  for (const { row, col } of moves) {
    grid[row][col] = !grid[row][col]
    const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (const [dr, dc] of dirs) {
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid.length) {
        grid[nr][nc] = !grid[nr][nc]
      }
    }
  }
  return grid
}

export function isWin(grid: boolean[][]): boolean {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      if (grid[r][c]) return false
    }
  }
  return true
}

export function isWinMask(mask: number): boolean {
  return mask === 0
}

export function countOnes(mask: number): number {
  let count = 0
  while (mask) {
    count += mask & 1
    mask >>>= 1
  }
  return count
}

export function countLightsOn(grid: boolean[][]): number {
  let count = 0
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      if (grid[r][c]) count++
    }
  }
  return count
}

export function heuristic(g: boolean[][]): number {
  let lights = 0
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < g.length; c++) {
      if (g[r][c]) lights++
    }
  }
  return Math.ceil(lights / 5)
}

export function heuristicMask(mask: number): number {
  const lights = countOnes(mask)
  return Math.ceil(lights / 5)
}

export function precomputeToggleMasks(size: number): number[] {
  const N = size * size
  const masks: number[] = Array(N)
  for (let i = 0; i < N; i++) {
    masks[i] = toggleMask(0, i, size)
  }
  return masks
}
