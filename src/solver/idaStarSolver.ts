import type { Move } from '../core/types'
import type { Solver, SolverResult } from './types'
import { cloneGrid, heuristic } from './helpers'

export function solveWithIdaStar(board: boolean[][]): SolverResult {
  const size = board.length
  const N = size * size
  const start = performance.now()

  const startGrid = cloneGrid(board)

  function isWin(): boolean {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (startGrid[r][c]) return false
      }
    }
    return true
  }

  if (isWin()) {
    return { solution: [], isOptimal: true, nodesExplored: 1, timeMs: 0, solverName: 'IDA*' }
  }

  let bound = heuristic(startGrid)
  const path: number[] = []
  let foundPath: number[] | null = null
  let nodesExplored = 0
  const maxNodes = 1_000_000

  function toggleAt(idx: number): void {
    const r = Math.floor(idx / size)
    const c = idx % size
    startGrid[r][c] = !startGrid[r][c]
    const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        startGrid[nr][nc] = !startGrid[nr][nc]
      }
    }
  }

  function search(g: number): number {
    const hVal = heuristic(startGrid)
    const f = g + hVal
    if (f > bound) return f

    let win = true
    for (let r = 0; r < size && win; r++) {
      for (let c = 0; c < size && win; c++) {
        if (startGrid[r][c]) win = false
      }
    }
    if (win) {
      foundPath = [...path]
      return -1
    }

    let min = Infinity

    for (let i = 0; i < N; i++) {
      if (path.length > 0 && path[path.length - 1] === i) continue

      toggleAt(i)
      path.push(i)
      nodesExplored++

      if (nodesExplored > maxNodes) {
        toggleAt(i)
        path.pop()
        return Infinity
      }

      const result = search(g + 1)
      toggleAt(i)
      path.pop()

      if (result === -1) return -1
      if (result < min) min = result
    }

    return min
  }

  while (bound < 500) {
    const result = search(0)
    if (result === -1 && foundPath) {
      const pathArr = foundPath as number[]
      const moves: Move[] = pathArr.map((idx) => ({
        row: Math.floor(idx / size),
        col: idx % size,
      }))
      return {
        solution: moves,
        isOptimal: true,
        nodesExplored,
        timeMs: performance.now() - start,
        solverName: 'IDA*',
      }
    }
    if (result === Infinity) break
    bound = result
  }

  return {
    solution: [],
    isOptimal: false,
    nodesExplored,
    timeMs: performance.now() - start,
    solverName: 'IDA*',
  }
}

export const idaStarSolver: Solver = {
  name: 'IDA*',
  solve: solveWithIdaStar,
}
