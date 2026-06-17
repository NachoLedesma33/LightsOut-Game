import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lightbulb, BarChart3, Trophy, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/', label: 'Jugar', icon: Lightbulb },
  { to: '/statistics', label: 'Estadísticas', icon: BarChart3 },
  { to: '/achievements', label: 'Logros', icon: Trophy },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const location = useLocation()

  useEffect(() => {
    onClose()
  }, [location.pathname])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--color-shadow)]/50 sm:hidden"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-50 w-72 sm:hidden',
              'bg-[var(--color-surface)]',
              'border-l-[var(--border-width)] border-l-[var(--color-border)]',
              'shadow-[-4px_0px_0px_0px_var(--color-shadow)]',
            )}
          >
            <div className="flex items-center justify-between p-4 border-b-[var(--border-width)] border-b-[var(--color-border)]">
              <span className="font-black text-lg">Menú</span>
              <button
                onClick={onClose}
                className="flex items-center justify-center p-1 cursor-pointer bg-transparent border-none text-[var(--color-text)] hover:bg-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                aria-label="Cerrar menú"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col p-3 gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-base font-bold no-underline',
                    'transition-colors',
                    location.pathname === to
                      ? 'bg-[var(--color-primary)] text-[var(--color-secondary)]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-bg)]',
                  )}
                >
                  <Icon size={20} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
