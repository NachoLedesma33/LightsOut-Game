import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { PageTransition } from '../components/layout'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center gap-6 pt-16">
        <h1 className="text-8xl font-black text-[var(--color-primary)] m-0">404</h1>
        <p className="text-lg text-[var(--color-text-muted)]">Página no encontrada</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Volver al inicio
        </Button>
      </div>
    </PageTransition>
  )
}
