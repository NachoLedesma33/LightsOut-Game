import { Trophy } from 'lucide-react'

const achievements = [
  { id: 'first_win', title: 'Primera victoria', description: 'Resuelve tu primer tablero', unlocked: false },
]

export function Achievements() {
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <div className="flex flex-col items-center gap-2">
        <Trophy size={48} className="text-[var(--color-primary)]" />
        <h1 className="text-3xl font-black text-[var(--color-text)] m-0">
          Logros
        </h1>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {achievements.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-4 p-4 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)] opacity-50"
          >
            <Trophy size={24} className="text-[var(--color-text-muted)] shrink-0" />
            <div>
              <div className="font-bold text-sm">{a.title}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{a.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
