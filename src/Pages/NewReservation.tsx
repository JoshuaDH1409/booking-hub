import { useState } from 'react'
import '../Styles/Auth.css'
import { availability, getReservations, saveReservations, todayISO, MAX_CAPACITY, SLOTS, SPACES } from '../data'

interface NewReservationProps {
  owner: string
  onClose: () => void
}

const NewReservation = ({ owner, onClose }: NewReservationProps) => {
  const [form, setForm] = useState({ space: '', date: todayISO(), slot: '', description: '' })
  const [error, setError] = useState('')
  const list = getReservations()
  const free = form.space ? availability(list, form.space, form.date) : {}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value, ...(name === 'space' || name === 'date' ? { slot: '' } : {}) })
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((free[form.slot] ?? 0) <= 0) {
      setError('No hay lugares disponibles en este horario')
      return
    }
    saveReservations([...list, { id: Date.now(), owner, status: 'confirmada', ...form }])
    onClose()
  }

  const left = form.slot ? free[form.slot] : undefined

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-card create-reserv-card">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        <div className="auth-header">
          <h1>Nueva reservación</h1>
          <p>Cupo máximo de {MAX_CAPACITY} personas por horario</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="space">Espacio</label>
            <select id="space" name="space" value={form.space} onChange={handleChange} required>
              <option value="">Seleccionar espacio</option>
              {SPACES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input type="date" id="date" name="date" value={form.date} min={todayISO()} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="slot">
              Horario
              {left !== undefined && (
                <span className={`availability-badge ${left === 0 ? 'full' : left <= 2 ? 'low' : 'available'}`}>
                  {left} lugares
                </span>
              )}
            </label>
            <select id="slot" name="slot" value={form.slot} onChange={handleChange} required disabled={!form.space}>
              <option value="">Seleccionar horario</option>
              {SLOTS.map((s) => {
                const n = free[s.value] ?? MAX_CAPACITY
                return (
                  <option key={s.value} value={s.value} disabled={n === 0}>
                    {s.label} {n === 0 ? '(lleno)' : `(${n} lugares)`}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Notas (opcional)</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>

          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Confirmar reservación</button>
        </form>
      </div>
    </div>
  )
}

export default NewReservation
