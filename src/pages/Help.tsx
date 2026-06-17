import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, Grid3x3, Infinity as InfinityIcon, Zap, Award, Brain, ChevronRight } from 'lucide-react'
import { PageTransition } from '../components/layout'
import { cn } from '../lib/utils'
import { Board } from '../core/board'
import { Button } from '../components/ui'

type TutorialStep = {
  highlight: { row: number; col: number } | null
  description: string
}

const TUTORIAL: TutorialStep[] = [
  {
    highlight: { row: 0, col: 0 },
    description:
      'Esta es una configuración inicial. Presiona la celda resaltada en la esquina para ver cómo funciona el juego.',
  },
  {
    highlight: { row: 0, col: 2 },
    description:
      '¡Bien! Cada vez que presionas una celda, se apagan o encienden ella y sus vecinos ortogonales (arriba, abajo, izquierda, derecha). Ahora presiona la siguiente celda resaltada.',
  },
  {
    highlight: { row: 1, col: 1 },
    description:
      '¡Perfecto! Solo queda un paso. Presiona la celda del centro para apagar las últimas luces.',
  },
  {
    highlight: null,
    description:
      '¡Felicidades! Has resuelto el tablero. Cada movimiento alterna el estado de la celda presionada y sus 4 vecinos. El objetivo es apagar todas las luces.',
  },
]

const STARTING_GRID: boolean[][] = [
  [true, true, true],
  [false, true, false],
  [false, true, false],
]

