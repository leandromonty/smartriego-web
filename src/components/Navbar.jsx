import { Link } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'

export default function Navbar() {
  const { cantidadTotal } = useCarrito()

  return (
    <header className="navbar">
      <Link to="/" className="logo">🌱 SmartRiego JNJL</Link>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/tienda">
          Tienda 🛒{cantidadTotal > 0 && <span className="badge">{cantidadTotal}</span>}
        </Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>
    </header>
  )
}