import { cloneGrid, countLightsOn } from './helpers'
import { solveWithMetrics } from './solverFactory'
import { HINT_PENALTIES } from '../core/constants'
import type { Move } from '../core/types'
import type { HintLevel, HintData } from '../core/types'

export function computeHeatMap(grid: boolean[][]): number[][] {
  const size = grid.length
  const currentLights = countLightsOn(grid)
  const result: number[][] = Array.from({ length: size }, () => Array(size).fill(0))

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const sim = cloneGrid(grid)
      sim[r][c] = !sim[r][c]
      const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const [dr, dc] of dirs) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          sim[nr][nc] = !sim[nr][nc]
        }
      }
      result[r][c] = currentLights - countLightsOn(sim)
    }
  }

  return result
}

export function generateHint(
  grid: boolean[][],
  level: HintLevel,
  solution: Move[] | null,
): HintData {
  const penalty = HINT_PENALTIES[level as keyof typeof HINT_PENALTIES] ?? HINT_PENALTIES[1]

  switch (level) {
    case 1: {
      const heatMap = computeHeatMap(grid)
      return {
        level: 1,
        moves: [],
        heatMap,
        description: 'Las celdas más brillantes reducen más luces',
        penaltyScore: penalty.score,
        penaltyExp: penalty.exp,
      }
    }

    case 2: {
      const moves = solution && solution.length > 0 ? [solution[0]] : []
      return {
        level: 2,
        moves,
        heatMap: null,
        description: moves.length > 0
          ? 'Presiona esta celda para avanzar'
          : 'No se encontró solución',
        penaltyScore: penalty.score,
        penaltyExp: penalty.exp,
      }
    }

    case 3: {
      if (!solution || solution.length === 0) {
        return {
          level: 3,
          moves: [],
          heatMap: null,
          description: 'No se encontró solución',
          penaltyScore: penalty.score,
          penaltyExp: penalty.exp,
        }
      }
      const trailCount = Math.max(1, Math.ceil(solution.length / 2))
      const moves = solution.slice(0, trailCount)
      return {
        level: 3,
        moves,
        heatMap: null,
        description: `Sigue estos ${moves.length} movimientos en orden`,
        penaltyScore: penalty.score,
        penaltyExp: penalty.exp,
      }
    }

    case 4: {
      if (!solution || solution.length === 0) {
        return {
          level: 4,
          moves: [],
          heatMap: null,
          description: 'No se encontró solución',
          penaltyScore: penalty.score,
          penaltyExp: penalty.exp,
        }
      }
      return {
        level: 4,
        moves: solution,
        heatMap: null,
        description: `Solución completa · ${solution.length} movimientos`,
        penaltyScore: penalty.score,
        penaltyExp: penalty.exp,
      }
    }

    default:
      return {
        level: 0,
        moves: [],
        heatMap: null,
        description: '',
        penaltyScore: 0,
        penaltyExp: 0,
      }
  }
}

export function solveGrid(grid: boolean[][]): Move[] {
  const size = grid.length
  const result = solveWithMetrics(size, grid)
  return result.solution
}
