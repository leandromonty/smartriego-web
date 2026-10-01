import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'

export default function Navbar() {
  const { cantidadTotal, abrirCarrito } = useCarrito()
  const [abierto, setAbierto] = useState(false)

  const cerrar = () => setAbierto(false)

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={cerrar}>🌱 SmartRiego JNJL</Link>

      <nav className={abierto ? 'abierto' : ''}>
        <NavLink to="/" end onClick={cerrar}>Inicio</NavLink>
        <NavLink to="/tienda" onClick={cerrar}>Tienda</NavLink>
        <NavLink to="/faq" onClick={cerrar}>FAQ</NavLink>
        <NavLink to="/contacto" onClick={cerrar}>Contacto</NavLink>
      </nav>

      <div className="navbar-acciones">
        <button className="nav-carrito" onClick={abrirCarrito} aria-label="Abrir carrito">
          🛒{cantidadTotal > 0 && <span className="badge">{cantidadTotal}</span>}
        </button>
        <button
          className="menu-toggle"
          onClick={() => setAbierto(!abierto)}
          aria-label="Abrir o cerrar menú"
          aria-expanded={abierto}
        >
          {abierto ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}