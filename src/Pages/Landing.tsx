import '../Styles/Landing.css'

const features = [
  { tag: '01', title: 'Disponibilidad en vivo', text: 'Cupo por espacio y horario antes de confirmar.' },
  { tag: '02', title: 'Roles', text: 'Vista de colaborador y panel de administración.' },
  { tag: '03', title: 'Responsive', text: 'Funciona en escritorio y móvil.' },
]

const Landing = () => (
  <div className="home-container">
    <nav className="navbar">
      <div className="nav-brand">
        <h2>BookingHub</h2>
      </div>
      <div className="nav-links">
        <a href="#login">Iniciar sesión</a>
      </div>
    </nav>

    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Reserva espacios de trabajo
          <span className="gradient-text"> en segundos</span>
        </h1>
        <p className="hero-subtitle">Comedor, salas de juntas y áreas compartidas con control de cupo por horario.</p>
        <div className="hero-buttons">
          <a href="#login" className="btn-secondary">Entrar a la demo</a>
        </div>
      </div>
    </section>

    <section className="features">
      {features.map((f) => (
        <div className="feature-card" key={f.tag}>
          <div className="feature-icon">{f.tag}</div>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
      ))}
    </section>
  </div>
)

export default Landing
