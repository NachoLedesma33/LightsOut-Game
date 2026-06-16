import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Lightbulb } from 'lucide-react'
import { Button } from '../components/ui'
import { PageTransition } from '../components/layout'

export function Game() {
  const { size } = useParams()
  const navigate = useNavigate()
  const gridSize = Number(size) || 5

  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="flex items-center justify-between w-full max-w-sm">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver</span>
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[var(--color-text-muted)] uppercase">
              {gridSize}×{gridSize}
            </span>
            <span className="font-bold font-mono text-base sm:text-lg tabular-nums">
              00:00
            </span>
          </div>

          <div className="flex gap-1">
            <Button variant="secondary" size="sm">
              0
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="grid gap-1.5 sm:gap-2"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: 'min(85vw, 420px)',
            aspectRatio: '1',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              className="aspect-square cursor-pointer border-[var(--border-width)] border-[var(--color-border)] bg-[var(--color-primary)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-shadow)] transition-all"
            />
          ))}
        </motion.div>

        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Lightbulb size={16} />
            Hint
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCcw size={16} />
            Reiniciar
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
