import { useState } from 'react'
import { Link } from 'react-router-dom'
import { datosContacto } from '../data/contacto'

const formularioVacio = { nombre: '', email: '', mensaje: '' }
const MAX_MENSAJE = 500

export default function Contacto() {
  const [datos, setDatos] = useState(formularioVacio)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
    setEnviado(false)
  }

  const validar = () => {
    const nuevos = {}
    if (datos.nombre.trim().length < 2) nuevos.nombre = 'Ingresá tu nombre.'
    if (!/^\S+@\S+\.\S+$/.test(datos.email)) nuevos.email = 'Ingresá un email válido.'
    if (datos.mensaje.trim().length < 10) nuevos.mensaje = 'Escribí al menos 10 caracteres.'
    return nuevos
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length === 0) {
      // PLACEHOLDER: acá iría el envío real (Formspree, EmailJS, backend, etc.)
      console.log('Mensaje de contacto:', datos)
      setEnviado(true)
      setDatos(formularioVacio)
    }
  }

  const copiarEmail = async () => {
    try {
      await navigator.clipboard.writeText(datosContacto.email)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin permiso para el portapapeles: el enlace mailto sigue funcionando.
    }
  }

  return (
    <>
      <header className="pagina-hero">
        <div className="pagina-hero-inner">
          <div>
            <span className="hero-etiqueta">Estamos para ayudarte</span>
            <h1>Contacto</h1>
            <p>¿Dudas sobre los modelos o querés una instalación? Escribinos.</p>
          </div>
          <img className="pagina-hero-img" src="/img/contacto-ilustracion.svg" alt="" />
        </div>
      </header>

      <section className="contacto">
        <div className="contacto-grid">
          <form className="contacto-form" onSubmit={handleSubmit} noValidate>
            <h2>Enviános un mensaje</h2>

            <label>
              Nombre
              <input name="nombre" value={datos.nombre} onChange={handleChange} autoComplete="name" />
              {errores.nombre && <span className="error">{errores.nombre}</span>}
            </label>

            <label>
              Email
              <input name="email" type="email" value={datos.email} onChange={handleChange} autoComplete="email" />
              {errores.email && <span className="error">{errores.email}</span>}
            </label>

            <label>
              Mensaje
              <textarea
                name="mensaje"
                rows="5"
                maxLength={MAX_MENSAJE}
                value={datos.mensaje}
                onChange={handleChange}
              />
              <span className="contador">{datos.mensaje.length}/{MAX_MENSAJE}</span>
              {errores.mensaje && <span className="error">{errores.mensaje}</span>}
            </label>

            <button type="submit" className="btn">Enviar mensaje</button>

            {enviado && (
              <p className="exito" role="status">✅ ¡Gracias! Recibimos tu mensaje y te respondemos pronto.</p>
            )}
          </form>

          <aside className="contacto-lateral">
            <div className="canal">
              <span className="canal-icono" aria-hidden="true">📧</span>
              <div className="canal-datos">
                <strong>Correo</strong>
                <a href={`mailto:${datosContacto.email}`}>{datosContacto.email}</a>
              </div>
              <button type="button" className="link-boton" onClick={copiarEmail}>
                {copiado ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>

            <div className="canal">
              <span className="canal-icono" aria-hidden="true">📞</span>
              <div className="canal-datos">
                <strong>Teléfono</strong>
                <span>{datosContacto.telefono}</span>
              </div>
            </div>

            <div className="canal">
              <span className="canal-icono" aria-hidden="true">📍</span>
              <div className="canal-datos">
                <strong>Ubicación</strong>
                <span>{datosContacto.ubicacion}</span>
              </div>
            </div>

            <Link to="/faq" className="canal canal-faq">
              <span className="canal-icono" aria-hidden="true">💡</span>
              <div className="canal-datos">
                <strong>¿Una duda rápida?</strong>
                <span>Mirá las preguntas frecuentes</span>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
