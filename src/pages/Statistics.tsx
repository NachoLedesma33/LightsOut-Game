import { BarChart3, Clock, Target, Zap } from 'lucide-react'
import { PageTransition } from '../components/layout'

const stats = [
  { label: 'Partidas ganadas', value: '0', icon: BarChart3 },
  { label: 'Partidas perdidas', value: '0', icon: Zap },
  { label: 'Mejor tiempo', value: '--:--', icon: Clock },
  { label: 'Menos movimientos', value: '--', icon: Target },
]

export function Statistics() {
  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-6 sm:gap-8 pt-4 sm:pt-8">
        <div className="flex flex-col items-center gap-2">
          <BarChart3 size={48} className="text-[var(--color-primary)]" />
          <h1 className="text-3xl font-black text-[var(--color-text)] m-0">
            Estadísticas
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]"
            >
              <Icon size={20} className="text-[var(--color-accent)]" />
              <span className="text-2xl sm:text-3xl font-black font-mono">{value}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--color-text-muted)] text-center uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
