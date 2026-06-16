import type { DifficultyTier } from './types'

export interface DifficultyConfig {
  tier: DifficultyTier
  label: string
  description: string
  minMovesRatio: number
  maxMovesRatio: number
}

export const DIFFICULTY_TIERS: DifficultyConfig[] = [
  {
    tier: 'easy',
    label: 'Fácil',
    description: 'Pocos movimientos necesarios',
    minMovesRatio: 0.2,
    maxMovesRatio: 0.35,
  },
  {
    tier: 'medium',
    label: 'Normal',
    description: 'Complejidad equilibrada',
    minMovesRatio: 0.35,
    maxMovesRatio: 0.55,
  },
  {
    tier: 'hard',
    label: 'Difícil',
    description: 'Requiere planificación',
    minMovesRatio: 0.55,
    maxMovesRatio: 0.75,
  },
  {
    tier: 'expert',
    label: 'Experto',
    description: 'Máxima complejidad',
    minMovesRatio: 0.75,
    maxMovesRatio: 1.0,
  },
]

const DIFFICULTY_LABELS: Record<DifficultyTier, string> = {
  easy: 'Fácil',
  medium: 'Normal',
  hard: 'Difícil',
  expert: 'Experto',
}

export function getDifficultyLabel(tier: DifficultyTier): string {
  return DIFFICULTY_LABELS[tier]
}

export function getMovesRange(size: number, tier: DifficultyTier): { min: number; max: number } {
  const config = DIFFICULTY_TIERS.find((d) => d.tier === tier)!
  const total = size * size
  return {
    min: Math.max(3, Math.floor(total * config.minMovesRatio)),
    max: Math.min(total, Math.ceil(total * config.maxMovesRatio)),
  }
}

export function getMovesCount(size: number, tier: DifficultyTier, rng: () => number = Math.random): number {
  const { min, max } = getMovesRange(size, tier)
  return min + Math.floor(rng() * (max - min + 1))
}

export function isValidDifficultyForSize(size: number, tier: DifficultyTier): boolean {
  const { min } = getMovesRange(size, tier)
  return min >= 3
}

export function getDefaultDifficulty(size: number): DifficultyTier {
  if (size <= 4) return 'easy'
  if (size <= 6) return 'medium'
  if (size <= 8) return 'hard'
  return 'expert'
}

export function getAvailableDifficulties(size: number): DifficultyTier[] {
  return DIFFICULTY_TIERS
    .filter((d) => isValidDifficultyForSize(size, d.tier))
    .map((d) => d.tier)
}
