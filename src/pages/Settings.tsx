import {
  Settings as SettingsIcon,
  Volume2,
  Monitor,
  Activity,
  Vibrate,
  Contrast,
  Palette,
  Info,
} from 'lucide-react'
import { Button, Switch } from '../components/ui'
import { useSettingsStore } from '../stores/settingsStore'
import { themes, themeIds } from '../theme/themes'
import { PageTransition } from '../components/layout'

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
    <PageTransition>
      <div className="flex flex-col gap-10 pt-6 sm:pt-10 pb-12">
        <div className="flex flex-col gap-2">
          <SettingsIcon size={48} className="text-[var(--color-primary)]" />
          <h1 className="text-3xl font-black text-[var(--color-text)] m-0">Ajustes</h1>
        </div>

        <SettingsSection icon={Palette} title="Tema">
          <div className="flex flex-row flex-wrap gap-3">
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
        </SettingsSection>

        <SettingsSection icon={Monitor} title="Preferencias">
          <div className="flex flex-col gap-4">
            <SettingRow icon={Volume2} label="Sonido" checked={soundEnabled} onToggle={toggleSound} />
            <SettingRow icon={Monitor} label="Animaciones" checked={animationsEnabled} onToggle={toggleAnimations} />
            <SettingRow icon={Activity} label="Movimiento reducido" checked={reducedMotion} onToggle={toggleReducedMotion} />
            <SettingRow icon={Vibrate} label="Vibración" checked={vibrationEnabled} onToggle={toggleVibration} />
            <SettingRow icon={Contrast} label="Alto contraste" checked={highContrast} onToggle={toggleHighContrast} />
          </div>
        </SettingsSection>

        <SettingsSection icon={Info} title="Acerca de">
          <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)] text-sm">
            <p className="font-bold mb-1">Lights Out Game</p>
            <p className="text-[var(--color-text-muted)]">
              Versión 0.1.0 · React 19 + TypeScript + Vite
            </p>
            <p className="text-[var(--color-text-muted)] mt-1">
              Inspirado en el clásico juego electrónico de Tiger Electronics.
            </p>
          </div>
        </SettingsSection>
      </div>
    </PageTransition>
  )
}

function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--color-accent)]" />
        <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider m-0">
          {title}
        </h2>
      </div>
      {children}
    </section>
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
    <div className="flex items-center justify-between p-4 sm:p-5 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[var(--color-text-muted)]" />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  )
}
