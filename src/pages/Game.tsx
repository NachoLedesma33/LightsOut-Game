import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { ArrowLeft, RotateCcw, Lightbulb, Undo2, Sparkles, Calendar } from 'lucide-react'
import { Button } from '../components/ui'
import { PageTransition } from '../components/layout'
import { useGameStore } from '../stores/gameStore'
import { formatTime } from '../lib/utils'
import { getDifficultyLabel } from '../core/difficulty'
import { getAvailableDifficulties, getDefaultDifficulty } from '../core/difficulty'
import type { DifficultyTier } from '../core/types'
import { cn } from '../lib/utils'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { DAILY_SIZE, DAILY_DIFFICULTY, getDailySeed, formatDailyDate } from '../core/dailyPuzzle'
import { useDailyStore } from '../stores/dailyStore'

const difficultyColors: Record<DifficultyTier, string> = {
  easy: 'text-[var(--color-success)]',
  medium: 'text-[var(--color-primary)]',
  hard: 'text-[var(--color-accent)]',
  expert: 'text-[var(--color-error)]',
}

const difficultyBorders: Record<DifficultyTier, string> = {
  easy: 'border-[var(--color-success)]',
  medium: 'border-[var(--color-primary)]',
  hard: 'border-[var(--color-accent)]',
  expert: 'border-[var(--color-error)]',
}

const gridVariants = {
  hidden: { scale: 0.92, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.05 },
  },
}

const cellVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1 },
}

