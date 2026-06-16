import { useEffect, useState, useRef, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { ArrowLeft, RotateCcw, Lightbulb, Undo2, Sparkles, Infinity as InfinityIcon } from 'lucide-react'
import { Button } from '../components/ui'
import { PageTransition } from '../components/layout'
import { useGameStore } from '../stores/gameStore'
import { useInfiniteStore } from '../stores/infiniteStore'
import { formatTime, cn } from '../lib/utils'
import { getBoardConfig, calculateScore } from '../core/infiniteMode'
import { getDifficultyLabel } from '../core/difficulty'
import type { DifficultyTier } from '../core/types'
import { useReducedMotion } from '../hooks/useReducedMotion'

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

const difficultyColors: Record<DifficultyTier, string> = {
  easy: 'text-[var(--color-success)]',
  medium: 'text-[var(--color-primary)]',
  hard: 'text-[var(--color-accent)]',
  expert: 'text-[var(--color-error)]',
}

interface GridCellProps {
  row: number
  col: number
  isOn: boolean
  disabled: boolean
  cellSize: number
  hintLevel: number
  isHinted: boolean
  heatIntensity: number
  hintIdx: number
  onMove: (row: number, col: number) => void
  tapSpring: Record<string, unknown>
  staggerVariant: typeof cellVariants | undefined
}

const GridCell = memo(function GridCell({
  row, col, isOn, disabled, cellSize, hintLevel, isHinted, heatIntensity, hintIdx, onMove, tapSpring, staggerVariant,
}: GridCellProps) {
  return (
    <motion.button
      onClick={() => onMove(row, col)}
      disabled={disabled}
      aria-label={`Fila ${row + 1}, columna ${col + 1}${isOn ? ', encendida' : ', apagada'}`}
      style={{ minHeight: `${cellSize}px` }}
      className={cn(
        'aspect-square cursor-pointer border-[var(--border-width)] border-[var(--color-border)] disabled:cursor-not-allowed relative',
        isHinted && hintLevel >= 2 && 'animate-pulse-hint',
      )}
      variants={staggerVariant}
      whileTap={disabled ? undefined : { scale: 0.88 }}
      transition={tapSpring}
    >
      <div
        className="w-full h-full transition-colors duration-150 relative"
        style={{
          backgroundColor: isOn ? 'var(--color-primary)' : 'var(--color-surface)',
          boxShadow: isOn
            ? 'var(--shadow-offset, 4px 4px) 0px 0px var(--color-shadow)'
            : 'none',
        }}
      >
        {hintLevel === 1 && heatIntensity > 0 && (
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: `rgba(34, 197, 94, ${heatIntensity * 0.4})` }}
          />
        )}
        {isHinted && hintLevel === 2 && (
          <div className="absolute inset-0 border-2 border-[var(--color-accent)] animate-pulse-hint" />
        )}
        {isHinted && hintLevel >= 3 && (
          <div
            className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white"
            style={{ backgroundColor: 'rgba(255, 107, 53, 0.7)' }}
          >
            {hintIdx + 1}
          </div>
        )}
      </div>
    </motion.button>
  )
})

function ConfettiOverlay({ reduced }: { reduced: boolean }) {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (reduced) return null

  return (
    <Confetti
      width={size.w}
      height={size.h}
      numberOfPieces={200}
      recycle={false}
      colors={['#FFD600', '#FF6B35', '#22C55E', '#3B82F6', '#EF4444']}
    />
  )
}

