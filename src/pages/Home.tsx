import { Lightbulb, Brain, Infinity, Timer, Calendar, Swords, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui'
import { GAME_MODES, CLASSIC_SIZES, EXPERT_SIZES } from '../core/constants'
import { PageTransition } from '../components/layout'
import { useState } from 'react'
import type { GameMode } from '../core/types'
import { cn } from '../lib/utils'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Lightbulb, Brain, Infinity, Timer, Calendar, Swords, Zap,
}

export function Home() {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)

  const handleModeSelect = (modeId: GameMode) => {
    if (modeId === 'classic') {
      setSelectedMode('classic')
    } else if (modeId === 'expert') {
      setSelectedMode('expert')
    }
  }

  const handleSizeSelect = (size: number) => {
    navigate(`/game/${size}`)
    setSelectedMode(null)
  }

  const sizes = selectedMode === 'expert' ? EXPERT_SIZES : CLASSIC_SIZES

  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-6 pt-4 sm:pt-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center gap-2"
        >
          <Lightbulb
            size={72}
            className="text-[var(--color-primary)] drop-shadow-[4px_4px_0px_var(--color-shadow)]"
          />
          <h1 className="text-4xl sm:text-6xl font-black text-[var(--color-text)] m-0 tracking-tight">
            Lights Out
          </h1>
          <p className="text-[var(--color-text-muted)] text-base sm:text-lg">
            Apaga todas las luces para ganar
          </p>
        </motion.div>

        {selectedMode ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                {selectedMode === 'expert' ? 'Experto' : 'Clásico'} — elige tamaño
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMode(null)}>
                Volver
              </Button>
            </div>
            <div className={cn(
              'grid gap-2',
              selectedMode === 'expert' ? 'grid-cols-3' : 'grid-cols-5',
            )}>
              {sizes.map(({ label, rows }) => (
                <Button
                  key={rows}
                  variant="secondary"
                  size={selectedMode === 'expert' ? 'md' : 'sm'}
                  onClick={() => handleSizeSelect(rows)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </motion.section>
        ) : (
          <section className="w-full max-w-md flex flex-col gap-3">
            {GAME_MODES.map((mode, i) => {
              const Icon = iconMap[mode.icon]
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  onClick={() => !mode.comingSoon && handleModeSelect(mode.id)}
                  disabled={mode.comingSoon}
                  className={cn(
                    'flex items-center gap-4 p-4 w-full text-left',
                    'bg-[var(--color-surface)]',
                    'border-[var(--border-width)] border-[var(--color-border)]',
                    'shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
                    'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-shadow)]',
                    'active:translate-x-[3px] active:translate-y-[3px]',
                    'transition-all duration-100',
                    'cursor-pointer',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
                  )}
                >
                  {Icon && (
                    <div className="p-2 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
                      <Icon size={22} className="text-[var(--color-accent)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base flex items-center gap-2">
                      {mode.title}
                      {mode.comingSoon && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--color-primary)] text-[var(--color-secondary)]">
                          PRONTO
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {mode.description}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </section>
        )}
      </div>
    </PageTransition>
  )
}
