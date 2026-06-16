import { useReducedMotion as useFmReducedMotion } from 'framer-motion'
import { useSettingsStore } from '../stores/settingsStore'

export function useReducedMotion(): boolean {
  const fmReduced = useFmReducedMotion()
  const settingsReduced = useSettingsStore((s) => s.reducedMotion)
  return fmReduced || settingsReduced
}
