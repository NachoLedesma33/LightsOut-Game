import { Settings as SettingsIcon, Volume2, Monitor, Activity, Vibrate, Contrast } from 'lucide-react'
import { Button, Switch } from '../components/ui'
import { useSettingsStore } from '../stores/settingsStore'
import { themes, themeIds } from '../theme/themes'

export function SettingsPage() {
  const {
    theme: currentTheme,
    soundEnabled,
    animationsEnabled,
    reducedMotion,
    vibrationEnabled,
    highContrast,
    setTheme,
    toggleSound,
    toggleAnimations,
    toggleReducedMotion,
    toggleVibration,
    toggleHighContrast,
  } = useSettingsStore()

  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <div className="flex flex-col items-center gap-2">
        <SettingsIcon size={48} className="text-[var(--color-primary)]" />
        <h1 className="text-3xl font-black text-[var(--color-text)] m-0">
          Ajustes
        </h1>
      </div>

      <section className="w-full max-w-sm flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          Tema
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {themeIds.map((id) => {
            const t = themes[id]
            return (
              <Button
                key={id}
                variant={id === currentTheme ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme(id)}
              >
                {t.name}
              </Button>
            )
          })}
        </div>
      </section>

      <section className="w-full max-w-sm flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          Preferencias
        </h2>

        <div className="flex flex-col gap-2">
          <SettingRow icon={Volume2} label="Sonido" checked={soundEnabled} onToggle={toggleSound} />
          <SettingRow icon={Monitor} label="Animaciones" checked={animationsEnabled} onToggle={toggleAnimations} />
          <SettingRow icon={Activity} label="Movimiento reducido" checked={reducedMotion} onToggle={toggleReducedMotion} />
          <SettingRow icon={Vibrate} label="Vibración" checked={vibrationEnabled} onToggle={toggleVibration} />
          <SettingRow icon={Contrast} label="Alto contraste" checked={highContrast} onToggle={toggleHighContrast} />
        </div>
      </section>
    </div>
  )
}

function SettingRow({
  icon: Icon,
  label,
  checked,
  onToggle,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[var(--color-text-muted)]" />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  )
}
