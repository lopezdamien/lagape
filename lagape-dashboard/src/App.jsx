import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import { ToastContainer, useToast } from './components/ui/Toast'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Accueil from './pages/Accueil'
import CarteList from './pages/Carte/CarteList'
import CarteForm from './pages/Carte/CarteForm'
import GalerieGrid from './pages/Galerie/GalerieGrid'
import BlogList from './pages/Blog/BlogList'
import BlogForm from './pages/Blog/BlogForm'

// Force-trigger build on Vercel (Mar 27)
export default function App() {
  const toasts = useToast()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Login />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        minHeight: '100vh',
        background: 'var(--bleu-nuit)',
      }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/carte" element={<CarteList />} />
          <Route path="/carte/nouveau" element={<CarteForm />} />
          <Route path="/carte/:type/:id" element={<CarteForm />} />
          <Route path="/galerie" element={<GalerieGrid />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/nouveau" element={<BlogForm />} />
          <Route path="/blog/:id" element={<BlogForm />} />
        </Routes>
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  )
}
