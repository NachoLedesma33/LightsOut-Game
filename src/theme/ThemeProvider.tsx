import { useEffect, type ReactNode } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { themes } from './themes'
import type { ThemeId } from './types'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeId = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const theme = themes[themeId as ThemeId] ?? themes.classic
    const root = document.documentElement

    for (const [key, value] of Object.entries(theme.colors)) {
      root.style.setProperty(`--color-${key}`, value)
    }
    root.style.setProperty('--shadow-offset', theme.shadowOffset)
    root.style.setProperty('--border-width', theme.borderWidth)
  }, [themeId])

  return <>{children}</>
}
