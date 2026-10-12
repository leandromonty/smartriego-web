import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { preguntas } from '../data/faq'
import FaqItem from '../components/FaqItem'

// Ícono de cada pregunta según las palabras que tenga (solo decorativo).
const ICONOS = [
  [/wi-?fi|internet|conexi/i, '📶'],
  [/celular|app|remot/i, '📱'],
  [/agua|dep[óo]sito|tanque/i, '💧'],
  [/huerta|maceta|planta/i, '🌿'],
  [/instal/i, '🔧'],
  [/garant/i, '🛡️'],
  [/compr|pago|precio|envío|envio/i, '🛒'],
  [/funciona|sensor|humedad/i, '⚙️'],
]
const iconoPara = (texto) => {
  const hallado = ICONOS.find(([patron]) => patron.test(texto))
  return hallado ? hallado[1] : '❓'
}

// Para buscar sin importar mayúsculas ni tildes.
const normalizar = (t) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export default function FAQ() {
  const [busqueda, setBusqueda] = useState('')
  const [abiertos, setAbiertos] = useState([])

  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim())
    if (!q) return preguntas
    return preguntas.filter((p) =>
      normalizar(`${p.pregunta} ${p.respuesta}`).includes(q)
    )
  }, [busqueda])

  const toggle = (id) =>
    setAbiertos((act) => (act.includes(id) ? act.filter((x) => x !== id) : [...act, id]))

  const todasAbiertas = visibles.length > 0 && visibles.every((p) => abiertos.includes(p.id))
  const alternarTodas = () =>
    setAbiertos(todasAbiertas ? [] : visibles.map((p) => p.id))

  return (
    <>
      <header className="pagina-hero">
        <div className="pagina-hero-inner">
          <div>
            <span className="hero-etiqueta">Centro de ayuda</span>
            <h1>Preguntas frecuentes</h1>
            <p>Buscá tu duda o abrí las preguntas más comunes sobre SmartRiego.</p>
            <label className="buscador">
              <span aria-hidden="true">🔎</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar: Wi-Fi, instalación, garantía…"
                aria-label="Buscar en las preguntas frecuentes"
              />
            </label>
          </div>
          <img className="pagina-hero-img" src="/img/faq-ilustracion.svg" alt="" />
        </div>
      </header>

      <section className="faq">
        <div className="faq-barra">
          <span>
            {visibles.length} {visibles.length === 1 ? 'pregunta' : 'preguntas'}
          </span>
          {visibles.length > 1 && (
            <button type="button" className="link-boton" onClick={alternarTodas}>
              {todasAbiertas ? 'Cerrar todas' : 'Abrir todas'}
            </button>
          )}
        </div>

        {visibles.length === 0 ? (
          <div className="faq-vacio">
            <p>No encontramos resultados para “{busqueda}”.</p>
            <button type="button" className="link-boton" onClick={() => setBusqueda('')}>
              Ver todas las preguntas
            </button>
          </div>
        ) : (
          visibles.map((item) => (
            <FaqItem
              key={item.id}
              item={item}
              icono={iconoPara(item.pregunta)}
              abierto={abiertos.includes(item.id)}
              onToggle={() => toggle(item.id)}
            />
          ))
        )}

        <div className="faq-cta">
          <div>
            <h3>¿No encontraste tu respuesta?</h3>
            <p>Escribinos y te respondemos a la brevedad.</p>
          </div>
          <Link to="/contacto" className="btn btn-blanco">Contactanos</Link>
        </div>
      </section>
    </>
  )
}
