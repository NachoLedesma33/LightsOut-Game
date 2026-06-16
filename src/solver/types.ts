import type { Move } from '../core/types'

export interface SolverResult {
  solution: Move[]
  isOptimal: boolean
  nodesExplored?: number
  timeMs?: number
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
