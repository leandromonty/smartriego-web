import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/useAuth'
import { AVATARES, leerAvatar, guardarAvatarLocal, rutaAvatar } from '../data/avatares'

const saludo = () => {
  const h = new Date().getHours()
  if (h < 6) return 'Buenas noches'
  if (h < 13) return 'Buen día'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Cuenta() {
  const { token, usuario, logout } = useAuth()
  const navigate = useNavigate()

  const [dispositivos, setDispositivos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(null)
  const [avatar, setAvatar] = useState(() => leerAvatar(usuario))
  const [eligiendo, setEligiendo] = useState(false)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    if (!token) return
    Promise.all([api('/dispositivos', { token }), api('/pedidos', { token })])
      .then(([disp, ped]) => {
        setDispositivos(disp)
        setPedidos(ped)
      })
      .catch((err) => {
        if (err.message === 'Token inválido o vencido') {
          logout()
          navigate('/login', { state: { desde: '/cuenta' } })
          return
        }
        setError(err.message)
      })
      .finally(() => setCargando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) return <Navigate to="/login" state={{ desde: '/cuenta' }} replace />

  const copiar = async (codigo) => {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(codigo)
      setTimeout(() => setCopiado(null), 1500)
    } catch {
      // si el navegador no permite copiar, el código sigue visible para copiarlo a mano
    }
  }

  const elegirAvatar = (a) => {
    setAvatar(a.id)
    // PENDIENTE: cuando el servidor guarde el avatar, también se envía acá.
    guardarAvatarLocal(usuario, a.id)
    setAviso(`¡Listo! Ahora sos ${a.nombre}.`)
    setTimeout(() => setAviso(''), 2500)
  }

  const fecha = (iso) => new Date(iso).toLocaleDateString('es-AR')
  const totalComprado = pedidos
    .filter((p) => p.estado !== 'cancelado')
    .reduce((suma, p) => suma + p.total, 0)
  const primerNombre = usuario.nombre.split(' ')[0]

  return (
    <>
      <header className="cuenta-hero">
        <div className="cuenta-hero-inner">
          <div className="avatar-grande">
            <img src={rutaAvatar(avatar)} alt={`Avatar: ${avatar}`} />
            <button
              type="button"
              className="avatar-editar"
              onClick={() => setEligiendo((v) => !v)}
              aria-expanded={eligiendo}
              aria-label="Cambiar avatar"
            >
              ✏️
            </button>
          </div>
          <div>
            <p className="cuenta-saludo">{saludo()},</p>
            <h1>{primerNombre} 👋</h1>
            <p className="cuenta-email">{usuario.email}</p>
          </div>
        </div>
      </header>

      <section className="cuenta">
        {aviso && <p className="aviso-ok" role="status">✅ {aviso}</p>}

        {eligiendo && (
          <div className="selector-avatar">
            <div className="selector-cabecera">
              <h2>Elegí tu avatar</h2>
              <button type="button" className="link-boton" onClick={() => setEligiendo(false)}>
                Cerrar
              </button>
            </div>
            <div className="avatar-grilla" role="radiogroup" aria-label="Avatares disponibles">
              {AVATARES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={avatar === a.id}
                  className={`avatar-opcion ${avatar === a.id ? 'activo' : ''}`}
                  onClick={() => elegirAvatar(a)}
                >
                  <img src={rutaAvatar(a.id)} alt="" />
                  <span>{a.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="error error-caja">⚠️ {error}</p>}

        {cargando && (
          <div className="esqueleto" aria-busy="true" aria-label="Cargando">
            <span /><span /><span />
          </div>
        )}

        {!cargando && !error && (
          <>
            <div className="cuenta-stats">
              <div className="stat">
                <span className="stat-num">{dispositivos.length}</span>
                <span className="stat-txt">{dispositivos.length === 1 ? 'Equipo' : 'Equipos'}</span>
              </div>
              <div className="stat">
                <span className="stat-num">{pedidos.length}</span>
                <span className="stat-txt">{pedidos.length === 1 ? 'Pedido' : 'Pedidos'}</span>
              </div>
              <div className="stat">
                <span className="stat-num">${totalComprado.toLocaleString('es-AR')}</span>
                <span className="stat-txt">Total comprado</span>
              </div>
            </div>

            <h2 className="cuenta-titulo">💧 Mis equipos</h2>
            {dispositivos.length === 0 ? (
              <div className="vacio">
                <p>Todavía no tenés equipos.</p>
                <Link to="/tienda" className="btn">Ver modelos</Link>
              </div>
            ) : (
              <div className="equipos">
                {dispositivos.map((d) => (
                  <div key={d.id} className="equipo">
                    <span className="equipo-icono" aria-hidden="true">🌱</span>
                    <div className="equipo-datos">
                      <strong>{d.producto.nombre}</strong>
                      <small>Código de activación</small>
                    </div>
                    <code className="equipo-codigo">{d.codigo_activacion}</code>
                    <button
                      type="button"
                      className="btn-copiar"
                      onClick={() => copiar(d.codigo_activacion)}
                    >
                      {copiado === d.codigo_activacion ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h2 className="cuenta-titulo">🧾 Mis pedidos</h2>
            {pedidos.length === 0 ? (
              <div className="vacio">
                <p>Todavía no hiciste ningún pedido.</p>
                <Link to="/tienda" className="btn">Ir a la tienda</Link>
              </div>
            ) : (
              <div className="pedidos-lista">
                {pedidos.map((p) => (
                  <div key={p.id} className="pedido-card">
                    <div className="pedido-cabecera">
                      <div>
                        <strong>Pedido #{p.id}</strong>
                        <p className="pedido-fecha">{fecha(p.creado_en)}</p>
                      </div>
                      <span className={`estado estado-${p.estado}`}>{p.estado}</span>
                    </div>
                    <ul className="pedido-items">
                      {p.items.map((item) => (
                        <li key={item.producto.id}>
                          {item.producto.nombre} <span>× {item.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="pedido-total">
                      Total <strong>${p.total.toLocaleString('es-AR')}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
