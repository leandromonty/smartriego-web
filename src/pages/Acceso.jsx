import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Mide qué tan segura es la contraseña (solo informativo; el mínimo real es 8).
function fuerzaPassword(pass) {
  let puntos = 0
  if (pass.length >= 8) puntos++
  if (pass.length >= 12) puntos++
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) puntos++
  if (/\d/.test(pass)) puntos++
  if (/[^A-Za-z0-9]/.test(pass)) puntos++
  if (!pass) return { nivel: 0, texto: '' }
  if (puntos <= 2) return { nivel: 1, texto: 'Débil' }
  if (puntos <= 3) return { nivel: 2, texto: 'Media' }
  return { nivel: 3, texto: 'Fuerte' }
}

const BENEFICIOS = [
  'Controlá el riego desde tu celular',
  'Consultá el historial de cada riego',
  'Recibí tu código de activación al comprar',
]

export default function Acceso({ modo }) {
  const esRegistro = modo === 'registro'
  const { login, registro } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [datos, setDatos] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [verPassword, setVerPassword] = useState(false)

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })
  const fuerza = fuerzaPassword(datos.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (esRegistro && datos.nombre.trim().length < 2) return setError('Ingresá tu nombre.')
    if (!/^\S+@\S+\.\S+$/.test(datos.email)) return setError('Ingresá un email válido.')
    if (esRegistro && datos.password.length < 8)
      return setError('La contraseña debe tener al menos 8 caracteres.')

    setCargando(true)
    try {
      if (esRegistro) await registro(datos.nombre, datos.email, datos.password)
      else await login(datos.email, datos.password)
      navigate(location.state?.desde || '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="acceso">
      <aside className="acceso-panel">
        <img className="acceso-ilustracion" src="/img/acceso-ilustracion.svg" alt="" />
        <h2>{esRegistro ? 'Creá tu cuenta' : 'Bienvenido de nuevo'}</h2>
        <p>Tu jardín, siempre al alcance de tu mano.</p>
        <ul className="acceso-beneficios">
          {BENEFICIOS.map((b) => (
            <li key={b}><span aria-hidden="true">✔</span> {b}</li>
          ))}
        </ul>
      </aside>

      <div className="acceso-lado">
        <div className="acceso-caja">
          <h1>{esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
          <p className="acceso-sub">
            {esRegistro
              ? 'Completá tus datos para empezar.'
              : 'Ingresá con tu email y contraseña.'}
          </p>

          <form className="acceso-form" onSubmit={handleSubmit} noValidate>
            {esRegistro && (
              <label>
                Nombre
                <input name="nombre" value={datos.nombre} onChange={handleChange} autoComplete="name" />
              </label>
            )}

            <label>
              Email
              <input name="email" type="email" value={datos.email} onChange={handleChange} autoComplete="email" />
            </label>

            <label>
              Contraseña
              <span className="campo-password">
                <input
                  name="password"
                  type={verPassword ? 'text' : 'password'}
                  value={datos.password}
                  onChange={handleChange}
                  autoComplete={esRegistro ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="ojo"
                  onClick={() => setVerPassword((v) => !v)}
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {verPassword ? '🙈' : '👁️'}
                </button>
              </span>
            </label>

            {esRegistro && datos.password && (
              <div className="fuerza" aria-live="polite">
                <div className={`fuerza-barra nivel-${fuerza.nivel}`}>
                  <span /><span /><span />
                </div>
                <small>Seguridad: {fuerza.texto} · mínimo 8 caracteres</small>
              </div>
            )}

            {error && <p className="error error-caja" role="alert">⚠️ {error}</p>}

            <button type="submit" className="btn" disabled={cargando}>
              {cargando ? 'Un momento...' : esRegistro ? 'Crear cuenta' : 'Ingresar'}
            </button>
          </form>

          <p className="auth-cambio">
            {esRegistro ? (
              <>
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" state={location.state}>Iniciá sesión</Link>
              </>
            ) : (
              <>
                ¿Todavía no tenés cuenta?{' '}
                <Link to="/registro" state={location.state}>Registrate</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
