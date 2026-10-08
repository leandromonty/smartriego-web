import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Acceso({ modo }) {
  const esRegistro = modo === 'registro'
  const { login, registro } = useAuth()
  const navigate = useNavigate()

  const [datos, setDatos] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

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
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="auth">
      <h2>{esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>

      <form className="contacto-form" onSubmit={handleSubmit} noValidate>
        {esRegistro && (
          <label>
            Nombre
            <input name="nombre" value={datos.nombre} onChange={handleChange} />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" value={datos.email} onChange={handleChange} />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={datos.password} onChange={handleChange} />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn" disabled={cargando}>
          {cargando ? 'Un momento...' : esRegistro ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>

      <p className="auth-cambio">
        {esRegistro ? (
          <>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></>
        ) : (
          <>¿Todavía no tenés cuenta? <Link to="/registro">Registrate</Link></>
        )}
      </p>
    </section>
  )
}