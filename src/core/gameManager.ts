import { Board } from './board'
import type { Move, GameStatus, GameMode, GameSnapshot, DifficultyTier, HintLevel, HintData } from './types'
import { generateHint, solveGrid, computeHeatMap } from '../solver/hintEngine'

export class GameManager {
  private _board: Board
  private _initialBoard: Board
  private _moves: Move[] = []
  private _boardHistory: Board[] = []
  private _status: GameStatus = 'idle'
  private _startTime: number | null = null
  private _elapsedTime: number = 0
  private _timerInterval: ReturnType<typeof setInterval> | null = null
  private _hintLevel: HintLevel = 0
  private _hintSolution: Move[] | null = null
  private _hintHeatMap: number[][] | null = null
  readonly size: number
  readonly mode: GameMode
  readonly difficulty: DifficultyTier

  constructor(size: number, mode: GameMode = 'classic', difficulty?: DifficultyTier) {
    this.size = size
    this.mode = mode
    this.difficulty = difficulty ?? 'medium'
    this._board = new Board(size)
    this._initialBoard = new Board(size)
  }

  get board(): Board {
    return this._board
  }

  get moves(): readonly Move[] {
    return this._moves
  }

  get moveCount(): number {
    return this._moves.length
  }

  get status(): GameStatus {
    return this._status
  }

  get elapsedTime(): number {
    return this._elapsedTime
  }

  get isRunning(): boolean {
    return this._status === 'playing'
  }

  init(seed?: number): void {
    this.stopTimer()
    this._board = Board.generateSolvableWithDifficulty(this.size, this.difficulty, seed)
    this._initialBoard = this._board.clone()
    this._moves = []
    this._boardHistory = []
    this._status = 'playing'
    this._elapsedTime = 0
    this._startTime = Date.now()
    this.startTimer()
  }

  makeMove(row: number, col: number): boolean {
    if (this._status !== 'playing') return false
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return false

    this._boardHistory.push(this._board.clone())
    this._board.toggle(row, col)
    this._moves.push({ row, col })

    if (this._board.isWin()) {
      this._status = 'won'
      this.stopTimer()
      return true
    }

    return false
  }

  reset(): void {
    this.stopTimer()
    this._board = this._initialBoard.clone()
    this._moves = []
    this._boardHistory = []
    this._status = 'playing'
    this._elapsedTime = 0
    this._startTime = Date.now()
    this.startTimer()
    this.resetHints()
  }

  undo(): boolean {
    if (this._status !== 'playing' || this._boardHistory.length === 0) return false

    this._board = this._boardHistory.pop()!
    this._moves.pop()
    return true
  }

  get hintLevel(): HintLevel {
    return this._hintLevel
  }

  advanceHint(): HintData {
    const grid = this._board.toArray()

    if (!this._hintSolution) {
      this._hintSolution = solveGrid(grid)
    }
    if (!this._hintHeatMap) {
      this._hintHeatMap = computeHeatMap(grid)
    }

    this._hintLevel = ((this._hintLevel + 1) % 5) as HintLevel
    if (this._hintLevel === 0) this._hintLevel = 1

    return generateHint(grid, this._hintLevel, this._hintSolution)
  }

  getHintData(): HintData | null {
    if (this._hintLevel === 0) return null
    const grid = this._board.toArray()
    return generateHint(grid, this._hintLevel, this._hintSolution)
  }

  resetHints(): void {
    this._hintLevel = 0
    this._hintSolution = null
    this._hintHeatMap = null
  }

  getSnapshot(): GameSnapshot {
    return {
      grid: this._board.toArray(),
      moveCount: this.moveCount,
      moves: [...this._moves],
      status: this._status,
      elapsedTime: this._elapsedTime,
    }
  }

  destroy(): void {
    this.stopTimer()
  }

  private startTimer(): void {
    this.stopTimer()
    this._timerInterval = setInterval(() => {
      if (this._startTime !== null) {
        this._elapsedTime = Math.floor((Date.now() - this._startTime) / 1000)
      }
    }, 250)
  }

  private stopTimer(): void {
    if (this._timerInterval !== null) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
  }
}
