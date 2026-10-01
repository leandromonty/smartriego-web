import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'

export default function Navbar() {
  const { cantidadTotal } = useCarrito()
  const [abierto, setAbierto] = useState(false)

  const cerrar = () => setAbierto(false)

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={cerrar}>🌱 SmartRiego JNJL</Link>

      <button
        className="menu-toggle"
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir o cerrar menú"
        aria-expanded={abierto}
      >
        {abierto ? '✕' : '☰'}
      </button>

      <nav className={abierto ? 'abierto' : ''}>
        <NavLink to="/" end onClick={cerrar}>Inicio</NavLink>
        <NavLink to="/tienda" onClick={cerrar}>
          Tienda 🛒{cantidadTotal > 0 && <span className="badge">{cantidadTotal}</span>}
        </NavLink>
        <NavLink to="/faq" onClick={cerrar}>FAQ</NavLink>
        <NavLink to="/contacto" onClick={cerrar}>Contacto</NavLink>
      </nav>
    </header>
  )
}