# Arquitectura — Lights Out Game

## 1. Entidades de dominio

| Entidad | Descripción |
|---|---|
| `Cell` | Celda individual con posición `(row, col)` y estado `on \| off` |
| `Board` | Grilla de celdas con dimensiones `(rows, cols)`, estado interno `boolean[][]` |
| `Move` | Tupla `{ row, col }` que representa un click |
| `GameSession` | Sesión activa: board, movimientos, tiempo, hints usados, modo, dificultad, estado |
| `PlayerProfile` | Perfil local con estadísticas acumuladas |
| `Achievement` | Logro con ID, condición, progreso y estado `locked \| unlocked` |
| `HeatmapData` | Mapa `cellKey -> clickCount` para cada celda |
| `Theme` | Paleta de colores con valores CSS |
| `Hint` | Nivel (1-5) y datos asociados (celdas a resaltar, secuencia parcial) |
| `GameMode` | `classic \| expert \| infinite \| timed \| daily \| challenge \| chaos` |

---

## 2. Estructura de carpetas

```
src/
├── core/
│   ├── types.ts              # Tipos compartidos del dominio
│   ├── constants.ts           # Grid sizes, defaults, seeds
│   ├── board.ts               # Clase Board: toggle, checkWin, clone
│   ├── gameManager.ts         # Orquestador: init, makeMove, reset
│   └── utils.ts               # Helpers (random seed, shuffle, etc.)
│
├── solver/
│   ├── linearSolver.ts        # Eliminación gaussiana módulo 2
│   ├── bfsSolver.ts           # BFS para tableros ≤4x4
│   ├── astarSolver.ts         # A* para tableros medianos
│   ├── idastarSolver.ts       # IDA* para tableros grandes
│   ├── heuristicSolver.ts     # Fallback heurístico
│   ├── solubilityChecker.ts   # Verifica solubilidad y cuenta soluciones
│   └── solverFactory.ts       # Selecciona solver según tamaño de grilla
│
├── hint/
│   ├── hintEngine.ts          # Lógica de hints nivel 1-5 con penalización
│   └── types.ts               # HintLevel, HintResult
│
├── analytics/
│   ├── stores/
│   │   ├── statisticsStore.ts # Partidas ganadas/perdidas, tiempos, movimientos
│   │   ├── heatmapStore.ts    # Registro de clicks por celda
│   │   └── achievementStore.ts# Sistema de logros
│   ├── persistence.ts         # Capa de localStorage con tipos
│   └── types.ts               # Statistics, Achievement, HeatmapData
│
├── theme/
│   ├── themes.ts              # Definición de los 6 temas (CSS variables)
│   ├── ThemeProvider.tsx       # Provider que aplica variables al DOM
│   └── types.ts               # ThemeColorScheme
│
├── stores/
│   ├── gameStore.ts           # Estado del juego (zustand + persist)
│   ├── settingsStore.ts       # Configuración global (sonido, animaciones, etc.)
│   └── index.ts               # Re-export
│
├── components/
│   ├── ui/                    # Primitivas envolviendo Radix UI
│   │   ├── Button.tsx
│   │   ├── Dialog.tsx
│   │   ├── Slider.tsx
│   │   ├── Switch.tsx
│   │   ├── Tabs.tsx
│   │   └── Tooltip.tsx
│   ├── game/                  # Componentes específicos del juego
│   │   ├── Board.tsx
│   │   ├── Cell.tsx
│   │   ├── GameHeader.tsx
│   │   ├── GameControls.tsx
│   │   ├── Timer.tsx
│   │   ├── MoveCounter.tsx
│   │   ├── HintPanel.tsx
│   │   └── VictoryOverlay.tsx
│   ├── layout/                # Layout general
│   │   ├── RootLayout.tsx
│   │   ├── TopBar.tsx
│   │   └── BottomNav.tsx
│   └── shared/                # Componentes compartidos
│       ├── ThemeSwitcher.tsx
│       ├── DifficultySelector.tsx
│       └── ModeSelector.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── Game.tsx
│   ├── Statistics.tsx
│   ├── Achievements.tsx
│   └── Settings.tsx
│
├── hooks/
│   ├── useGame.ts             # Hook que conecta GameManager con gameStore
│   ├── useTimer.ts            # Hook de temporizador
│   ├── useHint.ts             # Hook para pedir hints
│   └── useKeyboard.ts         # Atajos de teclado
│
├── lib/
│   ├── utils.ts               # cn(), formatTime(), etc.
│   └── storage.ts             # Wrapper tipado de localStorage
│
├── App.tsx                    # Router + providers
├── main.tsx                   # Entry point
└── index.css                  # Tailwind base + CSS variables globales
```

---

## 3. Flujo de estados