function TutorialBoard() {
  const boardRef = useRef(new Board(3, STARTING_GRID))
  const [step, setStep] = useState(0)
  const [grid, setGrid] = useState(() => boardRef.current.toArray())
  const done = step >= TUTORIAL.length - 1 && !TUTORIAL[step]?.highlight

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (done) return
      const currentStep = TUTORIAL[step]
      if (!currentStep?.highlight) return
      if (row !== currentStep.highlight.row || col !== currentStep.highlight.col) return

      boardRef.current.toggle(row, col)
      setGrid(boardRef.current.toArray())
      setStep((s) => Math.min(s + 1, TUTORIAL.length - 1))
    },
    [step, done],
  )

  const resetTutorial = useCallback(() => {
    boardRef.current = new Board(3, STARTING_GRID)
    setGrid(boardRef.current.toArray())
    setStep(0)
  }, [])

  const currentStep = TUTORIAL[Math.min(step, TUTORIAL.length - 1)]
  const highlight = currentStep?.highlight
  const cellSize = 56

  return (
    <div className="flex flex-col items-center gap-6 p-5 sm:p-6 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]">
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3px',
          width: `${cellSize * 3 + 3 * 2}px`,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const r = Math.floor(i / 3)
          const c = i % 3
          const isOn = grid[r]?.[c] ?? false
          const isHighlighted = highlight !== null && highlight.row === r && highlight.col === c
          const canClick = isHighlighted && !done

          return (
            <button
              key={i}
              onClick={() => handleClick(r, c)}
              disabled={!canClick}
              aria-label={`Fila ${r + 1}, columna ${c + 1}${isOn ? ', encendida' : ', apagada'}`}
              className={cn(
                'aspect-square cursor-pointer border-[var(--border-width)] border-[var(--color-border)] disabled:cursor-not-allowed relative',
                'transition-transform duration-100',
                canClick && 'hover:scale-95 active:scale-90',
                isHighlighted && !done && 'ring-2 ring-[var(--color-accent)]',
              )}
              style={{ width: `${cellSize}px` }}
            >
              <div
                className="w-full h-full transition-colors duration-150 relative"
                style={{
                  backgroundColor: isOn ? 'var(--color-primary)' : 'var(--color-surface)',
                  boxShadow: isOn
                    ? 'var(--shadow-offset, 4px 4px) 0px 0px var(--color-shadow)'
                    : 'none',
                }}
              />
              {isHighlighted && !done && (
                <motion.div
                  className="absolute inset-0 border-2 border-[var(--color-accent)]"
                  initial={false}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </button>
          )
        })}
      </div>

      <p className="text-sm text-center w-full text-[var(--color-text)]">
        {currentStep?.description}
      </p>

      <div className="flex gap-3 items-center text-xs font-bold text-[var(--color-text-muted)]">
        <span>
          Paso {Math.min(step + 1, TUTORIAL.length - 1)}/{TUTORIAL.length - 1}
        </span>
        {step > 0 && (
          <Button variant="ghost" size="sm" onClick={resetTutorial}>
            Reintentar
          </Button>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-xl font-black">
        <Icon size={22} className="text-[var(--color-primary)]" />
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Help() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-10 pt-6 sm:pt-10 pb-12">
        <div className="flex flex-col gap-2">
          <BookOpen size={48} className="text-[var(--color-primary)]" />
          <h1 className="text-3xl font-black text-[var(--color-text)] m-0">Cómo jugar</h1>
        </div>

        <Section title="¿Qué es Lights Out?" icon={Lightbulb}>
          <p className="text-sm leading-relaxed text-[var(--color-text)]">
            <strong>Lights Out</strong> es un juego de lógica donde el objetivo es apagar todas las
            luces de un tablero. Cada vez que presionas una celda, se alterna su estado y el de sus
            vecinos ortogonales (arriba, abajo, izquierda y derecha). El desafío está en encontrar la
            secuencia de movimientos que lleva a todo el tablero a cero.
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            Originalmente lanzado como un juego electrónico portátil por Tiger Electronics en 1995,
            Lights Out se ha convertido en un clásico de los puzles matemáticos, con aplicaciones en
            álgebra lineal y teoría de grafos.
          </p>
        </Section>

        <Section title="Modos de juego" icon={Grid3x3}>
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
              <h3 className="font-black text-sm flex items-center gap-2">
                <Zap size={16} className="text-[var(--color-primary)]" /> Clásico
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Elige el tamaño del tablero (de 3×3 a 10×10) y la dificultad. Cada partida tiene una
                solución garantizada. Ideal para aprender y practicar.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
              <h3 className="font-black text-sm flex items-center gap-2">
                <InfinityIcon size={16} className="text-[var(--color-primary)]" /> Infinito
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Tableros generados proceduralmente sin límite. Cada vez que resuelves uno, avanzas al
                siguiente con mayor dificultad. Perfecto para sesiones largas.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
              <h3 className="font-black text-sm flex items-center gap-2">
                <Award size={16} className="text-[var(--color-primary)]" /> Diario
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Un mismo tablero para todos los jugadores cada día. Compite por la mejor cantidad de
                movimientos y tiempo. Vuelve cada día para un nuevo desafío.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Reglas básicas" icon={ChevronRight}>
          <ol className="flex flex-col gap-3 list-decimal list-inside text-sm leading-relaxed text-[var(--color-text)]">
            <li>
              El tablero comienza con algunas luces encendidas (amarillas) y otras apagadas (oscuras).
            </li>
            <li>
              Presiona cualquier celda para alternar su estado y el de sus vecinos ortogonales
              (arriba, abajo, izquierda, derecha).
            </li>
            <li>
              El objetivo es dejar todas las luces apagadas en la menor cantidad de movimientos
              posible.
            </li>
            <li>
              Puedes usar <strong>pistas</strong> si te quedas atascado: desde un mapa de calor que
              muestra las mejores jugadas hasta la solución completa.
            </li>
            <li>
              Las partidas completadas suman puntos y contribuyen a tus estadísticas, rachas y
              logros.
            </li>
          </ol>
        </Section>

        <Section title="Tutorial interactivo" icon={Zap}>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            Sigue los pasos guiados para entender la mecánica del juego en un tablero 3×3.
          </p>
          <TutorialBoard />
        </Section>

        <Section title="Resolución matemática" icon={Brain}>
          <div className="flex flex-col gap-4 text-sm leading-relaxed">
            <p className="text-[var(--color-text)]">
              Lights Out no es solo un juego: es un sistema de ecuaciones lineales sobre el cuerpo de
              Galois de 2 elementos, GF(2). Esto significa que cada celda solo tiene dos estados (0 =
              apagada, 1 = encendida) y la suma es exclusiva (XOR: 1+1=0).
            </p>

            <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
              <h3 className="font-black text-xs mb-2">Sistema de ecuaciones</h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Para un tablero de n×n, cada celda es una variable xᵢⱼ ∈ {'{0, 1}'} que indica si debes
                presionarla o no. La configuración inicial es el vector b, y la matriz M representa
                cómo cada presión afecta al tablero. El sistema es:
              </p>
              <div className="mt-2 font-mono text-xs text-center py-2 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)]">
                M · x = b (mod 2)
              </div>
            </div>

            <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
              <h3 className="font-black text-xs mb-2">Eliminación Gaussiana en GF(2)</h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Se construye la matriz de adyacencia M donde cada fila representa una celda y cada
                columna representa el efecto de presionar esa celda. Luego se aplica eliminación
                Gaussiana (similar a Gauss-Jordan, pero usando XOR en lugar de divisiones) para
                resolver el sistema y encontrar las celdas a presionar.
              </p>
            </div>

            <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
              <h3 className="font-black text-xs mb-2">Propiedades algebraicas</h3>
              <ul className="flex flex-col gap-1.5 text-xs text-[var(--color-text-muted)] list-disc list-inside">
                <li>
                  <strong className="text-[var(--color-text)]">Conmutatividad:</strong> El orden de
                  los movimientos no importa. Presionar las mismas celdas en cualquier orden produce
                  el mismo resultado.
                </li>
                <li>
                  <strong className="text-[var(--color-text)]">Involución:</strong> Presionar la
                  misma celda dos veces la deja igual que al inicio (1+1=0 en GF(2)).
                </li>
                <li>
                  <strong className="text-[var(--color-text)]">Rango completo:</strong> Para
                  tableros de 5×5, la matriz tiene rango completo, lo que significa que{' '}
                  <em>todas</em> las configuraciones son solubles y tienen solución única.
                </li>
                <li>
                  <strong className="text-[var(--color-text)]">Múltiples soluciones:</strong> Para
                  algunos tamaños (como 3×3 y 7×7), existen configuraciones con más de una
                  solución. El solver elige la de menos movimientos.
                </li>
                <li>
                  <strong className="text-[var(--color-text)]">No solubles:</strong> En ciertos
                  tamaños, hay configuraciones que no tienen solución (no están en el espacio
                  columna de M).
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--color-bg)] border-[var(--border-width)] border-[var(--color-border)]">
              <h3 className="font-black text-xs mb-2">Algoritmos del solver</h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                El juego elige automáticamente el mejor algoritmo según el tamaño del tablero:
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 text-xs text-[var(--color-text-muted)] list-disc list-inside">
                <li>
                  <strong className="text-[var(--color-text)]">BFS (3×3):</strong> Búsqueda en
                  anchura, garantiza la solución óptima para el espacio de 512 estados.
                </li>
                <li>
                  <strong className="text-[var(--color-text)]">A* (4×4):</strong> Búsqueda
                heurística con garantía de optimalidad.
                </li>
                <li>
                  <strong className="text-[var(--color-text)]">Álgebra lineal (5×5+):</strong>{' '}
                  Eliminación Gaussiana en GF(2). Extremadamente rápido para tableros grandes (hasta
                  10×10 = 100 variables).
                </li>
              </ul>
            </div>

            <p className="text-xs text-[var(--color-text-muted)]">
              El solver algebraico es el que usan la mayoría de las implementaciones modernas de
              Lights Out. Su eficiencia viene de reducir el problema a operaciones matriciales sobre
              GF(2), que se implementan con XOR a nivel de bits.
            </p>
          </div>
        </Section>

        <Section title="Logros y estadísticas" icon={Award}>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            El juego registra todas tus partidas y desbloquea logros a medida que progresas. Puedes
            consultar tus estadísticas detalladas (partidas ganadas, mejores tiempos, rachas, etc.)
            y tus logros en sus respectivas secciones. Cada logro tiene un requisito específico,
            desde ganar tu primera partida hasta resolver tableros de todos los tamaños.
          </p>
        </Section>
      </div>
    </PageTransition>
  )
}
