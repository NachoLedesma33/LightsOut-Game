import type { DifficultyTier } from './types'

export interface BoardConfig {
  size: number
  difficulty: DifficultyTier
  seed: number
}

export function getBoardConfig(boardNumber: number): BoardConfig {
  let size: number
  if (boardNumber <= 3) size = 3
  else if (boardNumber <= 8) size = 4
  else if (boardNumber <= 15) size = 5
  else if (boardNumber <= 25) size = 6
  else size = 7

  let difficulty: DifficultyTier
  if (boardNumber <= 3) difficulty = 'easy'
  else if (boardNumber <= 8) difficulty = 'medium'
  else if (boardNumber <= 15) difficulty = 'hard'
  else difficulty = 'expert'

  const seed = Date.now() + boardNumber
  return { size, difficulty, seed }
}

export function calculateScore(params: {
  size: number
  moves: number
  hintsUsed: number
  timeSeconds: number
}): number {
  const { size, moves, hintsUsed, timeSeconds } = params
  const base = size * 20
  const efficiency = Math.max(0, (size * 2 - moves)) * 5
  const timeBonus = Math.max(0, Math.floor((60 - timeSeconds) / 10)) * 2
  const hintPenalty = hintsUsed * 15
  return Math.max(1, base + efficiency + timeBonus - hintPenalty)
}
