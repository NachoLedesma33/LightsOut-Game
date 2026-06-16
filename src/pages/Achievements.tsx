import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Check, Lock } from 'lucide-react'
import { PageTransition } from '../components/layout'
import { ACHIEVEMENTS } from '../core/achievements'
import type { AchievementDef } from '../core/achievements'
import { useAchievementStore } from '../stores/achievementStore'
import { useStatisticsStore } from '../stores/statisticsStore'
import type { StatisticsState } from '../stores/statisticsStore'
import { useReducedMotion } from '../hooks/useReducedMotion'

const CATEGORIES: { name: string; ids: string[] }[] = [
  { name: 'Progresión', ids: ['primera_victoria', 'diez_victorias', 'veinticinco_victorias', 'cincuenta_victorias', 'cien_victorias'] },
  { name: 'Racha', ids: ['racha_3', 'racha_5', 'racha_10'] },
  { name: 'Habilidad', ids: ['sin_pistas', 'eficiente', 'rapido_30', 'rapido_15'] },
  { name: 'Tamaños', ids: ['mini_3', 'estandar_5', 'grande_7', 'experto_10', 'todos_tamanos'] },
  { name: 'Dificultades', ids: ['facil', 'normal', 'dificil', 'experto_dif', 'todas_dificultades'] },
  { name: 'Pistas', ids: ['primera_pista', 'coleccionista'] },
  { name: 'Diario', ids: ['primer_diario', 'racha_diaria_7'] },
]

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

function getProgress(a: AchievementDef, stats: StatisticsState): string | null {
  switch (a.id) {
    case 'diez_victorias':
    case 'veinticinco_victorias':
    case 'cincuenta_victorias':
    case 'cien_victorias': {
      const target = parseInt(a.id === 'cien_victorias' ? '100' : a.id === 'cincuenta_victorias' ? '50' : a.id === 'veinticinco_victorias' ? '25' : '10')
      return `${Math.min(stats.wonGames, target)}/${target}`
    }
    case 'racha_3':
    case 'racha_5':
    case 'racha_10': {
      const target = parseInt(a.id === 'racha_3' ? '3' : a.id === 'racha_5' ? '5' : '10')
      return `Mejor: ${Math.min(stats.bestStreak, target)}/${target}`
    }
    case 'sin_pistas':
      return null
    case 'eficiente':
    case 'rapido_30':
    case 'rapido_15':
      return null
    case 'todos_tamanos': {
      let done = 0
      for (let i = 3; i <= 10; i++) {
        if ((stats.gamesBySize[`${i}x${i}`] ?? 0) > 0) done++
      }
      return `${done}/8`
    }
    case 'todas_dificultades': {
      let done = 0
      for (const d of ['easy', 'medium', 'hard', 'expert'] as const) {
        if (stats.gamesByDifficulty[d] > 0) done++
      }
      return `${done}/4`
    }
    default:
      return null
  }
}

function AchievementCard({ def, unlocked, date, stats }: { def: AchievementDef; unlocked: boolean; date: string | null; stats: StatisticsState }) {
  const progress = !unlocked ? getProgress(def, stats) : null

  return (
    <motion.div
      variants={cardVariants}
      className={`flex items-center gap-3 p-3 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] ${!unlocked ? 'opacity-50' : ''}`}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 shrink-0 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)] text-lg ${unlocked ? '' : ''}`}
      >
        {unlocked ? def.icon : <Lock size={16} className="text-[var(--color-text-muted)]" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-[var(--color-text)]">{def.title}</div>
        <div className="text-xs text-[var(--color-text-muted)]">{def.description}</div>
        {unlocked && date && (
          <div className="text-[10px] text-[var(--color-primary)] font-bold mt-0.5">
            {new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
        {progress && (
          <div className="text-[10px] text-[var(--color-text-muted)] font-bold mt-0.5">{progress}</div>
        )}
      </div>
      {unlocked && <Check size={16} className="shrink-0 text-[var(--color-success)]" />}
    </motion.div>
  )
}

export function Achievements() {
  const unlocked = useAchievementStore((s) => s.unlocked)
  const stats = useStatisticsStore()
  const unlockedCount = Object.keys(unlocked).length
  const total = ACHIEVEMENTS.length
  const pct = Math.round((unlockedCount / total) * 100)
  const reduced = useReducedMotion()

  const defMap = useMemo(() => {
    const m: Record<string, AchievementDef> = {}
    for (const a of ACHIEVEMENTS) m[a.id] = a
    return m
  }, [])

  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-6 sm:gap-8 pt-4 sm:pt-8 pb-8">
        <div className="flex flex-col items-center gap-2">
          <Trophy size={48} className="text-[var(--color-primary)]" />
          <h1 className="text-3xl font-black text-[var(--color-text)] m-0">
            Logros
          </h1>
          <div className="text-sm font-bold text-[var(--color-text-muted)]">
            {unlockedCount}/{total} desbloqueados
          </div>
        </div>

        {unlockedCount > 0 && (
          <div className="w-full max-w-sm h-2 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
            <div
              className="h-full bg-[var(--color-primary)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <div className="w-full max-w-sm flex flex-col gap-5">
          {CATEGORIES.map((cat) => {
            const catDefs = cat.ids.map((id) => defMap[id]).filter(Boolean)
            if (catDefs.length === 0) return null
            const catUnlocked = catDefs.filter((d) => unlocked[d.id]).length
            return (
              <motion.section
                key={cat.name}
                variants={!reduced ? sectionVariants : undefined}
                initial={!reduced ? 'hidden' : undefined}
                animate={!reduced ? 'visible' : undefined}
              >
                <h2 className="text-xs font-black mb-2 text-[var(--color-text)] uppercase tracking-wider flex items-center gap-2">
                  <span>{cat.name}</span>
                  <span className="text-[var(--color-text-muted)]">({catUnlocked}/{catDefs.length})</span>
                </h2>
                <div className="flex flex-col gap-1.5">
                  {catDefs.map((def) => (
                    <AchievementCard
                      key={def.id}
                      def={def}
                      unlocked={!!unlocked[def.id]}
                      date={unlocked[def.id] ?? null}
                      stats={stats}
                    />
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
