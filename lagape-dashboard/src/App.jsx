import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import { ToastContainer, useToast } from './components/ui/Toast'
import { useAuth } from './contexts/AuthContext'
import { useIsMobile } from './hooks/useIsMobile'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Accueil from './pages/Accueil'
import CarteList from './pages/Carte/CarteList'
import CarteForm from './pages/Carte/CarteForm'
import GalerieGrid from './pages/Galerie/GalerieGrid'
import BlogList from './pages/Blog/BlogList'
import BlogForm from './pages/Blog/BlogForm'
import Statistiques from './pages/Statistiques'

export default function App() {
  const toasts = useToast()
  const { isAuthenticated } = useAuth()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated) return <Login />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main style={{
        marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
        flex: 1,
        minHeight: '100vh',
        background: 'var(--bleu-nuit)',
        minWidth: 0,
      }}>
        <Routes>
          <Route path="/" element={<Dashboard isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/accueil" element={<Accueil isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/carte" element={<CarteList isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/carte/nouveau" element={<CarteForm isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/carte/:type/:id" element={<CarteForm isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/galerie" element={<GalerieGrid isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/blog" element={<BlogList isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/blog/nouveau" element={<BlogForm isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/blog/:id" element={<BlogForm isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/statistiques" element={<Statistiques isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />} />
        </Routes>
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  )
}
