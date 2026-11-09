export type Role = 'empleado' | 'admin'

export interface Reservation {
  id: number
  owner: string
  space: string
  slot: string
  date: string
  description: string
  status: 'confirmada' | 'completada'
}

export const SPACES = ['Comedor', 'Sala de juntas', 'Sala creativa']

export const SLOTS = [
  { value: '13:00-13:40', label: '13:00 – 13:40' },
  { value: '13:41-14:21', label: '13:41 – 14:21' },
  { value: '14:22-15:02', label: '14:22 – 15:02' },
  { value: '15:03-15:43', label: '15:03 – 15:43' },
  { value: '15:44-16:24', label: '15:44 – 16:24' },
  { value: '16:25-17:05', label: '16:25 – 17:05' },
]

export const MAX_CAPACITY = 5

const KEY = 'bh.reservations'

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const seed = (): Reservation[] => {
  const d = today()
  return [
    { id: 1, owner: 'ana.lopez@demo.mx', space: 'Comedor', slot: '13:00-13:40', date: d, description: 'Comida de equipo', status: 'confirmada' },
    { id: 2, owner: 'carlos.ruiz@demo.mx', space: 'Comedor', slot: '13:00-13:40', date: d, description: '', status: 'confirmada' },
    { id: 3, owner: 'demo@demo.mx', space: 'Sala de juntas', slot: '14:22-15:02', date: d, description: 'Revisión semanal', status: 'confirmada' },
    { id: 4, owner: 'maria.gomez@demo.mx', space: 'Sala creativa', slot: '15:03-15:43', date: d, description: 'Lluvia de ideas', status: 'confirmada' },
    { id: 5, owner: 'demo@demo.mx', space: 'Comedor', slot: '13:41-14:21', date: '2026-01-15', description: '', status: 'completada' },
    { id: 6, owner: 'luis.perez@demo.mx', space: 'Sala de juntas', slot: '16:25-17:05', date: d, description: 'Entrevista', status: 'confirmada' },
  ]
}

export const getReservations = (): Reservation[] => {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    const s = seed()
    localStorage.setItem(KEY, JSON.stringify(s))
    return s
  }
  try {
    return JSON.parse(raw) as Reservation[]
  } catch {
    return []
  }
}

export const saveReservations = (list: Reservation[]) => {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('bh:data'))
}

export const availability = (list: Reservation[], space: string, date: string) => {
  const out: Record<string, number> = {}
  SLOTS.forEach((s) => {
    const used = list.filter((r) => r.space === space && r.slot === s.value && r.date === date && r.status === 'confirmada').length
    out[s.value] = MAX_CAPACITY - used
  })
  return out
}

export const session = {
  get: () => ({
    auth: localStorage.getItem('bh.auth') === 'true',
    role: (localStorage.getItem('bh.role') as Role) || 'empleado',
    email: localStorage.getItem('bh.email') || 'demo@demo.mx',
  }),
  login: (email: string, role: Role) => {
    localStorage.setItem('bh.auth', 'true')
    localStorage.setItem('bh.role', role)
    localStorage.setItem('bh.email', email || 'demo@demo.mx')
    window.dispatchEvent(new Event('bh:session'))
  },
  logout: () => {
    localStorage.removeItem('bh.auth')
    localStorage.removeItem('bh.role')
    localStorage.removeItem('bh.email')
    window.location.hash = ''
    window.dispatchEvent(new Event('bh:session'))
  },
}

export const todayISO = today
export const slotLabel = (v: string) => SLOTS.find((s) => s.value === v)?.label ?? v
