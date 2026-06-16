import type { Solver, SolubilityResult, SolverResult } from './types'
import type { Move } from '../core/types'
import { linearSolver, checkSolubility as linearCheck } from './linearSolver'
import { bfsSolver } from './bfsSolver'
import { aStarSolver } from './aStarSolver'
import { idaStarSolver } from './idaStarSolver'

export interface SolverSelection {
  solver: Solver
  reason: string
}

export function getSolver(size: number): SolverSelection {
  if (size <= 3) {
    return { solver: bfsSolver, reason: `BFS: state space 2^${size*size} = ${1 << (size*size)}, optimal guarantee` }
  }
  if (size <= 4) {
    return { solver: aStarSolver, reason: `A*: heuristic-guided, optimal for ${size}x${size}` }
  }
  return { solver: linearSolver, reason: `Linear algebra GF(2): fast algebraic for ${size}x${size}` }
}

export function solve(size: number, grid: boolean[][]): Move[] {
  const { solver } = getSolver(size)
  const result = solver.solve(grid)
  return result.solution
}

export function solveWithMetrics(size: number, grid: boolean[][]): SolverResult {
  const { solver } = getSolver(size)
  const result = solver.solve(grid)
  return {
    ...result,
    solverName: result.solverName ?? solver.name,
  }
}

export function checkSolubility(grid: boolean[][]): SolubilityResult {
  return linearCheck(grid)
}

export { bfsSolver, aStarSolver, idaStarSolver, linearSolver }
