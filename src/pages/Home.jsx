import { Link } from 'react-router-dom'
import { productos } from '../data/productos'

const pasos = [
  { icono: '🌡️', titulo: 'Mide', texto: 'Un sensor capacitivo lee la humedad real del suelo, todo el tiempo.' },
  { icono: '⚙️', titulo: 'Decide', texto: 'Compara la lectura con el umbral que vos configurás para cada planta.' },
  { icono: '💧', titulo: 'Riega', texto: 'Si el suelo está seco, activa la bomba justo el tiempo necesario.' },
  { icono: '📱', titulo: 'Te avisa', texto: 'Mirás el historial en la app y recibís una alerta si el depósito está bajo.' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Tus plantas, siempre bien regadas</h1>
        <p>
          Riego automático que mide la humedad real del suelo. Menos agua
          desperdiciada, plantas más sanas, incluso cuando no estás.
        </p>
        <div className="hero-botones">
          <Link to="/tienda" className="btn">Ver modelos</Link>
          <a href="#como-funciona" className="btn btn-secundario">Cómo funciona</a>
        </div>
      </section>

      <section className="beneficios">
        <div className="card"><h3>💧 Ahorro de agua</h3><p>Riega solo cuando la planta lo necesita.</p></div>
        <div className="card"><h3>📱 Control desde el celular</h3><p>Monitoreá y accioná la bomba de forma remota.</p></div>
        <div className="card"><h3>🔔 Alertas</h3><p>Te avisamos cuando el depósito está bajo.</p></div>
      </section>

      <section id="como-funciona" className="seccion">
        <h2>Cómo funciona</h2>
        <div className="pasos">
          {pasos.map((paso, i) => (
            <div key={paso.titulo} className="paso">
              <span className="paso-numero">{i + 1}</span>
              <div className="paso-icono">{paso.icono}</div>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="seccion seccion-alt">
        <h2>Elegí tu modelo</h2>
        <div className="destacados">
          {productos.map((p) => (
            <article key={p.id} className="destacado">
              <img src={p.imagen} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p>{p.descripcion}</p>
              <p className="precio">${p.precio.toLocaleString('es-AR')}</p>
            </article>
          ))}
        </div>
        <Link to="/tienda" className="btn">Ir a la tienda</Link>
      </section>

      <section className="cta-final">
        <h2>¿Listo para dejar de preocuparte por el riego?</h2>
        <p>Armá tu pedido o escribinos si tenés dudas.</p>
        <div className="hero-botones">
          <Link to="/tienda" className="btn btn-blanco">Comprar ahora</Link>
          <Link to="/contacto" className="btn btn-borde">Consultar</Link>
        </div>
      </section>
    </>
  )
}