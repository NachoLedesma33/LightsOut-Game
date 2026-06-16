import type { DifficultyTier } from './types'

export const DAILY_SIZE = 5
export const DAILY_DIFFICULTY: DifficultyTier = 'medium'

export function getDailyDateKey(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

export function getDailySeed(): number {
  const d = new Date()
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()
}

export function formatDailyDate(): string {
  const d = new Date()
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function isSameDay(dateA: string, dateB: string): boolean {
  return dateA === dateB
}
