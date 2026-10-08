import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/useAuth'

export default function Cuenta() {
  const { token, usuario, logout } = useAuth()
  const navigate = useNavigate()

  const [dispositivos, setDispositivos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(null)

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

  const fecha = (iso) => new Date(iso).toLocaleDateString('es-AR')

  return (
    <section className="cuenta">
      <h2>Mi cuenta</h2>
      <p>
        <strong>{usuario.nombre}</strong> · {usuario.email}
      </p>

      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}

      {!cargando && !error && (
        <>
          <h3>Mis equipos</h3>
          {dispositivos.length === 0 ? (
            <p>
              Todavía no tenés equipos. <Link to="/tienda">Ver modelos</Link>
            </p>
          ) : (
            <div className="codigos">
              {dispositivos.map((d) => (
                <div key={d.id} className="codigo-card">
                  <span>{d.producto.nombre}</span>
                  <code>{d.codigo_activacion}</code>
                  <button className="btn-copiar" onClick={() => copiar(d.codigo_activacion)}>
                    {copiado === d.codigo_activacion ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <h3>Mis pedidos</h3>
          {pedidos.length === 0 ? (
            <p>Todavía no hiciste ningún pedido.</p>
          ) : (
            <div className="pedidos-lista">
              {pedidos.map((p) => (
                <div key={p.id} className="pedido-card">
                  <div className="pedido-cabecera">
                    <strong>Pedido #{p.id}</strong>
                    <span className={`estado estado-${p.estado}`}>{p.estado}</span>
                  </div>
                  <p className="pedido-fecha">{fecha(p.creado_en)}</p>
                  {p.items.map((item) => (
                    <p key={item.producto.id}>
                      {item.producto.nombre} × {item.cantidad}
                    </p>
                  ))}
                  <p className="pedido-total">Total: ${p.total.toLocaleString('es-AR')}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}