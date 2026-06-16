import type { Move } from '../core/types'

export interface SolverMetrics {
  nodesExplored: number
  timeMs: number
}

export interface SolverResult {
  solution: Move[]
  isOptimal: boolean
  nodesExplored?: number
  timeMs?: number
  solverName?: string
}

export interface Solver {
  solve(board: boolean[][]): SolverResult
  name: string
}

export interface SolubilityResult {
  isSolvable: boolean
  solutionCount: number
  hasUniqueSolution: boolean
  minSolutionMoves: number | null
}

export interface HeuristicInfo {
  name: string
  value: number
}
