import { useEffect, useMemo, useState } from 'react'
import '../Styles/Dashboard.css'
import NewReservation from './NewReservation'
import { getReservations, saveReservations, session, slotLabel, todayISO, SPACES, type Reservation, type Role } from '../data'

interface DashboardProps {
  role: Role
  email: string
}

type Filter = 'hoy' | 'todas' | 'completadas'

const Dashboard = ({ role, email }: DashboardProps) => {
  const [list, setList] = useState<Reservation[]>(getReservations)
  const [showNew, setShowNew] = useState(false)
  const [filter, setFilter] = useState<Filter>('hoy')
  const isAdmin = role === 'admin'

  useEffect(() => {
    const sync = () => setList(getReservations())
    window.addEventListener('bh:data', sync)
    return () => window.removeEventListener('bh:data', sync)
  }, [])

  const scope = useMemo(() => (isAdmin ? list : list.filter((r) => r.owner === email)), [list, isAdmin, email])
  const today = todayISO()

  const rows = scope
    .filter((r) => (filter === 'hoy' ? r.date === today && r.status === 'confirmada' : filter === 'completadas' ? r.status === 'completada' : true))
    .sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot))

  const stats = isAdmin
    ? [
        { label: 'Reservaciones hoy', value: list.filter((r) => r.date === today && r.status === 'confirmada').length },
        { label: 'Total registradas', value: list.length },
        { label: 'Usuarios activos', value: new Set(list.map((r) => r.owner)).size },
        { label: 'Espacios', value: SPACES.length },
      ]
    : [
        { label: 'Mis reservaciones', value: scope.length },
        { label: 'Hoy', value: scope.filter((r) => r.date === today && r.status === 'confirmada').length },
        { label: 'Próximas', value: scope.filter((r) => r.date >= today && r.status === 'confirmada').length },
        { label: 'Completadas', value: scope.filter((r) => r.status === 'completada').length },
      ]

  const cancel = (id: number) => saveReservations(list.filter((r) => r.id !== id))

  return (
    <>
      <div className="reserv-container">
        <nav className="reserv-navbar">
          <div className="nav-brand">
            <h2>BookingHub</h2>
          </div>
          <div className="nav-user">
            {isAdmin && <span className="admin-badge">Administrador</span>}
            <span className="nav-email">{email}</span>
            <button onClick={session.logout} className="btn-logout">Cerrar sesión</button>
          </div>
        </nav>

        <div className="reserv-content">
          <header className="reserv-header">
            <div>
              <h1>{isAdmin ? 'Panel de administración' : 'Mis reservaciones'}</h1>
              <p>{isAdmin ? 'Ocupación de espacios y reservaciones de todos los usuarios' : 'Agenda y consulta tus espacios reservados'}</p>
            </div>
            <button className="btn-new" onClick={() => setShowNew(true)}>+ Nueva reservación</button>
          </header>

          <div className="stats-grid">
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
              </div>
            ))}
          </div>

          <section className="recent-section">
            <div className="section-head">
              <h2>Reservaciones</h2>
              <div className="tabs">
                {(['hoy', 'todas', 'completadas'] as Filter[]).map((f) => (
                  <button key={f} className={filter === f ? 'tab active' : 'tab'} onClick={() => setFilter(f)}>
                    {f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {rows.length === 0 ? (
              <div className="empty-state">
                <p>Sin reservaciones en esta vista</p>
                <span>Crea una con “Nueva reservación”</span>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="res-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Horario</th>
                      <th>Espacio</th>
                      {isAdmin && <th>Usuario</th>}
                      <th>Notas</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.date}</td>
                        <td>{slotLabel(r.slot)}</td>
                        <td>{r.space}</td>
                        {isAdmin && <td>{r.owner}</td>}
                        <td className="muted">{r.description || '—'}</td>
                        <td><span className={`status ${r.status}`}>{r.status}</span></td>
                        <td>
                          {r.status === 'confirmada' && (
                            <button className="btn-link" onClick={() => cancel(r.id)}>Cancelar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
      {showNew && <NewReservation owner={email} onClose={() => setShowNew(false)} />}
    </>
  )
}

export default Dashboard
