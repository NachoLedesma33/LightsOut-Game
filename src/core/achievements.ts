import type { StatisticsState, GameRecord } from '../stores/statisticsStore'
import { useDailyStore } from '../stores/dailyStore'
import { useInfiniteStore } from '../stores/infiniteStore'

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  condition: (stats: StatisticsState, game?: GameRecord) => boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'primera_victoria',
    title: 'Primera victoria',
    description: 'Resuelve tu primer tablero',
    icon: '🎯',
    condition: (stats) => stats.wonGames >= 1,
  },
  {
    id: 'diez_victorias',
    title: '10 Victorias',
    description: 'Acumula 10 partidas ganadas',
    icon: '🏅',
    condition: (stats) => stats.wonGames >= 10,
  },
  {
    id: 'veinticinco_victorias',
    title: '25 Victorias',
    description: 'Acumula 25 partidas ganadas',
    icon: '🥈',
    condition: (stats) => stats.wonGames >= 25,
  },
  {
    id: 'cincuenta_victorias',
    title: '50 Victorias',
    description: 'Acumula 50 partidas ganadas',
    icon: '🥇',
    condition: (stats) => stats.wonGames >= 50,
  },
  {
    id: 'cien_victorias',
    title: '100 Victorias',
    description: 'Acumula 100 partidas ganadas',
    icon: '👑',
    condition: (stats) => stats.wonGames >= 100,
  },
  {
    id: 'racha_3',
    title: 'Racha de 3',
    description: 'Gana 3 partidas consecutivas',
    icon: '🔥',
    condition: (stats) => stats.currentStreak >= 3 || stats.bestStreak >= 3,
  },
  {
    id: 'racha_5',
    title: 'Racha de 5',
    description: 'Gana 5 partidas consecutivas',
    icon: '🔥',
    condition: (stats) => stats.currentStreak >= 5 || stats.bestStreak >= 5,
  },
  {
    id: 'racha_10',
    title: 'Racha de 10',
    description: 'Gana 10 partidas consecutivas',
    icon: '💥',
    condition: (stats) => stats.currentStreak >= 10 || stats.bestStreak >= 10,
  },
  {
    id: 'sin_pistas',
    title: 'Sin ayudas',
    description: 'Gana una partida sin usar ningún hint',
    icon: '🧠',
    condition: (_stats, game) => game !== undefined && game.hintsUsed === 0,
  },
  {
    id: 'eficiente',
    title: 'Jugada eficiente',
    description: 'Gana usando la mitad de los movimientos del tablero o menos',
    icon: '⚡',
    condition: (_stats, game) => game !== undefined && game.moves <= Math.ceil(game.size / 2),
  },
  {
    id: 'rapido_30',
    title: 'Rápido (30s)',
    description: 'Gana en menos de 30 segundos',
    icon: '⏱️',
    condition: (_stats, game) => game !== undefined && game.time < 30,
  },
  {
    id: 'rapido_15',
    title: 'Muy rápido (15s)',
    description: 'Gana en menos de 15 segundos',
    icon: '⏱️',
    condition: (_stats, game) => game !== undefined && game.time < 15,
  },
  {
    id: 'mini_3',
    title: 'Mini 3×3',
    description: 'Completa un tablero de 3×3',
    icon: '📦',
    condition: (stats) => (stats.gamesBySize['3x3'] ?? 0) > 0,
  },
  {
    id: 'estandar_5',
    title: 'Estándar 5×5',
    description: 'Completa un tablero de 5×5',
    icon: '📦',
    condition: (stats) => (stats.gamesBySize['5x5'] ?? 0) > 0,
  },
  {
    id: 'grande_7',
    title: 'Grande 7×7',
    description: 'Completa un tablero de 7×7',
    icon: '📦',
    condition: (stats) => (stats.gamesBySize['7x7'] ?? 0) > 0,
  },
  {
    id: 'experto_10',
    title: 'Experto 10×10',
    description: 'Completa un tablero de 10×10',
    icon: '📦',
    condition: (stats) => (stats.gamesBySize['10x10'] ?? 0) > 0,
  },
  {
    id: 'todos_tamanos',
    title: 'Coleccionista de tamaños',
    description: 'Completa tableros de todos los tamaños (3×3 a 10×10)',
    icon: '🏆',
    condition: (stats) => {
      for (let i = 3; i <= 10; i++) {
        if ((stats.gamesBySize[`${i}x${i}`] ?? 0) === 0) return false
      }
      return true
    },
  },
  {
    id: 'facil',
    title: 'Fácil',
    description: 'Gana en dificultad Fácil',
    icon: '🌱',
    condition: (stats) => stats.gamesByDifficulty.easy > 0,
  },
  {
    id: 'normal',
    title: 'Normal',
    description: 'Gana en dificultad Normal',
    icon: '🌿',
    condition: (stats) => stats.gamesByDifficulty.medium > 0,
  },
  {
    id: 'dificil',
    title: 'Difícil',
    description: 'Gana en dificultad Difícil',
    icon: '🌳',
    condition: (stats) => stats.gamesByDifficulty.hard > 0,
  },
  {
    id: 'experto_dif',
    title: 'Experto',
    description: 'Gana en dificultad Experto',
    icon: '🗿',
    condition: (stats) => stats.gamesByDifficulty.expert > 0,
  },
  {
    id: 'todas_dificultades',
    title: 'Versátil',
    description: 'Gana en todas las dificultades',
    icon: '💎',
    condition: (stats) =>
      stats.gamesByDifficulty.easy > 0 &&
      stats.gamesByDifficulty.medium > 0 &&
      stats.gamesByDifficulty.hard > 0 &&
      stats.gamesByDifficulty.expert > 0,
  },
  {
    id: 'primera_pista',
    title: 'Primera pista',
    description: 'Usa un hint por primera vez',
    icon: '💡',
    condition: (stats) => stats.totalHints > 0,
  },
  {
    id: 'coleccionista',
    title: 'Coleccionista de pistas',
    description: 'Usa los 4 niveles de pista en una misma partida',
    icon: '🔦',
    condition: (_stats, game) => game !== undefined && game.hintsUsed >= 4,
  },
  {
    id: 'primer_diario',
    title: 'Ritual diario',
    description: 'Completa tu primer Puzzle Diario',
    icon: '📅',
    condition: (stats) => (stats.gamesByMode['daily'] ?? 0) > 0,
  },
  {
    id: 'racha_diaria_7',
    title: 'Racha semanal',
    description: 'Completa 7 Puzzles Diarios consecutivos',
    icon: '📆',
    condition: () => useDailyStore.getState().currentStreak >= 7 || useDailyStore.getState().bestStreak >= 7,
  },
  {
    id: 'primer_infinito',
    title: 'Primer infinito',
    description: 'Completa tu primer tablero en modo Infinito',
    icon: '♾️',
    condition: (stats) => (stats.gamesByMode['infinite'] ?? 0) >= 1,
  },
  {
    id: 'infinito_25',
    title: 'Infinito 25',
    description: 'Completa 25 tableros en modo Infinito',
    icon: '♾️',
    condition: (stats) => (stats.gamesByMode['infinite'] ?? 0) >= 25,
  },
  {
    id: 'infinito_100',
    title: 'Infinito 100',
    description: 'Completa 100 tableros en modo Infinito',
    icon: '♾️',
    condition: (stats) => (stats.gamesByMode['infinite'] ?? 0) >= 100,
  },
  {
    id: 'racha_infinita_10',
    title: 'Racha infinita',
    description: 'Alcanza una racha de 10 en modo Infinito',
    icon: '🔥',
    condition: () => useInfiniteStore.getState().bestStreak >= 10,
  },
]
