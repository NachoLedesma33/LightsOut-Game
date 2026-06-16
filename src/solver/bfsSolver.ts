import type { Move } from '../core/types'
import type { Solver, SolverResult } from './types'
import { gridToMask, precomputeToggleMasks, isWinMask } from './helpers'

export function solveWithBfs(board: boolean[][]): SolverResult {
  const size = board.length
  const N = size * size
  const toggleMasks = precomputeToggleMasks(size)
  const start = performance.now()

  const startMask = gridToMask(board)

  if (isWinMask(startMask)) {
    return { solution: [], isOptimal: true, nodesExplored: 1, timeMs: 0, solverName: 'BFS' }
  }

  const parent = new Map<number, { parent: number; moveIdx: number }>()
  const queue: number[] = [startMask]
  parent.set(startMask, { parent: -1, moveIdx: -1 })
  let head = 0
  let nodesExplored = 0

  while (head < queue.length) {
    const currentMask = queue[head++]
    nodesExplored++

    for (let i = 0; i < N; i++) {
      const nextMask = currentMask ^ toggleMasks[i]

      if (parent.has(nextMask)) continue

      parent.set(nextMask, { parent: currentMask, moveIdx: i })

      if (isWinMask(nextMask)) {
        const moves: Move[] = []
        let m = nextMask
        while (parent.get(m)!.parent !== -1) {
          const idx = parent.get(m)!.moveIdx
          moves.unshift({ row: Math.floor(idx / size), col: idx % size })
          m = parent.get(m)!.parent
        }
        return {
          solution: moves,
          isOptimal: true,
          nodesExplored,
          timeMs: performance.now() - start,
          solverName: 'BFS',
        }
      }

      queue.push(nextMask)
    }
  }

  return {
    solution: [],
    isOptimal: false,
    nodesExplored,
    timeMs: performance.now() - start,
    solverName: 'BFS',
  }
}

export const bfsSolver: Solver = {
  name: 'BFS',
  solve: solveWithBfs,
}
