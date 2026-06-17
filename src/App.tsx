import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from './components/ui'
import { ThemeProvider } from './theme/ThemeProvider'
import { Toaster } from 'sonner'
import { RootLayout } from './components/layout'
import { Home, Game, Statistics, Achievements, Settings, NotFound, Infinite, Help } from './pages'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/game/:size" element={<Game />} />
                <Route path="/daily" element={<Game />} />
                <Route path="/infinite" element={<Infinite />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/how-to-play" element={<Help />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                border: '3px solid var(--color-border)',
                borderRadius: 0,
                boxShadow: '4px 4px 0px 0px var(--color-shadow)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
              },
            }}
          />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
