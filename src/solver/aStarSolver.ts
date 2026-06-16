import type { Move } from '../core/types'
import type { Solver, SolverResult } from './types'
import { gridToMask, precomputeToggleMasks, isWinMask, heuristicMask } from './helpers'

class MinHeap<T> {
  private data: T[] = []
  private compare: (a: T, b: T) => number

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare
  }

  push(item: T): void {
    this.data.push(item)
    this.bubbleUp(this.data.length - 1)
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined
    const top = this.data[0]
    const bottom = this.data.pop()!
    if (this.data.length > 0) {
      this.data[0] = bottom
      this.sinkDown(0)
    }
    return top
  }

  get size(): number {
    return this.data.length
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parent = (idx - 1) >> 1
      if (this.compare(this.data[idx], this.data[parent]) >= 0) break
      ;[this.data[idx], this.data[parent]] = [this.data[parent], this.data[idx]]
      idx = parent
    }
  }

  private sinkDown(idx: number): void {
    const length = this.data.length
    while (true) {
      let smallest = idx
      const left = (idx << 1) + 1
      const right = left + 1
      if (left < length && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left
      if (right < length && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right
      if (smallest === idx) break
      ;[this.data[idx], this.data[smallest]] = [this.data[smallest], this.data[idx]]
      idx = smallest
    }
  }
}

interface AStarNode {
  mask: number
  g: number
  f: number
}

export function solveWithAStar(board: boolean[][]): SolverResult {
  const size = board.length
  const N = size * size
  const toggleMasks = precomputeToggleMasks(size)
  const start = performance.now()

  const startMask = gridToMask(board)

  if (isWinMask(startMask)) {
    return { solution: [], isOptimal: true, nodesExplored: 1, timeMs: 0, solverName: 'A*' }
  }

  const parent = new Map<number, { parent: number; moveIdx: number }>()
  const gScore = new Map<number, number>()

  const startH = heuristicMask(startMask)
  const open = new MinHeap<AStarNode>((a, b) => a.f - b.f)
  open.push({ mask: startMask, g: 0, f: startH })
  parent.set(startMask, { parent: -1, moveIdx: -1 })
  gScore.set(startMask, 0)

  let nodesExplored = 0

  while (open.size > 0) {
    const current = open.pop()!
    nodesExplored++

    if (isWinMask(current.mask)) {
      const moves: Move[] = []
      let m = current.mask
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
        solverName: 'A*',
      }
    }

    if (current.g > (gScore.get(current.mask) ?? Infinity)) continue

    for (let i = 0; i < N; i++) {
      const nextMask = current.mask ^ toggleMasks[i]
      const tentativeG = current.g + 1

      if (tentativeG < (gScore.get(nextMask) ?? Infinity)) {
        gScore.set(nextMask, tentativeG)
        parent.set(nextMask, { parent: current.mask, moveIdx: i })
        const h = heuristicMask(nextMask)
        open.push({ mask: nextMask, g: tentativeG, f: tentativeG + h })
      }
    }
  }

  return {
    solution: [],
    isOptimal: false,
    nodesExplored,
    timeMs: performance.now() - start,
    solverName: 'A*',
  }
}

export const aStarSolver: Solver = {
  name: 'A*',
  solve: solveWithAStar,
}
