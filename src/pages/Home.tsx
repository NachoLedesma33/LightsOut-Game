import { Lightbulb } from 'lucide-react'
import { Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'

const sizes = [
  { label: '3×3', value: 3 },
  { label: '4×4', value: 4 },
  { label: '5×5', value: 5 },
  { label: '6×6', value: 6 },
  { label: '7×7', value: 7 },
]

const expertSizes = [
  { label: '8×8', value: 8 },
  { label: '9×9', value: 9 },
  { label: '10×10', value: 10 },
]

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <div className="flex flex-col items-center gap-2">
        <Lightbulb size={64} className="text-[var(--color-primary)]" />
        <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-text)] m-0">
          Lights Out
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Apaga todas las luces para ganar
        </p>
      </div>

      <section className="w-full max-w-md">
        <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
          Clásico
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map(({ label, value }) => (
            <Button
              key={value}
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/game/${value}`)}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section className="w-full max-w-md">
        <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
          Experto
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {expertSizes.map(({ label, value }) => (
            <Button
              key={value}
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/game/${value}`)}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}
