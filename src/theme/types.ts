export interface ThemeColors {
  bg: string
  surface: string
  border: string
  text: string
  'text-muted': string
  primary: string
  'primary-hover': string
  secondary: string
  accent: string
  success: string
  error: string
  shadow: string
}

export interface Theme {
  id: string
  name: string
  colors: ThemeColors
  shadowOffset: string
  borderWidth: string
}

export type ThemeId = 'classic' | 'cyber' | 'terminal' | 'retro' | 'pastel' | 'dark'
