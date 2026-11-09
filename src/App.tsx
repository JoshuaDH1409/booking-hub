import { useEffect, useState } from 'react'
import Landing from './Pages/Landing'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import { session } from './data'

function App() {
  const [state, setState] = useState(session.get)
  const [modal, setModal] = useState<'login' | 'register' | null>(null)

  useEffect(() => {
    const sync = () => {
      const s = session.get()
      setState(s)
      const hash = window.location.hash.slice(1)
      setModal(!s.auth && (hash === 'login' || hash === 'register') ? hash : null)
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('storage', sync)
    window.addEventListener('bh:session', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('storage', sync)
      window.removeEventListener('bh:session', sync)
    }
  }, [])

  const close = () => {
    setModal(null)
    history.replaceState(null, '', window.location.pathname)
  }

  if (state.auth) return <Dashboard role={state.role} email={state.email} />

  return (
    <>
      <Landing />
      {modal === 'login' && <Login onClose={close} />}
      {modal === 'register' && <Register onClose={close} />}
    </>
  )
}

export default App
