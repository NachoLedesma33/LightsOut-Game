import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { ScrollToTop } from './ScrollToTop'
import { cn } from '../../lib/utils'

export function RootLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-svh flex-col bg-[var(--color-bg)]">
      <ScrollToTop />
      <TopBar />
      <main className={cn('flex-1 mx-auto w-full max-w-4xl px-4 py-6', 'pb-20 sm:pb-6')}>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
