import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeId } from '../theme/types'

interface SettingsState {
  theme: ThemeId
  soundEnabled: boolean
  animationsEnabled: boolean
  reducedMotion: boolean
  vibrationEnabled: boolean
  highContrast: boolean
}

interface SettingsActions {
  setTheme: (theme: ThemeId) => void
  toggleSound: () => void
  toggleAnimations: () => void
  toggleReducedMotion: () => void
  toggleVibration: () => void
  toggleHighContrast: () => void
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      theme: 'classic',
      soundEnabled: true,
      animationsEnabled: true,
      reducedMotion: false,
      vibrationEnabled: true,
      highContrast: false,

      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
      toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
    }),
    { name: 'lightsout-settings' },
  ),
)