```
                     ┌──────────────┐
                     │    IDLE      │ (sin partida activa)
                     └──────┬───────┘
                            │ seleccionar dificultad/modo
                            ▼
                     ┌──────────────┐
                     │  PLAYING     │ ←── makeMove(row, col)
                     │              │
                     │  timer ON    │
                     │  moves++     │
                     └──────┬───────┘
                            │
                   ┌────────┴────────┐
                   ▼                 ▼
            ┌──────────┐     ┌──────────────┐
            │   WON    │     │   LOST       │
            │          │     │              │
            │timer STOP│     │(solo en modo │
            │confetti  │     │ desafío o    │
            │guardar   │     │ contrarreloj)│
            │stats     │     └──────┬───────┘
            └────┬─────┘            │
                 │                  │
                 └──────┬───────────┘
                        ▼
                 ┌──────────────┐
                 │    IDLE      │
                 │(o replay)    │
                 └──────────────┘
```

### Estados internos del Board

| Estado | Descripción |
|---|---|
| `BoardState.Idle` | Sin partida |
| `BoardState.Playing` | Partida en curso |
| `BoardState.Won` | Victoria — todas luces apagadas |
| `BoardState.Lost` | Derrota (modos con condición de fallo) |

---

## 4. Sistema de temas

Cada tema define valores como CSS custom properties aplicadas al `<html>` mediante un `<ThemeProvider>`.

```ts
interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
  };
  shadowOffset: string;   // ej. "4px 4px"
  borderWidth: string;    // ej. "3px"
}
```

Los estilos de componentes usan `var(--color-*)` + `tailwind-merge` + `clsx`. El cambio de tema es instantáneo y no requiere recarga.

**Temas**:
1. Classic Neubrutal — Amarillo, Negro, Blanco
2. Cyber Brutal — Azul eléctrico, Negro, Cian
3. Terminal — Verde fósforo, Negro
4. Retro Arcade — Magenta, Azul, Amarillo
5. Pastel Brutal — Rosa, Celeste, Lavanda
6. Dark Brutal — Gris oscuro, Naranja

---

## 5. Motor del juego (`core/`)

### Board

- Matriz `boolean[][]` donde `true = encendida`
- `toggle(row, col)`: cambia estado propio y 4 vecinos (N, S, E, O)
- `isWin()`: todas las celdas en `false`
- `clone()`: copia profunda
- `getNeighbors(row, col)`: devuelve celdas adyacentes

### GameManager

- `init(size, mode, seed?)`: crea Board, aplica patrón aleatorio garantizando solubilidad
- `makeMove(row, col)`: toggle + validar win
- `reset()`: reinicia mismo tablero
- `newGame()`: genera nuevo tablero
- Obtiene el tablero inicial resolviendo: `solverFactory.getSolver(size).solve(board)`

**Generación garantizada**: se parte de un Board vacío, se aplican N movimientos aleatorios (toggle). Como cada toggle es reversible, el tablero resultante siempre tiene solución.

---

## 6. Sistema de Solvers

Se usa un **factory pattern**:

| Tamaño | Solver principal |
|---|---|
| ≤ 4×4 | BFS (solución óptima) |
| 5×5 – 7×7 | A* |
| 8×8 – 10×10 | IDA* |
| Cualquiera | Álgebra lineal (eliminación gaussiana mod 2) como respaldo |

El `solverFactory` elige automáticamente según el tamaño. Todos los solvers implementan:

```ts
interface Solver {
  solve(board: Board): SolverResult;
  name: string;
}

interface SolverResult {
  solution: Move[];
  isOptimal: boolean;
  nodesExplored?: number;
  timeMs?: number;
}
```

`solubilityChecker` determina si existe solución y cuántas soluciones posibles hay.

---

## 7. Sistema de ayudas (`hint/`)

### Niveles

| Nivel | Comportamiento |
|---|---|
| 1 | Resalta una celda útil (parte de la solución) |
| 2 | Muestra la próxima jugada exacta |
| 3 | Muestra secuencia parcial (siguientes 3-5 movimientos) |
| 4 | Auto-resuelve el 50% del tablero |
| 5 | Resuelve completamente |

### Anti-abuso

Cada hint consume puntos de score y experiencia:
- Nivel 1: −5 score, −2 exp
- Nivel 2: −10 score, −5 exp
- Nivel 3: −20 score, −10 exp
- Nivel 4: −40 score, −20 exp
- Nivel 5: −80 score, −40 exp

El hint engine llama al solver correspondiente y cachea la solución para no recalcular.

---

## 8. Estado global (Zustand)

### gameStore (`zustand + persist`)

