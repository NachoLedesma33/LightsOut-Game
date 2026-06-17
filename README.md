# Lights Out Game

Un juego de lógica donde el objetivo es apagar todas las luces del tablero. Cada presión alterna el estado de la celda y sus vecinos ortogonales.

## Características

- **Modos de juego:** Clásico (3×3 a 10×10 con dificultades), Diario (un puzzle por día), Infinito (generación procedural sin límite).
- **Sistema de pistas:** Mapa de calor, siguiente movimiento, solución parcial y solución completa.
- **6 temas visuales:** Classic Neubrutal, Cyber Brutal, Terminal, Retro Arcade, Pastel Brutal, Dark Brutal.
- **Estadísticas detalladas:** Partidas jugadas, ganadas, mejor tiempo, rachas, promedios.
- **30 logros:** En categorías de progresión, racha, habilidad, tamaños, dificultades, pistas, diario e infinito.
- **Solver algebraico:** Resolución mediante eliminación Gaussiana sobre GF(2) — selección automática del algoritmo según el tamaño (BFS, A* o álgebra lineal).
- **Accesibilidad:** Soporte de `prefers-reduced-motion`, modo de alto contraste, etiquetas ARIA, navegación por teclado.
- **PWA:** Instalable, funciona offline, iconos y manifest.
- **Persistencia:** Estado guardado en localStorage (tema, settings, progreso).

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 |
| Lenguaje | TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Estado | Zustand |
| UI primitives | Radix UI |
| Ruteo | React Router v6 |
| Solver | BFS / A* / Álgebra lineal GF(2) |

## Cómo jugar

1. Seleccioná un modo en la pantalla principal.
2. Elegí tamaño y dificultad (en modo Clásico).
3. Presioná las celdas para apagar todas las luces.
4. Cada movimiento alterna la celda tocada y sus 4 vecinos.
5. Usá pistas si te trabás — la primera es gratis.
6. Completá partidas para sumar estadísticas y desbloquear logros.

Visita [/how-to-play](/how-to-play) para un tutorial interactivo y explicación matemática.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # compila a dist/
npm run preview # previsualiza el build
```

Inspirado en el clásico Lights Out de Tiger Electronics (1995).
