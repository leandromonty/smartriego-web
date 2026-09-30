import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">🌱 SmartRiego JNJL</Link>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/tienda">Tienda</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>
    </header>
  )
}