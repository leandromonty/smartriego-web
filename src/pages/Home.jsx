import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Tus plantas, siempre bien regadas</h1>
        <p>
          Riego automático que mide la humedad real del suelo. Menos agua
          desperdiciada, plantas más sanas, incluso cuando no estás.
        </p>
        <Link to="/tienda" className="btn">Ver modelos</Link>
      </section>

      <section className="beneficios">
        <div className="card"><h3>💧 Ahorro de agua</h3><p>Riega solo cuando la planta lo necesita.</p></div>
        <div className="card"><h3>📱 Control desde el celular</h3><p>Monitoreá y accioná la bomba de forma remota.</p></div>
        <div className="card"><h3>🔔 Alertas</h3><p>Te avisamos cuando el depósito está bajo.</p></div>
      </section>
    </>
  )
}