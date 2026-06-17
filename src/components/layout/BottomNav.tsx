import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Lightbulb, BarChart3, Trophy, Settings, BookOpen } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Jugar', icon: Lightbulb },
  { to: '/statistics', label: 'Stats', icon: BarChart3 },
  { to: '/achievements', label: 'Logros', icon: Trophy },
  { to: '/how-to-play', label: 'Ayuda', icon: BookOpen },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 sm:hidden',
        'bg-[var(--color-surface)]',
        'border-t-[var(--border-width)] border-t-[var(--color-border)]',
        'shadow-[0_-2px_0px_0px_var(--color-shadow)]',
      )}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 no-underline text-xs font-bold',
              'transition-colors',
              location.pathname === to
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)]',
            )}
          >
            <Icon size={20} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
