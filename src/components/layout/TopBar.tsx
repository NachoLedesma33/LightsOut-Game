import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Lightbulb, BarChart3, Trophy, Settings, Menu } from 'lucide-react'
import { MobileNav } from './MobileNav'

const navItems = [
  { to: '/', label: 'Jugar', icon: Lightbulb },
  { to: '/statistics', label: 'Estadísticas', icon: BarChart3 },
  { to: '/achievements', label: 'Logros', icon: Trophy },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

export function TopBar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40',
          'bg-[var(--color-surface)]',
          'border-b-[var(--border-width)] border-b-[var(--color-border)]',
          'shadow-[0_var(--shadow-offset,4px_4px)_0px_0px_var(--color-shadow)]',
        )}
      >
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 no-underline font-black text-xl text-[var(--color-text)]"
          >
            <Lightbulb size={28} className="text-[var(--color-primary)]" aria-hidden="true" />
            <span className="hidden xs:inline">Lights Out</span>
            <span className="xs:hidden">LO</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-bold no-underline',
                  'transition-colors',
                  location.pathname === to
                    ? 'bg-[var(--color-primary)] text-[var(--color-secondary)]'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-bg)]',
                )}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              'sm:hidden cursor-pointer bg-transparent border-none p-2',
              'text-[var(--color-text)] hover:bg-[var(--color-bg)]',
            )}
            aria-label="Abrir menú"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
