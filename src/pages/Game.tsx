import { useParams } from 'react-router-dom'
import { Button } from '../components/ui'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Game() {
  const { size } = useParams()
  const navigate = useNavigate()
  const gridSize = Number(size) || 5

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-md">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Volver
        </Button>
        <span className="font-bold text-[var(--color-text-muted)]">
          {gridSize}×{gridSize}
        </span>
        <span className="font-bold font-mono text-lg">00:00</span>
      </div>

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: 'min(90vw, 400px)',
          aspectRatio: '1',
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <button
            key={i}
            className="aspect-square cursor-pointer border-[var(--border-width)] border-[var(--color-border)] bg-[var(--color-primary)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-shadow)] transition-all"
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="sm">
          Hint
        </Button>
        <Button variant="ghost" size="sm">
          Reiniciar
        </Button>
      </div>
    </div>
  )
}
