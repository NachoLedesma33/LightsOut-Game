import { Board } from './board'
import type { Move, GameStatus, GameMode, GameSnapshot } from './types'
import { getRandomMovesCount } from './constants'

export class GameManager {
  private _board: Board
  private _initialBoard: Board
  private _moves: Move[] = []
  private _status: GameStatus = 'idle'
  private _startTime: number | null = null
  private _elapsedTime: number = 0
  private _timerInterval: ReturnType<typeof setInterval> | null = null
  readonly size: number
  readonly mode: GameMode

  constructor(size: number, mode: GameMode = 'classic') {
    this.size = size
    this.mode = mode
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

  init(movesCount?: number, seed?: number): void {
    this.stopTimer()
    const count = movesCount ?? getRandomMovesCount(this.size)
    this._board = Board.generateSolvable(this.size, count, seed)
    this._initialBoard = this._board.clone()
    this._moves = []
    this._status = 'playing'
    this._elapsedTime = 0
    this._startTime = Date.now()
    this.startTimer()
  }

  makeMove(row: number, col: number): boolean {
    if (this._status !== 'playing') return false
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return false

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
    this._status = 'playing'
    this._elapsedTime = 0
    this._startTime = Date.now()
    this.startTimer()
  }

  newGame(movesCount?: number, seed?: number): void {
    this.init(movesCount, seed)
  }

  undo(): boolean {
    if (this._status !== 'playing' || this._moves.length === 0) return false

    this._board = this._initialBoard.clone()
    const remaining = this._moves.slice(0, -1)

    for (const move of remaining) {
      this._board.toggle(move.row, move.col)
    }

    this._moves = remaining
    return true
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
