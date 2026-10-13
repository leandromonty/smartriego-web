import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { api } from '../api'
import { rutaAvatar } from '../data/avatares'
import '../admin.css'

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']

// Desde qué estado se puede pasar a cuál (el servidor valida lo mismo)
const SIGUIENTES = {
  pendiente: ['pagado'],
  pagado: ['enviado', 'entregado'],
  enviado: ['entregado'],
  entregado: [],
  cancelado: [],
}

const PESTANIAS = [
  { id: 'resumen', texto: '📊 Resumen' },
  { id: 'pedidos', texto: '📦 Pedidos' },
  { id: 'equipos', texto: '🌱 Equipos' },
  { id: 'usuarios', texto: '👥 Usuarios' },
  { id: 'productos', texto: '🏷️ Productos' },
]

const plata = (n) => `$${Number(n).toLocaleString('es-AR')}`
// Las fechas llegan sin zona horaria: se muestran tal cual, sin convertirlas
const fecha = (s) => (s ? s.replace('T', ' ').slice(0, 16) : '—')

export default function Admin() {
  const { token, usuario } = useAuth()
  const [pestania, setPestania] = useState('resumen')

  if (!usuario) return <Navigate to="/login" replace state={{ desde: '/admin' }} />
  if (usuario.rol !== 'admin') return <Navigate to="/" replace />

  return (
    <>
      <section className="admin-hero">
        <div className="admin-hero-inner">
          <p>Panel de administración</p>
          <h1>Hola, {usuario.nombre} 👋</h1>
        </div>
      </section>

      <div className="admin-contenedor">
        <div className="admin-tabs" role="tablist">
          {PESTANIAS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={pestania === p.id}
              className={pestania === p.id ? 'activa' : ''}
              onClick={() => setPestania(p.id)}
            >
              {p.texto}
            </button>
          ))}
        </div>

        {pestania === 'resumen' && <Resumen token={token} />}
        {pestania === 'pedidos' && <Pedidos token={token} />}
        {pestania === 'equipos' && <Equipos token={token} />}
        {pestania === 'usuarios' && <Usuarios token={token} />}
        {pestania === 'productos' && <Productos token={token} />}
      </div>
    </>
  )
}

/* Carga una lista del servidor y maneja "cargando" y errores */
function useCarga(ruta, token) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setError('')
    try {
      setDatos(await api(ruta, { token }))
    } catch (e) {
      setError(e.message)
    }
  }, [ruta, token])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { datos, setDatos, error, recargar }
}

function Estado({ cargando, error, reintentar }) {
  if (error) {
    return (
      <div className="admin-aviso error" role="alert">
        {error} <button onClick={reintentar}>Reintentar</button>
      </div>
    )
  }
  return cargando ? <p className="admin-cargando">Cargando…</p> : null
}

