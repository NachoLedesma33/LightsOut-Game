import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Lightbulb, Undo2, Sparkles } from 'lucide-react'
import { Button } from '../components/ui'
import { PageTransition } from '../components/layout'
import { useGameStore } from '../stores/gameStore'
import { formatTime } from '../lib/utils'
import { getDifficultyLabel } from '../core/difficulty'
import { getAvailableDifficulties, getDefaultDifficulty } from '../core/difficulty'
import type { DifficultyTier } from '../core/types'
import { cn } from '../lib/utils'

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

export function Game() {
  const { size } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const gridSize = Number(size) || 5

  const urlDifficulty = searchParams.get('d') as DifficultyTier | null

  const difficulty = useMemo(() => {
    if (urlDifficulty && (getAvailableDifficulties(gridSize) as string[]).includes(urlDifficulty)) {
      return urlDifficulty
    }
    return getDefaultDifficulty(gridSize)
  }, [urlDifficulty, gridSize])

  const {
    grid,
    status,
    moveCount,
    elapsedTime,
    difficulty: storeDifficulty,
    initGame,
    makeMove,
    reset,
    undo,
  } = useGameStore()

  useEffect(() => {
    initGame(gridSize, difficulty)
    return () => {
      useGameStore.getState().destroy()
    }
  }, [gridSize, difficulty])

  const cellSize = Math.max(28, Math.min(56, Math.floor(380 / gridSize)))
  const gap = gridSize >= 8 ? 1 : gridSize >= 6 ? 2 : 3
  const diffLabel = getDifficultyLabel(storeDifficulty)

  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="flex items-center justify-between w-full max-w-sm">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver</span>
          </Button>

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

          <div className="flex gap-1">
            <Button variant="secondary" size="sm">
              {moveCount}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)]">
          <Lightbulb size={14} />
          <span>{gridSize}×{gridSize}</span>
        </div>

        <motion.div
          key={`${gridSize}-${difficulty}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
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

            return (
              <button
                key={i}
                onClick={() => makeMove(row, col)}
                disabled={disabled}
                style={{ minHeight: `${cellSize}px` }}
                className="aspect-square cursor-pointer transition-all duration-100 border-[var(--border-width)] border-[var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-shadow)] disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0"
              >
                <div
                  className="w-full h-full transition-colors duration-150"
                  style={{
                    backgroundColor: isOn
                      ? 'var(--color-primary)'
                      : 'var(--color-surface)',
                    boxShadow: isOn
                      ? 'var(--shadow-offset, 4px 4px) 0px 0px var(--color-shadow)'
                      : 'none',
                  }}
                />
              </button>
            )
          })}
        </motion.div>

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
            variant="ghost"
            size="sm"
            onClick={reset}
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {status === 'won' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-shadow)]/60"
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              className="bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)] p-8 text-center max-w-sm mx-4"
            >
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
              >
                <Sparkles
                  size={64}
                  className="mx-auto mb-4 text-[var(--color-primary)]"
                />
              </motion.div>
              <h2 className="text-2xl font-black mb-2">¡Ganaste!</h2>
              <p className="text-[var(--color-text-muted)] mb-2">
                {gridSize}×{gridSize} · {diffLabel}
              </p>
              <p className="text-[var(--color-text-muted)] mb-6">
                {moveCount} movimientos {elapsedTime > 0 && `en ${formatTime(elapsedTime)}`}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="primary" onClick={() => initGame(gridSize, storeDifficulty)}>
                  Nueva partida
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
