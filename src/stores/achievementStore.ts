import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { ACHIEVEMENTS } from '../core/achievements'
import type { GameRecord } from './statisticsStore'
import { useStatisticsStore } from './statisticsStore'

interface AchievementState {
  unlocked: Record<string, string>
}

interface AchievementActions {
  check: (gameRecord?: GameRecord) => string[]
  isUnlocked: (id: string) => boolean
  resetAchievements: () => void
}

type AchievementStore = AchievementState & AchievementActions

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlocked: {},

      check: (gameRecord) => {
        const stats = useStatisticsStore.getState()
        const currentUnlocked = get().unlocked
        const newlyUnlocked: string[] = []
        const updatedUnlocked = { ...currentUnlocked }

        for (const a of ACHIEVEMENTS) {
          if (updatedUnlocked[a.id]) continue
          if (a.condition(stats, gameRecord)) {
            updatedUnlocked[a.id] = new Date().toISOString()
            newlyUnlocked.push(a.id)
          }
        }

        if (newlyUnlocked.length > 0) {
          set({ unlocked: updatedUnlocked })
          for (const id of newlyUnlocked) {
            const def = ACHIEVEMENTS.find((a) => a.id === id)
            if (def) {
              toast(`${def.icon}  ¡Logro desbloqueado!`, {
                description: `${def.title}: ${def.description}`,
                duration: 5000,
              })
            }
          }
        }

        return newlyUnlocked
      },

      isUnlocked: (id) => id in get().unlocked,

      resetAchievements: () => set({ unlocked: {} }),
    }),
    { name: 'lightsout-achievements' },
  ),
)
