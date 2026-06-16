import type { Solver, SolverResult, SolubilityResult } from './types'

function buildAdjacencyMatrix(size: number): number[][] {
  const N = size * size
  const A: number[][] = Array.from({ length: N }, () => Array(N).fill(0))

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const i = r * size + c
      A[i][i] = 1
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const [dr, dc] of dirs) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          const j = nr * size + nc
          A[i][j] = 1
        }
      }
    }
  }

  return A
}

function solveSystem(A: number[][], b: number[]): number[] | null {
  const n = A.length
  const m = A.map((row, i) => [...row, b[i]])

  const pivotRowForCol: number[] = []
  let row = 0

  for (let col = 0; col < n && row < n; col++) {
    let pivot = -1
    for (let r = row; r < n; r++) {
      if (m[r][col] === 1) {
        pivot = r
        break
      }
    }
    if (pivot === -1) continue

    ;[m[row], m[pivot]] = [m[pivot], m[row]]

    for (let r = row + 1; r < n; r++) {
      if (m[r][col] === 1) {
        for (let c = col; c <= n; c++) {
          m[r][c] ^= m[row][c]
        }
      }
    }

    pivotRowForCol.push(col)
    row++
  }

  for (let r = row; r < n; r++) {
    if (m[r][n] === 1) return null
  }

  const x = Array(n).fill(0)

  for (let i = pivotRowForCol.length - 1; i >= 0; i--) {
    const col = pivotRowForCol[i]
    let sum = m[i][n]
    for (let c = col + 1; c < n; c++) {
      if (m[i][c] === 1) sum ^= x[c]
    }
    x[col] = sum
  }

  return x
}

function countFreeVariables(A: number[][], b: number[]): number {
  const n = A.length
  const m = A.map((row, i) => [...row, b[i]])

  let row = 0
  const pivotCols: number[] = []

  for (let col = 0; col < n && row < n; col++) {
    let pivot = -1
    for (let r = row; r < n; r++) {
      if (m[r][col] === 1) {
        pivot = r
        break
      }
    }
    if (pivot === -1) continue

    ;[m[row], m[pivot]] = [m[pivot], m[row]]

    for (let r = row + 1; r < n; r++) {
      if (m[r][col] === 1) {
        for (let c = col; c <= n; c++) m[r][c] ^= m[row][c]
      }
    }

    pivotCols.push(col)
    row++
  }

  for (let r = row; r < n; r++) {
    if (m[r][n] === 1) return -1
  }

  return n - pivotCols.length
}

function generateAlternativeSolutions(
  A: number[][],
  b: number[],
  maxAlternatives: number,
): number[][] {
  const n = A.length
  const m = A.map((row, i) => [...row, b[i]])

  const pivotCols: number[] = []
  let row = 0

  for (let col = 0; col < n && row < n; col++) {
    let pivot = -1
    for (let r = row; r < n; r++) {
      if (m[r][col] === 1) {
        pivot = r
        break
      }
    }
    if (pivot === -1) continue

    ;[m[row], m[pivot]] = [m[pivot], m[row]]

    for (let r = row + 1; r < n; r++) {
      if (m[r][col] === 1) {
        for (let c = col; c <= n; c++) m[r][c] ^= m[row][c]
      }
    }

    pivotCols.push(col)
    row++
  }

  for (let r = row; r < n; r++) {
    if (m[r][n] === 1) return []
  }

  const pivotSet = new Set(pivotCols)
  const freeCols: number[] = []
  for (let c = 0; c < n; c++) {
    if (!pivotSet.has(c)) freeCols.push(c)
  }

  const solutions: number[][] = []
  const limit = Math.min(1 << freeCols.length, maxAlternatives)

  const x0 = Array(n).fill(0)
  for (let i = pivotCols.length - 1; i >= 0; i--) {
    const col = pivotCols[i]
    let sum = m[i][n]
    for (let c = col + 1; c < n; c++) {
      if (m[i][c] === 1) sum ^= x0[c]
    }
    x0[col] = sum
  }
  solutions.push([...x0])

  for (let mask = 1; mask < limit; mask++) {
    const x = Array(n).fill(0)
    for (let k = 0; k < freeCols.length; k++) {
      x[freeCols[k]] = (mask >> k) & 1
    }
    for (let i = pivotCols.length - 1; i >= 0; i--) {
      const col = pivotCols[i]
      let sum = m[i][n]
      for (let c = col + 1; c < n; c++) {
        if (m[i][c] === 1) sum ^= x[c]
      }
      x[col] = sum
    }
    solutions.push(x)
  }

  return solutions
}

function idxToMove(idx: number, size: number): { row: number; col: number } {
  return { row: Math.floor(idx / size), col: idx % size }
}

export function solveLightsOut(board: boolean[][]): SolverResult {
  const size = board.length
  const N = size * size
  const A = buildAdjacencyMatrix(size)
  const b = board.flat().map((v) => (v ? 1 : 0))

  const baseSolution = solveSystem(A, b)

  if (!baseSolution) {
    return { solution: [], isOptimal: false }
  }

  const alternatives = generateAlternativeSolutions(A, b, 256)

  let bestSolution = baseSolution
  let minOnes = baseSolution.reduce((a, b) => a + b, 0)

  for (const alt of alternatives) {
    const ones = alt.reduce((a, b) => a + b, 0)
    if (ones < minOnes) {
      minOnes = ones
      bestSolution = alt
    }
  }

  const moves: SolverResult['solution'] = []
  for (let i = 0; i < N; i++) {
    if (bestSolution[i] === 1) {
      moves.push(idxToMove(i, size))
    }
  }

  return {
    solution: moves,
    isOptimal: true,
  }
}

export function checkSolubility(board: boolean[][]): SolubilityResult {
  const size = board.length
  const A = buildAdjacencyMatrix(size)
  const b = board.flat().map((v) => (v ? 1 : 0))

  const solution = solveSystem(A, b)

  if (!solution) {
    return { isSolvable: false, solutionCount: 0, hasUniqueSolution: false, minSolutionMoves: null }
  }

  const freeCount = countFreeVariables(A, b)
  const solutionCount = 1 << freeCount
  const minSolutionMoves = solution.reduce((a, b) => a + b, 0)

  return {
    isSolvable: true,
    solutionCount,
    hasUniqueSolution: freeCount === 0,
    minSolutionMoves,
  }
}

export const linearSolver: Solver = {
  name: 'Linear Algebra (GF(2))',
  solve: solveLightsOut,
}
