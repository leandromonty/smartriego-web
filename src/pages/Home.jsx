import { Link } from 'react-router-dom'
import { productos } from '../data/productos'
import Carrusel from '../components/Carrusel'

const fotosHero = [
  { src: '/img/hojas-lluvia.jpg', alt: 'Hojas verdes con gotas de lluvia' },
  { src: '/img/hoja-gotas.jpg', alt: 'Hoja grande con gotas de agua' },
  { src: '/img/plantin-riego.jpg', alt: 'Un plantín siendo regado' },
]

const pasos = [
  { icono: '🌡️', titulo: 'Mide', texto: 'Un sensor capacitivo lee la humedad real del suelo, todo el tiempo.' },
  { icono: '⚙️', titulo: 'Decide', texto: 'Compara la lectura con el umbral de humedad de tu planta.' },
  { icono: '💧', titulo: 'Riega', texto: 'Si el suelo está seco, activa la bomba justo el tiempo necesario.' },
  { icono: '📱', titulo: 'Te avisa', texto: 'Mirás el historial en la app y recibís una alerta si el depósito está bajo.' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-contenido">
            <span className="hero-etiqueta">Riego inteligente para tu casa</span>
            <h1>Tus plantas, siempre bien regadas</h1>
            <p>
              Riego automático que mide la humedad real del suelo. Menos agua
              desperdiciada, plantas más sanas, incluso cuando no estás.
            </p>
            <div className="hero-botones">
              <Link to="/tienda" className="btn">Ver modelos</Link>
              <a href="#como-funciona" className="btn btn-secundario">Cómo funciona</a>
            </div>
            <ul className="hero-datos">
              <li>💧 Mide la humedad real</li>
              <li>📱 Se controla desde el celular</li>
              <li>🔔 Avisa si falta agua</li>
            </ul>
          </div>

          <Carrusel imagenes={fotosHero} />
        </div>
      </section>

      <section className="beneficios">
        <div className="card"><h3>💧 Ahorro de agua</h3><p>Riega solo cuando la planta lo necesita.</p></div>
        <div className="card"><h3>📱 Control desde el celular</h3><p>Monitoreá y accioná la bomba de forma remota.</p></div>
        <div className="card"><h3>🔔 Alertas</h3><p>Te avisamos cuando el depósito está bajo.</p></div>
      </section>

      <section id="como-funciona" className="seccion">
        <h2>Cómo funciona</h2>
        <div className="como-grid">
          <img
            className="como-foto"
            src="/img/hoja-gotas.jpg"
            alt="Gotas de agua sobre una hoja grande"
            loading="lazy"
          />
          <div className="pasos">
            {pasos.map((paso, i) => (
              <div key={paso.titulo} className="paso">
                <span className="paso-numero">{i + 1}</span>
                <div className="paso-cuerpo">
                  <h3><span className="paso-icono">{paso.icono}</span> {paso.titulo}</h3>
                  <p>{paso.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion esquema-seccion">
        <h2>Todo conectado</h2>
        <p className="seccion-intro">
          El sensor mide, el equipo decide y riega, y el servidor guarda cada
          dato para que lo veas desde la app.
        </p>
        <picture>
          <source media="(max-width: 600px)" srcSet="/img/esquema-vertical.svg" />
          <img
            className="esquema"
            src="/img/esquema.svg"
            alt="Esquema: el sensor de suelo envía datos al equipo con bomba, que se conecta por Wi-Fi al servidor y a la app Android"
            loading="lazy"
          />
        </picture>
      </section>

      <section className="banda">
        <h2>Cada planta recibe el agua que necesita</h2>
        <p>
          Nada de regar por reloj: SmartRiego mide el suelo y riega solo cuando
          hace falta.
        </p>
        <Link to="/tienda" className="btn btn-blanco">Conocer los modelos</Link>
      </section>

      <section className="seccion">
        <div className="nosotros">
          <img
            src="/img/logo-smartriego.png"
            alt="Logo de SmartRiego JNJL"
            loading="lazy"
          />
          <div>
            <h2>Quiénes somos</h2>
            <p>
              SmartRiego JNJL es un proyecto del equipo JNJL, estudiantes de la
              Tecnicatura Superior en Desarrollo de Software del IES Alfredo
              Coviello (San Miguel de Tucumán), presentado en la 17ª Muestra
              Académica Institucional.
            </p>
            <p>
              Combina un equipo con sensor y bomba, un servidor en internet y una
              app para Android, para que cuidar tus plantas sea más simple.
            </p>
          </div>
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