export function Game() {
  const { size } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const reduced = useReducedMotion()

  const isDaily = location.pathname === '/daily'
  const gridSize = isDaily ? DAILY_SIZE : (Number(size) || 5)
  const dailySeed = useMemo(() => (isDaily ? getDailySeed() : undefined), [isDaily])

  const [winSize, setWinSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))

  useEffect(() => {
    const onResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const urlDifficulty = searchParams.get('d') as DifficultyTier | null

  const difficulty = useMemo(() => {
    if (isDaily) return DAILY_DIFFICULTY
    if (urlDifficulty && (getAvailableDifficulties(gridSize) as string[]).includes(urlDifficulty)) {
      return urlDifficulty
    }
    return getDefaultDifficulty(gridSize)
  }, [urlDifficulty, gridSize, isDaily])

  const {
    grid,
    status,
    moveCount,
    elapsedTime,
    difficulty: storeDifficulty,
    hintLevel,
    hintData,
    initGame,
    makeMove,
    reset,
    undo,
    useHint,
  } = useGameStore()

  useEffect(() => {
    if (isDaily) {
      initGame(gridSize, DAILY_DIFFICULTY, 'daily', dailySeed)
    } else {
      initGame(gridSize, difficulty)
    }
    return () => {
      useGameStore.getState().destroy()
    }
  }, [gridSize, difficulty, isDaily, dailySeed])

  const cellSize = Math.max(28, Math.min(56, Math.floor(380 / gridSize)))
  const gap = gridSize >= 8 ? 1 : gridSize >= 6 ? 2 : 3
  const diffLabel = getDifficultyLabel(storeDifficulty)

  const tapSpring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 500, damping: 20 }
  const staggerEnabled = !reduced

  const isTodayDone = useDailyStore((s) => s.isTodayCompleted())

  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        {/* Header row */}
        <div className="flex items-center justify-between w-full max-w-sm">
          <Button variant="ghost" size="sm" onClick={() => navigate(isDaily ? '/' : '/')}>
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver</span>
          </Button>

          {isDaily ? (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[var(--color-accent)]" />
              <span className="text-xs sm:text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider">
                Puzzle Diario
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={cn(
                'text-[10px] sm:text-xs font-bold px-1.5 py-0.5 border-[var(--border-width)] uppercase',
                difficultyBorders[storeDifficulty],
                difficultyColors[storeDifficulty],
              )}>
                {diffLabel}
              </span>
              <span className="font-bold font-mono text-base sm:text-lg tabular-nums">
                {formatTime(elapsedTime)}
              </span>
            </div>
          )}

          <div className="flex gap-1">
            <Button variant="secondary" size="sm">
              {moveCount}
            </Button>
          </div>
        </div>

        {isDaily && (
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-bold text-[var(--color-text-muted)]">
              {formatDailyDate()}
            </div>
            <div className="text-[10px] font-bold text-[var(--color-text-muted)] opacity-60">
              {gridSize}×{gridSize} · {diffLabel}
            </div>
            {isTodayDone && (
              <div className="text-[10px] font-bold text-[var(--color-success)] mt-1">
                Completado hoy ✓
              </div>
            )}
          </div>
        )}

        {!isDaily && (
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)]">
            <Lightbulb size={14} />
            <span>{gridSize}×{gridSize}</span>
          </div>
        )}

        {/* Grid */}
        <motion.div
          key={`${gridSize}-${difficulty}${isDaily ? `-${dailySeed}` : ''}`}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: `${gap}px`,
            width: 'min(85vw, 420px)',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const row = Math.floor(i / gridSize)
            const col = i % gridSize
            const isOn = grid[row]?.[col] ?? false
            const disabled = status !== 'playing'

            const isHinted = hintData?.moves.some((m) => m.row === row && m.col === col) ?? false
            const hintIdx = hintData ? hintData.moves.findIndex((m) => m.row === row && m.col === col) : -1
            const heatVal = hintData?.heatMap?.[row]?.[col] ?? 0
            const heatIntensity = Math.max(0, heatVal / 5)

            return (
              <motion.button
                key={i}
                onClick={() => makeMove(row, col)}
                disabled={disabled}
                style={{ minHeight: `${cellSize}px` }}
                className={cn(
                  'aspect-square cursor-pointer border-[var(--border-width)] border-[var(--color-border)] disabled:cursor-not-allowed relative',
                  isHinted && hintLevel >= 2 && 'animate-pulse-hint',
                )}
                variants={staggerEnabled ? cellVariants : undefined}
                whileTap={disabled ? undefined : { scale: 0.88 }}
                transition={tapSpring}
              >
                <div
                  className="w-full h-full transition-colors duration-150 relative"
                  style={{
                    backgroundColor: isOn
                      ? 'var(--color-primary)'
                      : 'var(--color-surface)',
                    boxShadow: isOn
                      ? 'var(--shadow-offset, 4px 4px) 0px 0px var(--color-shadow)'
                      : 'none',
                  }}
                >
                  {hintLevel === 1 && heatVal > 0 && (
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        backgroundColor: `rgba(34, 197, 94, ${heatIntensity * 0.4})`,
                      }}
                    />
                  )}
                  {isHinted && hintLevel === 2 && (
                    <div
                      className="absolute inset-0 border-2 border-[var(--color-accent)] animate-pulse-hint"
                    />
                  )}
                  {isHinted && hintLevel >= 3 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white"
                      style={{
                        backgroundColor: 'rgba(255, 107, 53, 0.7)',
                      }}
                    >
                      {hintIdx + 1}
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={undo}
            disabled={status !== 'playing' || moveCount === 0}
          >
            <Undo2 size={16} />
            <span className="hidden sm:inline">Deshacer</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={useHint}
            disabled={status !== 'playing'}
            className="relative"
          >
            <Lightbulb size={16} />
            <span className="hidden sm:inline">Pista</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
        </div>

        {/* Hint description */}
        {hintData && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="text-xs font-bold text-[var(--color-text-muted)] text-center max-w-xs px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            {hintData.description}
          </motion.div>
        )}
      </div>

      {/* Win modal */}
      <AnimatePresence>
        {status === 'won' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-shadow)]/60"
          >
            {!reduced && (
              <Confetti
                width={winSize.w}
                height={winSize.h}
                numberOfPieces={200}
                recycle={false}
                colors={['#FFD600', '#FF6B35', '#22C55E', '#3B82F6', '#EF4444']}
              />
            )}
            <motion.div
              initial={reduced ? { opacity: 0 } : { y: 40 }}
              animate={reduced ? { opacity: 1 } : { y: 0 }}
              className="bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)] p-8 text-center max-w-sm mx-4"
            >
              <motion.div
                initial={reduced ? { opacity: 0 } : { rotate: -10, scale: 0 }}
                animate={reduced ? { opacity: 1 } : { rotate: 0, scale: 1 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }
                }
              >
                <Sparkles
                  size={64}
                  className="mx-auto mb-4 text-[var(--color-primary)]"
                />
              </motion.div>
              <h2 className="text-2xl font-black mb-2">¡Ganaste!</h2>
              <p className="text-[var(--color-text-muted)] mb-2">
                {isDaily ? 'Puzzle Diario' : `${gridSize}×${gridSize} · ${diffLabel}`}
              </p>
              <p className="text-[var(--color-text-muted)] mb-6">
                {moveCount} movimientos {elapsedTime > 0 && `en ${formatTime(elapsedTime)}`}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="primary" onClick={() => navigate(isDaily ? '/' : '')}>
                  {isDaily ? 'Volver al inicio' : 'Nueva partida'}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/')}>
                  Inicio
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
