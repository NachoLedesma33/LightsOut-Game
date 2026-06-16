import type { Solver, SolubilityResult } from './types'
import { linearSolver, checkSolubility as linearCheck } from './linearSolver'
import type { Move } from '../core/types'

export function getSolver(_size: number): Solver {
  return linearSolver
}

export function solve(size: number, grid: boolean[][]): Move[] {
  const solver = getSolver(size)
  const result = solver.solve(grid)
  return result.solution
}

export function checkSolubility(grid: boolean[][]): SolubilityResult {
  return linearCheck(grid)
}
