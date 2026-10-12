import { Link } from 'react-router-dom'
import { datosContacto } from '../data/contacto'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-marca">🌱 SmartRiego JNJL</p>
          <p className="footer-texto">
            Riego automático que mide la humedad real del suelo y se controla
            desde el celular.
          </p>
        </div>

        <nav className="footer-links" aria-label="Enlaces del pie de página">
          <Link to="/">Inicio</Link>
          <Link to="/tienda">Tienda</Link>
          <Link to="/faq">Preguntas frecuentes</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        <div className="footer-contacto">
          <a href={`mailto:${datosContacto.email}`}>📧 {datosContacto.email}</a>
          <span>📍 {datosContacto.ubicacion}</span>
        </div>
      </div>

      <p className="footer-legal">
        SmartRiego JNJL · IES Alfredo Coviello · 17ª Muestra Académica · 2026
      </p>
    </footer>
  )
}