/* ---------- RESUMEN ---------- */
function Resumen({ token }) {
  const { datos, error, recargar } = useCarga('/admin/resumen', token)
  if (!datos) return <Estado cargando={!error} error={error} reintentar={recargar} />

  const tarjetas = [
    { icono: '💰', valor: plata(datos.ingresos), texto: 'Ingresos (pagados)' },
    { icono: '📦', valor: datos.pedidos, texto: 'Pedidos' },
    { icono: '👥', valor: datos.clientes, texto: 'Clientes' },
    { icono: '🌱', valor: datos.equipos, texto: 'Equipos' },
    { icono: '✅', valor: datos.equipos_activados, texto: 'Equipos activados' },
    { icono: '📡', valor: datos.equipos_conectados, texto: 'Conectados ahora' },
  ]
  const maximo = Math.max(1, ...Object.values(datos.pedidos_por_estado))

  return (
    <>
      <div className="admin-stats">
        {tarjetas.map((t) => (
          <div className="admin-stat" key={t.texto}>
            <span className="admin-stat-icono" aria-hidden="true">{t.icono}</span>
            <strong>{t.valor}</strong>
            <span>{t.texto}</span>
          </div>
        ))}
      </div>

      <h2 className="admin-titulo">Pedidos por estado</h2>
      <div className="admin-card">
        {ESTADOS.map((e) => {
          const n = datos.pedidos_por_estado[e] ?? 0
          return (
            <div className="admin-barra" key={e}>
              <span className={`estado estado-${e}`}>{e}</span>
              <div className="admin-barra-pista">
                <div className={`admin-barra-relleno estado-${e}`} style={{ width: `${(n / maximo) * 100}%` }} />
              </div>
              <b>{n}</b>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ---------- PEDIDOS ---------- */
function Pedidos({ token }) {
  const [filtro, setFiltro] = useState('todos')
  const ruta = filtro === 'todos' ? '/admin/pedidos' : `/admin/pedidos?estado=${filtro}`
  const { datos, setDatos, error, recargar } = useCarga(ruta, token)
  const [aviso, setAviso] = useState(null)
  const [ocupado, setOcupado] = useState(null)

  async function cambiarEstado(pedido, estado) {
    const textoConfirmar =
      estado === 'cancelado'
        ? `¿Cancelar el pedido #${pedido.id}? Se eliminan los equipos que todavía no fueron activados.`
        : `¿Pasar el pedido #${pedido.id} a "${estado}"?`
    if (!window.confirm(textoConfirmar)) return
    setOcupado(pedido.id)
    setAviso(null)
    try {
      const nuevo = await api(`/admin/pedidos/${pedido.id}`, { metodo: 'PATCH', cuerpo: { estado }, token })
      setDatos((lista) => lista.map((p) => (p.id === nuevo.id ? nuevo : p)))
      setAviso({ tipo: 'ok', texto: `Pedido #${pedido.id} actualizado a "${estado}".` })
      if (filtro !== 'todos') recargar()
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message })
    } finally {
      setOcupado(null)
    }
  }

  async function eliminar(pedido) {
    if (!window.confirm(`¿Eliminar definitivamente el pedido #${pedido.id}? No se puede deshacer.`)) return
    setOcupado(pedido.id)
    setAviso(null)
    try {
      await api(`/admin/pedidos/${pedido.id}`, { metodo: 'DELETE', token })
      setDatos((lista) => lista.filter((p) => p.id !== pedido.id))
      setAviso({ tipo: 'ok', texto: `Pedido #${pedido.id} eliminado.` })
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message })
    } finally {
      setOcupado(null)
    }
  }

  return (
    <>
      <div className="admin-filtros" role="group" aria-label="Filtrar por estado">
        {['todos', ...ESTADOS].map((e) => (
          <button key={e} className={filtro === e ? 'activo' : ''} onClick={() => setFiltro(e)}>
            {e}
          </button>
        ))}
      </div>

      {aviso && (
        <div className={`admin-aviso ${aviso.tipo}`} role="status">{aviso.texto}</div>
      )}
      {!datos && <Estado cargando={!error} error={error} reintentar={recargar} />}
      {datos && datos.length === 0 && <p className="admin-vacio">No hay pedidos {filtro !== 'todos' && `en estado "${filtro}"`}.</p>}

      <div className="admin-lista">
        {datos?.map((p) => (
          <article className="admin-card admin-pedido" key={p.id}>
            <header>
              <div>
                <h3>Pedido #{p.id}</h3>
                <small>{fecha(p.creado_en)}</small>
              </div>
              <span className={`estado estado-${p.estado}`}>{p.estado}</span>
            </header>

            <p className="admin-cliente">
              <b>{p.usuario_nombre}</b> · {p.usuario_email}
            </p>

            <ul className="admin-items">
              {p.items.map((i, k) => (
                <li key={k}>
                  {i.cantidad} × {i.producto.nombre} <span>{plata(i.precio_unitario)}</span>
                </li>
              ))}
            </ul>

            <footer>
              <div>
                <strong className="admin-total">{plata(p.total)}</strong>
                <small>Equipos: {p.equipos_activados}/{p.equipos} activados</small>
              </div>
              <div className="admin-acciones">
                {SIGUIENTES[p.estado].map((e) => (
                  <button key={e} className="admin-btn" disabled={ocupado === p.id} onClick={() => cambiarEstado(p, e)}>
                    Pasar a {e}
                  </button>
                ))}
                {!['cancelado', 'entregado'].includes(p.estado) && (
                  <button className="admin-btn peligro-suave" disabled={ocupado === p.id} onClick={() => cambiarEstado(p, 'cancelado')}>
                    Cancelar
                  </button>
                )}
                {p.estado === 'cancelado' && p.equipos === 0 && (
                  <button className="admin-btn peligro" disabled={ocupado === p.id} onClick={() => eliminar(p)}>
                    Eliminar
                  </button>
                )}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </>
  )
}

/* ---------- EQUIPOS ---------- */
function Equipos({ token }) {
  const { datos, error, recargar } = useCarga('/admin/dispositivos', token)
  if (!datos) return <Estado cargando={!error} error={error} reintentar={recargar} />

  return (
    <>
      <div className="admin-barra-acciones">
        <span>{datos.length} equipo(s)</span>
        <button className="admin-btn" onClick={recargar}>↻ Actualizar</button>
      </div>
      {datos.length === 0 && <p className="admin-vacio">Todavía no hay equipos.</p>}
      <div className="admin-grilla">
        {datos.map((d) => (
          <article className="admin-card admin-equipo" key={d.id}>
            <header>
              <h3>{d.nombre}</h3>
              <span className={`admin-conexion ${d.conectado ? 'on' : 'off'}`}>
                {d.conectado ? '● Conectado' : '○ Sin conexión'}
              </span>
            </header>
            <p className="admin-cliente"><b>{d.usuario_nombre}</b> · {d.usuario_email}</p>
            <dl>
              <dt>Modelo</dt><dd>{d.producto_nombre}</dd>
              <dt>Código</dt><dd><code>{d.codigo_activacion}</code></dd>
              <dt>Activado</dt><dd>{d.activado_en ? fecha(d.activado_en) : 'Todavía no'}</dd>
              <dt>Última lectura</dt><dd>{fecha(d.ultima_lectura_en)}</dd>
              <dt>Humedad</dt><dd>{d.humedad == null ? '—' : `${d.humedad}%`}</dd>
              <dt>Depósito</dt>
              <dd>{d.deposito_bajo == null ? '—' : d.deposito_bajo ? '⚠️ Bajo' : 'OK'}</dd>
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}

/* ---------- USUARIOS ---------- */
function Usuarios({ token }) {
  const { datos, error, recargar } = useCarga('/admin/usuarios', token)
  if (!datos) return <Estado cargando={!error} error={error} reintentar={recargar} />

  return (
    <div className="admin-card admin-tabla-caja">
      <table className="admin-tabla">
        <thead>
          <tr><th>Usuario</th><th>Rol</th><th>Pedidos</th><th>Equipos</th><th>Alta</th></tr>
        </thead>
        <tbody>
          {datos.map((u) => (
            <tr key={u.id}>
              <td data-etiqueta="Usuario">
                <div className="admin-usuario">
                  <img src={rutaAvatar(u.avatar)} alt="" width="36" height="36" />
                  <div><b>{u.nombre}</b><small>{u.email}</small></div>
                </div>
              </td>
              <td data-etiqueta="Rol"><span className={`admin-rol ${u.rol}`}>{u.rol}</span></td>
              <td data-etiqueta="Pedidos">{u.pedidos}</td>
              <td data-etiqueta="Equipos">{u.equipos}</td>
              <td data-etiqueta="Alta">{fecha(u.creado_en).slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- PRODUCTOS ---------- */
function Productos({ token }) {
  const { datos, setDatos, error, recargar } = useCarga('/admin/productos', token)
  if (!datos) return <Estado cargando={!error} error={error} reintentar={recargar} />

  const reemplazar = (nuevo) => setDatos((l) => l.map((p) => (p.id === nuevo.id ? nuevo : p)))

  return (
    <div className="admin-grilla">
      {datos.map((p) => (
        <FilaProducto key={p.id} producto={p} token={token} alGuardar={reemplazar} />
      ))}
    </div>
  )
}

function FilaProducto({ producto, token, alGuardar }) {
  const [precio, setPrecio] = useState(String(producto.precio))
  const [descripcion, setDescripcion] = useState(producto.descripcion || '')
  const [activo, setActivo] = useState(producto.activo)
  const [aviso, setAviso] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const precioNum = Number(precio)
  const precioValido = precio !== '' && Number.isFinite(precioNum) && precioNum > 0
  const cambio =
    precioNum !== Number(producto.precio) ||
    descripcion !== (producto.descripcion || '') ||
    activo !== producto.activo

  async function guardar(e) {
    e.preventDefault()
    if (!precioValido) return setAviso({ tipo: 'error', texto: 'El precio tiene que ser mayor a 0.' })
    setGuardando(true)
    setAviso(null)
    try {
      const nuevo = await api(`/admin/productos/${producto.id}`, {
        metodo: 'PATCH',
        cuerpo: { precio: precioNum, descripcion, activo },
        token,
      })
      alGuardar(nuevo)
      setAviso({ tipo: 'ok', texto: 'Guardado ✔' })
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="admin-card admin-producto" onSubmit={guardar}>
      <header>
        <h3>{producto.nombre}</h3>
        <small>Código: {producto.codigo}</small>
      </header>

      <label>
        Precio (ARS)
        <input type="number" min="1" step="1" inputMode="numeric" value={precio} onChange={(e) => setPrecio(e.target.value)} />
      </label>

      <label>
        Descripción
        <textarea rows="2" maxLength="255" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </label>

      <label className="admin-check">
        <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
        Visible en la tienda
      </label>

      {aviso && <div className={`admin-aviso ${aviso.tipo}`} role="status">{aviso.texto}</div>}

      <button className="admin-btn principal" disabled={!cambio || guardando}>
        {guardando ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}
