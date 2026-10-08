import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/useAuth'
import { useCarrito } from '../context/useCarrito'

export default function Checkout() {
  const { token, usuario, logout } = useAuth()
  const { carrito, total, vaciar } = useCarrito()
  const navigate = useNavigate()

  const [pedidoId, setPedidoId] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Sin sesión: va al login y vuelve acá después
  if (!token) return <Navigate to="/login" state={{ desde: '/checkout' }} replace />

  const confirmar = async () => {
    setError('')
    setCargando(true)
    try {
      let id = pedidoId
      // Si el pago falló antes, se reutiliza el pedido ya creado (no se duplica)
      if (!id) {
        const pedido = await api('/pedidos', {
          metodo: 'POST',
          token,
          cuerpo: {
            items: carrito.map((item) => ({ codigo: item.id, cantidad: item.cantidad })),
          },
        })
        id = pedido.id
        setPedidoId(id)
      }
      // PLACEHOLDER: acá iría la pasarela de pago real (Mercado Pago)
      const pago = await api(`/pedidos/${id}/pagar`, { metodo: 'POST', token })
      setResultado(pago)
      vaciar()
    } catch (err) {
      if (err.message === 'Token inválido o vencido') {
        logout()
        navigate('/login', { state: { desde: '/checkout' } })
        return
      }
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  // Pantalla de confirmación
  if (resultado) {
    return (
      <section className="checkout">
        <h2>✅ ¡Compra confirmada!</h2>
        <p>
          Pedido <strong>#{resultado.pedido.id}</strong> · Total{' '}
          <strong>${resultado.pedido.total.toLocaleString('es-AR')}</strong>
        </p>

        <h3>Tus equipos</h3>
        <p>
          Guardá estos códigos. Para ver tus equipos en la app, iniciá sesión con{' '}
          <strong>{usuario.email}</strong>.
        </p>
        <div className="codigos">
          {resultado.dispositivos.map((d) => (
            <div key={d.id} className="codigo-card">
              <span>{d.producto.nombre}</span>
              <code>{d.codigo_activacion}</code>
            </div>
          ))}
        </div>

        <Link to="/" className="btn">Volver al inicio</Link>
      </section>
    )
  }

  if (carrito.length === 0) {
    return (
      <section className="checkout">
        <h2>Tu carrito está vacío</h2>
        <Link to="/tienda" className="btn">Ir a la tienda</Link>
      </section>
    )
  }

  return (
    <section className="checkout">
      <h2>Confirmá tu pedido</h2>
      <p>Comprás como <strong>{usuario.nombre}</strong> ({usuario.email}).</p>

      <div className="checkout-resumen">
        {carrito.map((item) => (
          <div key={item.id} className="checkout-linea">
            <span>{item.nombre} × {item.cantidad}</span>
            <span>${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
          </div>
        ))}
        <div className="checkout-linea checkout-total">
          <span>Total</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <p className="checkout-aviso">
        🧪 Pago simulado: por ahora no se cobra nada. La integración con Mercado Pago es
        una etapa futura.
      </p>

      {error && <p className="error">{error}</p>}

      <button className="btn" onClick={confirmar} disabled={cargando}>
        {cargando ? 'Procesando...' : 'Confirmar y pagar'}
      </button>
    </section>
  )
}
