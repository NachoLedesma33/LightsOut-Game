import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { cn } from '../../lib/utils'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className={cn('flex-1 mx-auto w-full max-w-4xl px-4 py-6', 'pb-24 sm:pb-6')}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
