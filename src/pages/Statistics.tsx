import { useMemo, useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { BarChart3, Clock, Target, Zap, Trophy, Flame, Gamepad2, Trash2 } from 'lucide-react'
import { PageTransition } from '../components/layout'
import { Button } from '../components/ui'
import { useStatisticsStore } from '../stores/statisticsStore'
import { formatTime } from '../lib/utils'
import { getDifficultyLabel } from '../core/difficulty'
import { useReducedMotion } from '../hooks/useReducedMotion'

const difficultyColors: Record<string, string> = {
  easy: 'text-[var(--color-success)]',
  medium: 'text-[var(--color-primary)]',
  hard: 'text-[var(--color-accent)]',
  expert: 'text-[var(--color-error)]',
}

function AnimatedValue({ value, suffix = '' }: { value: number; suffix?: string }) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (reduced) return
    const controls = animate(display, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced])

  if (reduced) {
    return <>{value}{suffix}</>
  }

  return <>{display}{suffix}</>
}

export function Statistics() {
  const stats = useStatisticsStore()
  const winRate = stats.totalGames > 0 ? Math.round((stats.wonGames / stats.totalGames) * 100) : 0

  const bestRecords = useMemo(() => {
    const entries: { key: string; time: number | null; moves: number | null }[] = []
    for (const [key, time] of Object.entries(stats.bestTime)) {
      const moves = stats.leastMoves[key] ?? null
      entries.push({ key, time, moves })
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key))
  }, [stats.bestTime, stats.leastMoves])

  const recentGames = stats.recentGames.slice(0, 10)

  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-6 sm:gap-8 pt-4 sm:pt-8 pb-8">
        <div className="flex flex-col items-center gap-2">
          <BarChart3 size={48} className="text-[var(--color-primary)]" />
          <h1 className="text-3xl font-black text-[var(--color-text)] m-0">
            Estadísticas
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm">
          <StatCard icon={Gamepad2} value={<AnimatedValue value={stats.totalGames} />} label="Partidas" color="var(--color-primary)" />
          <StatCard icon={Trophy} value={<AnimatedValue value={stats.wonGames} />} label="Ganadas" color="var(--color-success)" />
          <StatCard icon={Target} value={<AnimatedValue value={winRate} suffix="%" />} label="Victorias" color="var(--color-accent)" />
          <StatCard icon={Flame} value={<AnimatedValue value={stats.currentStreak} />} label="Racha actual" color="var(--color-error)" />
          <StatCard icon={Zap} value={<AnimatedValue value={stats.totalMoves} />} label="Movimientos" color="var(--color-primary)" />
          <StatCard icon={Clock} value={formatTime(stats.totalTime)} label="Tiempo total" color="var(--color-accent)" />
        </div>

        {bestRecords.length > 0 && (
          <section className="w-full max-w-sm">
            <h2 className="text-lg font-black mb-3 text-[var(--color-text)] uppercase tracking-wider">
              Mejores registros
            </h2>
            <div className="flex flex-col gap-2">
              {bestRecords.map(({ key, time, moves }) => {
                const [size, difficulty] = key.split('_')
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3 py-2 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] text-xs font-bold"
                  >
                    <span className="font-mono">{size}</span>
                    <span className={difficultyColors[difficulty] ?? ''}>
                      {getDifficultyLabel(difficulty as 'easy' | 'medium' | 'hard' | 'expert')}
                    </span>
                    <span className="font-mono tabular-nums">
                      {moves !== null ? `${moves} mov` : '--'}
                    </span>
                    <span className="font-mono tabular-nums">
                      {time !== null ? formatTime(time) : '--:--'}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {recentGames.length > 0 && (
          <section className="w-full max-w-sm">
            <h2 className="text-lg font-black mb-3 text-[var(--color-text)] uppercase tracking-wider">
              Partidas recientes
            </h2>
            <div className="flex flex-col gap-1.5">
              {recentGames.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between px-3 py-2 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] text-xs font-bold"
                >
                  <span className="font-mono">{g.size}x{g.size}</span>
                  <span className={difficultyColors[g.difficulty]}>
                    {getDifficultyLabel(g.difficulty)}
                  </span>
                  <span className="font-mono tabular-nums">{g.moves} mov</span>
                  <span className="font-mono tabular-nums">{formatTime(g.time)}</span>
                  <span className="text-[var(--color-success)]">
                    {g.hintsUsed > 0 ? `${g.hintsUsed} p` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {stats.totalGames > 0 && (
          <Button variant="ghost" size="sm" onClick={() => stats.clearStats()}>
            <Trash2 size={14} />
            <span>Limpiar estadísticas</span>
          </Button>
        )}

        <div className="text-[10px] font-bold text-[var(--color-text-muted)] text-center">
          Mejor racha: {stats.bestStreak}
        </div>
      </div>
    </PageTransition>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType
  value: string | React.ReactNode
  label: string
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]">
      <Icon size={20} style={{ color }} />
      <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums">{value}</span>
      <span className="text-[10px] sm:text-xs font-bold text-[var(--color-text-muted)] text-center uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
