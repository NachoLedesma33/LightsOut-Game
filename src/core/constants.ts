import type { GridSize, GameMode } from './types'

export const CLASSIC_SIZES: GridSize[] = [
  { rows: 3, cols: 3, label: '3×3' },
  { rows: 4, cols: 4, label: '4×4' },
  { rows: 5, cols: 5, label: '5×5' },
  { rows: 6, cols: 6, label: '6×6' },
  { rows: 7, cols: 7, label: '7×7' },
]

export const EXPERT_SIZES: GridSize[] = [
  { rows: 8, cols: 8, label: '8×8' },
  { rows: 9, cols: 9, label: '9×9' },
  { rows: 10, cols: 10, label: '10×10' },
]

export interface ModeInfo {
  id: GameMode
  title: string
  description: string
  icon: string
  comingSoon?: boolean
}

export const GAME_MODES: ModeInfo[] = [
  {
    id: 'classic',
    title: 'Clásico',
    description: 'Apaga todas las luces. Elige entre 3×3 y 7×7.',
    icon: 'Lightbulb',
  },
  {
    id: 'expert',
    title: 'Experto',
    description: 'Grillas de 8×8 a 10×10 para jugadores avanzados.',
    icon: 'Brain',
  },
  {
    id: 'infinite',
    title: 'Infinito',
    description: 'Generación procedural sin fin.',
    icon: 'Infinity',
    comingSoon: true,
  },
  {
    id: 'timed',
    title: 'Contrarreloj',
    description: 'Resuelve antes de que el tiempo se acabe.',
    icon: 'Timer',
    comingSoon: true,
  },
  {
    id: 'daily',
    title: 'Puzzle Diario',
    description: 'Un nuevo desafío cada día.',
    icon: 'Calendar',
    comingSoon: true,
  },
  {
    id: 'challenge',
    title: 'Desafío',
    description: 'Supera el tablero con movimientos limitados.',
    icon: 'Swords',
    comingSoon: true,
  },
  {
    id: 'chaos',
    title: 'Caos',
    description: 'Patrones especiales y reglas alteradas.',
    icon: 'Zap',
    comingSoon: true,
  },
]

export const HINT_PENALTIES = {
  1: { score: 5, exp: 2 },
  2: { score: 10, exp: 5 },
  3: { score: 20, exp: 10 },
  4: { score: 40, exp: 20 },
  5: { score: 80, exp: 40 },
} as const


