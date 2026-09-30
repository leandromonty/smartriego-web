export default function FaqItem({ item, abierto, onToggle }) {
  return (
    <div className={`faq-item ${abierto ? "abierto" : ""}`}>
      <button className="faq-pregunta" onClick={onToggle} aria-expanded={abierto}>
        <span>{item.pregunta}</span>
        <span className="faq-icono">{abierto ? "−" : "+"}</span>
      </button>
      {abierto && <p className="faq-respuesta">{item.respuesta}</p>}
    </div>
  );
}