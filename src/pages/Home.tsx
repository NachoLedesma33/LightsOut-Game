import { Lightbulb, Brain, Infinity, Timer, Calendar, Swords, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui'
import {
  GAME_MODES,
  CLASSIC_SIZES,
  EXPERT_SIZES,
} from '../core/constants'
import { DIFFICULTY_TIERS } from '../core/difficulty'
import { getAvailableDifficulties } from '../core/difficulty'
import { PageTransition } from '../components/layout'
import { useState } from 'react'
import type { GameMode, DifficultyTier } from '../core/types'
import { cn } from '../lib/utils'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Lightbulb, Brain, Infinity, Timer, Calendar, Swords, Zap,
}

export function Home() {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)

  const handleModeSelect = (modeId: GameMode) => {
    if (modeId === 'daily') {
      navigate('/daily')
      return
    }
    if (modeId === 'classic' || modeId === 'expert') {
      setSelectedMode(modeId)
      setSelectedSize(null)
    }
  }

  const handleSizeSelect = (size: number) => {
    setSelectedSize(size)
  }

  const handleDifficultySelect = (tier: DifficultyTier) => {
    navigate(`/game/${selectedSize}?d=${tier}`)
    setSelectedMode(null)
    setSelectedSize(null)
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

        <AnimatePresence mode="wait">
          {selectedSize ? (
            <motion.section
              key="difficulty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {selectedSize}×{selectedSize} — dificultad
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSize(null)}>
                  Volver
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {getAvailableDifficulties(selectedSize).map((tier) => {
                  const config = DIFFICULTY_TIERS.find((d) => d.tier === tier)!
                  return (
                    <motion.button
                      key={tier}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDifficultySelect(tier)}
                      className={cn(
                        'flex items-center justify-between p-4 w-full text-left',
                        'bg-[var(--color-surface)]',
                        'border-[var(--border-width)] border-[var(--color-border)]',
                        'shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
                        'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-shadow)]',
                        'active:translate-x-[3px] active:translate-y-[3px]',
                        'transition-all duration-100 cursor-pointer',
                      )}
                    >
                      <div>
                        <div className="font-bold text-sm">{config.label}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{config.description}</div>
                      </div>
                      <DifficultyBadge tier={tier} />
                    </motion.button>
                  )
                })}
              </div>
            </motion.section>
          ) : selectedMode ? (
            <motion.section
              key="sizes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
            <motion.section
              key="modes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full max-w-md flex flex-col gap-3"
            >
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
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

function DifficultyBadge({ tier }: { tier: DifficultyTier }) {
  const colorMap: Record<DifficultyTier, string> = {
    easy: 'bg-[var(--color-success)]',
    medium: 'bg-[var(--color-primary)]',
    hard: 'bg-[var(--color-accent)]',
    expert: 'bg-[var(--color-error)]',
  }
  const labelMap: Record<DifficultyTier, string> = {
    easy: 'Fácil',
    medium: 'Normal',
    hard: 'Difícil',
    expert: 'Experto',
  }
  return (
    <span className={cn(
      'px-2 py-0.5 text-[11px] font-bold text-[var(--color-secondary)]',
      colorMap[tier],
    )}>
      {labelMap[tier]}
    </span>
  )
}
