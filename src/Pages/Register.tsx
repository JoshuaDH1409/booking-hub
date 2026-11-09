import { useState } from 'react'
import '../Styles/Auth.css'
import { session } from '../data'

interface RegisterProps {
  onClose: () => void
}

const Register = ({ onClose }: RegisterProps) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    session.login(form.email, 'empleado')
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-card">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        <div className="auth-header">
          <h1>Crear cuenta</h1>
          <p>Acceso como colaborador</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Nombre Apellido" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="nombre@empresa.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Registrarse</button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <a href="#login">Inicia sesión</a></p>
        </div>
      </div>
    </div>
  )
}

export default Register