export function Infinite() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  const grid = useGameStore((s) => s.grid)
  const status = useGameStore((s) => s.status)
  const moveCount = useGameStore((s) => s.moveCount)
  const elapsedTime = useGameStore((s) => s.elapsedTime)
  const storeDifficulty = useGameStore((s) => s.difficulty)
  const hintLevel = useGameStore((s) => s.hintLevel)
  const hintData = useGameStore((s) => s.hintData)
  const initGame = useGameStore((s) => s.initGame)
  const makeMove = useGameStore((s) => s.makeMove)
  const reset = useGameStore((s) => s.reset)
  const undo = useGameStore((s) => s.undo)
  const useHint = useGameStore((s) => s.useHint)
  const size = useGameStore((s) => s.size)

  const { highScore, setHighScore, setBestStreak, incrementTotalBoards } = useInfiniteStore()

  const [boardNumber, setBoardNumber] = useState(1)
  const [sessionScore, setSessionScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [boardScore, setBoardScore] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const boardNumberRef = useRef(boardNumber)
  const sessionScoreRef = useRef(sessionScore)
  const streakRef = useRef(streak)

  useEffect(() => {
    boardNumberRef.current = boardNumber
    sessionScoreRef.current = sessionScore
    streakRef.current = streak
  }, [boardNumber, sessionScore, streak])

  useEffect(() => {
    const config = getBoardConfig(1)
    initGame(config.size, config.difficulty, 'infinite', config.seed)
    return () => { useGameStore.getState().destroy() }
  }, [initGame])

  useEffect(() => {
    let prevStatus = useGameStore.getState().status
    const unsub = useGameStore.subscribe((state) => {
      if (state.status === 'won' && prevStatus !== 'won') {
        const score = calculateScore({
          size: state.size,
          moves: state.moveCount,
          hintsUsed: state.hintsUsed,
          timeSeconds: state.elapsedTime,
        })
        setBoardScore(score)
        setSessionScore((prev) => prev + score)
        setStreak((prev) => prev + 1)
        setShowSummary(true)
        incrementTotalBoards()
        setHighScore(sessionScoreRef.current + score)
        setBestStreak(streakRef.current + 1)
      }
      prevStatus = state.status
    })
    return unsub
  }, [incrementTotalBoards, setHighScore, setBestStreak])


  const handleNext = () => {
    const nextNum = boardNumber + 1
    const config = getBoardConfig(nextNum)
    setBoardNumber(nextNum)
    setShowSummary(false)
    initGame(config.size, config.difficulty, 'infinite', config.seed)
  }

  const handleQuit = () => navigate('/')

  const cellSize = Math.max(28, Math.min(56, Math.floor(380 / size)))
  const gap = size >= 8 ? 1 : size >= 6 ? 2 : 3
  const diffLabel = getDifficultyLabel(storeDifficulty)
  const tapSpring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 500, damping: 20 }
  const staggerEnabled = !reduced

  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex items-center justify-between w-full max-w-sm">
          <Button variant="ghost" size="sm" onClick={handleQuit} aria-label="Salir del modo infinito">
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Salir</span>
          </Button>

          <div className="flex items-center gap-2">
            <InfinityIcon size={16} className="text-[var(--color-accent)]" />
            <span className="text-[10px] sm:text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
              Infinito
            </span>
          </div>

          <span className="text-xs font-bold text-[var(--color-text-muted)]">
            #{boardNumber}
          </span>
        </div>

        {/* Score row */}
        <div className="flex items-center justify-between w-full max-w-sm">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Puntaje</span>
            <span className="text-lg font-black tabular-nums">{sessionScore}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Racha</span>
            <span className="text-lg font-black tabular-nums">{streak}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Récord</span>
            <span className="text-lg font-black tabular-nums">{highScore}</span>
          </div>
        </div>

        {/* Board info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={cn(
            'text-[10px] sm:text-xs font-bold px-1.5 py-0.5 border-[var(--border-width)] uppercase',
            difficultyColors[storeDifficulty],
          )}>
            {diffLabel}
          </span>
          <span className="text-xs font-bold text-[var(--color-text-muted)]">
            {size}×{size}
          </span>
          <span className="font-bold font-mono text-base sm:text-lg tabular-nums">
            {formatTime(elapsedTime)}
          </span>
          <span
            className="inline-flex items-center justify-center h-8 min-w-[2rem] px-2 text-xs font-bold border-[var(--border-width)] border-[var(--color-border)] bg-[var(--color-surface)] select-none"
            aria-label={`${moveCount} movimientos`}
          >
            {moveCount}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          key={`${size}-${boardNumber}`}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gap: `${gap}px`,
            width: 'min(85vw, 420px)',
          }}
        >
          {Array.from({ length: size * size }).map((_, i) => {
            const row = Math.floor(i / size)
            const col = i % size
            const isOn = grid[row]?.[col] ?? false
            const disabled = status !== 'playing'
            const isHinted = hintData?.moves.some((m) => m.row === row && m.col === col) ?? false
            const hintIdx = hintData ? hintData.moves.findIndex((m) => m.row === row && m.col === col) : -1
            const heatVal = hintData?.heatMap?.[row]?.[col] ?? 0
            const heatIntensity = Math.max(0, heatVal / 5)

            return (
              <GridCell
                key={i}
                row={row}
                col={col}
                isOn={isOn}
                disabled={disabled}
                cellSize={cellSize}
                hintLevel={hintLevel}
                isHinted={isHinted}
                heatIntensity={heatIntensity}
                hintIdx={hintIdx}
                onMove={makeMove}
                tapSpring={tapSpring}
                staggerVariant={staggerEnabled ? cellVariants : undefined}
              />
            )
          })}
        </motion.div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={undo}
            disabled={status !== 'playing' || moveCount === 0}
            aria-label="Deshacer"
          >
            <Undo2 size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Deshacer</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={useHint}
            disabled={status !== 'playing'}
            className="relative"
            aria-label="Usar pista"
          >
            <Lightbulb size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Pista</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            aria-label="Reiniciar partida"
          >
            <RotateCcw size={16} aria-hidden="true" />
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

      {/* Win summary overlay */}
      <AnimatePresence>
      {showSummary && status === 'won' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inf-win-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-shadow)]/60"
          onKeyDown={(e) => { if (e.key === 'Escape') setShowSummary(false) }}
        >
          <ConfettiOverlay reduced={reduced} />
          <motion.div
            initial={reduced ? { opacity: 0 } : { y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: 40 }}
            className="bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)] p-6 sm:p-8 text-center max-w-sm mx-4"
          >
            <motion.div
              initial={reduced ? { opacity: 0 } : { rotate: -10, scale: 0 }}
              animate={reduced ? { opacity: 1 } : { rotate: 0, scale: 1 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
            >
              <Sparkles size={48} className="mx-auto mb-3 text-[var(--color-primary)]" aria-hidden="true" />
            </motion.div>
            <h2 id="inf-win-title" className="text-2xl font-black mb-1">¡Completado!</h2>
            <div className="text-sm font-bold text-[var(--color-text-muted)] mb-2">
              {size}×{size} · {diffLabel}
            </div>
            <div className="text-sm text-[var(--color-text-muted)] mb-1">
              {moveCount} movimientos {elapsedTime > 0 && `en ${formatTime(elapsedTime)}`}
            </div>
            <div className="text-3xl font-black text-[var(--color-accent)] my-4">
              +{boardScore}
            </div>
            <div className="text-sm font-bold text-[var(--color-text-muted)] mb-6">
              Total: {sessionScore}
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={handleNext} autoFocus>
                Siguiente →
              </Button>
              <Button variant="ghost" onClick={handleQuit}>
                Finalizar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </PageTransition>
  )
}