```ts
interface GameStore {
  // Estado
  board: boolean[][] | null;
  size: number;
  mode: GameMode;
  status: 'idle' | 'playing' | 'won' | 'lost';
  moves: Move[];
  moveCount: number;
  startTime: number | null;
  elapsedTime: number;
  hintsUsed: number;
  hintLevelsUsed: number[];

  // Acciones
  initGame: (size: number, mode: GameMode) => void;
  makeMove: (row: number, col: number) => void;
  reset: () => void;
  useHint: (level: HintLevel) => HintResult | null;
  tick: () => void;
  restoreSession: () => boolean;
}
```

### statisticsStore

```ts
interface StatisticsStore {
  gamesWon: number;
  gamesLost: number;
  bestTimes: Record<string, number>;       // "5x5" -> segundos
  leastMoves: Record<string, number>;       // "5x5" -> movimientos
  totalMoves: number;
  totalTimePlayed: number;
  gamesBySize: Record<string, number>;     // "5x5" -> count
  heatmap: HeatmapData;
  achievements: Achievement[];
  score: number;
  experience: number;
  level: number;
}
```

### settingsStore

```ts
interface SettingsStore {
  theme: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  vibrationEnabled: boolean;
  highContrast: boolean;
}
```

---

## 9. Persistencia local

Toda la persistencia usa **zustand persist middleware** con `localStorage`.

Claves usadas:
- `lightsout-game` → gameStore (sesión activa)
- `lightsout-stats` → statisticsStore
- `lightsout-settings` → settingsStore
- `lightsout-heatmap` → heatmapStore (separado por tamaño de datos)

Estrategia de versionado: se incluye un campo `version: number` en cada store para migraciones futuras.

---

## 10. Sistema de logros

Evaluación reactiva: cuando cambia `statisticsStore`, se dispara `achievementStore.evaluate()`.

Cada logro:
```ts
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: StatisticsStore) => boolean;
  progress: (stats: StatisticsStore) => number; // 0-100
  unlockedAt: number | null;
}
```

Logros planeados:
- `first_win` — Primer tablero resuelto
- `ten_wins` — 10 victorias
- `century` — 100 victorias
- `no_hints` — Victoria sin usar ayudas
- `perfect_game` — Sin errores (modo desafío)
- `speed_demon` — Menos de X segundos en 5×5
- `minimalist` — Solución óptima
- `explorer` — Jugar todos los modos
- `collector` — Probar todos los tamaños de grilla

---

## 11. Módulo de Analytics

- **StatisticsStore**: métricas acumuladas con persistencia
- **HeatmapStore**: registro de cada click por celda, permite generar visualización de celdas más tocadas
- **AchievementStore**: logros con evaluación automática
- Toda actualización de estadísticas ocurre en `gameManager` después de cada partida

---

## 12. Flujo de pantallas (Router)

```
/                  → Home.tsx
/game/:mode?       → Game.tsx
/statistics        → Statistics.tsx
/achievements      → Achievements.tsx
/settings          → Settings.tsx
```

El layout principal (`RootLayout`) envuelve todas las rutas y provee:
- `ThemeProvider`
- `QueryClientProvider` (TanStack Query — para puzzle diario)
- `Toaster` (Sonner)
- TopBar con navegación

---

## 13. Escalabilidad futura

- **Nuevos modos de juego**: agregar entrada en `GameMode` + caso en `GameManager`
- **Nuevos solvers**: implementar interfaz `Solver` y registrarlo en `solverFactory`
- **Nuevos temas**: agregar objeto en `themes.ts`, listo
- **Online/leaderboards**: TanStack Query + API REST sin afectar lógica core
- **i18n**: extraer strings a archivos JSON de locale
- **Testing**: core y solvers son funciones puras → test unitario directo
- **Web Worker**: solvers pesados (IDA*) pueden migrarse a worker sin cambiar API

---

## 14. Decisiones técnicas clave

| Decisión | Justificación |
|---|---|
| Zustand sobre Context | Evita re-renders globales, built-in persist middleware, selectores finos |
| Solver Factory | Desacopla algoritmos del consumo, permite elegir según tamaño |
| CSS Variables para temas | Cambio instantáneo sin recarga, fácil de extender |
| `clsx` + `tailwind-merge` | Combinación de clases condicionales sin conflictos |
| Zod para validación | Tipado fuerte en stores persistidos, migraciones seguras |
| Radix UI + slots | Accesibilidad out-of-the-box, personalización visual completa |
| Framer Motion | Animaciones declarativas, soporte `reduced-motion` |
| Zustand persist | Unifica persistencia local sin boilerplate, soporta versionado |
| Separación solver / core | El motor del juego no depende de algoritmos específicos |
| Hint cache | La solución se calcula una vez y se reutiliza entre niveles de hint |
