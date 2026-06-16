import { BarChart3 } from 'lucide-react'

export function Statistics() {
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <div className="flex flex-col items-center gap-2">
        <BarChart3 size={48} className="text-[var(--color-primary)]" />
        <h1 className="text-3xl font-black text-[var(--color-text)] m-0">
          Estadísticas
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {[
          { label: 'Partidas ganadas', value: '0' },
          { label: 'Partidas perdidas', value: '0' },
          { label: 'Mejor tiempo', value: '--:--' },
          { label: 'Menos movimientos', value: '--' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 p-4 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]"
          >
            <span className="text-2xl font-black font-mono">{value}</span>
            <span className="text-xs font-bold text-[var(--color-text-muted)] text-center uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
