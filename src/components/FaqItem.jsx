// Una pregunta desplegable. Se anima con CSS (grid 0fr -> 1fr).
export default function FaqItem({ item, icono, abierto, onToggle }) {
  const idRespuesta = `faq-respuesta-${item.id}`
  return (
    <div className={`faq-item ${abierto ? 'abierto' : ''}`}>
      <button
        className="faq-pregunta"
        onClick={onToggle}
        aria-expanded={abierto}
        aria-controls={idRespuesta}
      >
        <span className="faq-emoji" aria-hidden="true">{icono}</span>
        <span className="faq-texto">{item.pregunta}</span>
        <span className="faq-icono" aria-hidden="true">+</span>
      </button>
      <div id={idRespuesta} className="faq-cuerpo" role="region">
        <div className="faq-cuerpo-interno">
          <p className="faq-respuesta">{item.respuesta}</p>
        </div>
      </div>
    </div>
  )
}
