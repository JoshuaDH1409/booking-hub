import { useState } from 'react'
import '../Styles/Auth.css'
import { session, type Role } from '../data'

interface LoginProps {
  onClose: () => void
}

const Login = ({ onClose }: LoginProps) => {
  const [email, setEmail] = useState('demo@demo.mx')
  const [password, setPassword] = useState('demo1234')
  const [role, setRole] = useState<Role>('empleado')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    session.login(email, role)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-card">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        <div className="auth-header">
          <h1>Iniciar sesión</h1>
          <p>Demo: cualquier correo y contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="role">Perfil</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="empleado">Colaborador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary">Entrar</button>
        </form>

        <div className="auth-footer">
          <p>¿Sin cuenta? <a href="#register">Regístrate</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login
