import { useEffect, useRef } from "react";

export default function ConfirmModal({
  titulo,
  mensaje,
  textoConfirmar = "Aceptar",
  textoCancelar = "Cancelar",
  peligro = false,
  onConfirmar,
  onCancelar,
}) {
  const botonCancelar = useRef(null);

  // Al abrir, el foco va al botón seguro (Cancelar) y Esc cancela
  useEffect(() => {
    botonCancelar.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancelar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancelar]);

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="modal-titulo">{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal-botones">
          <button ref={botonCancelar} className="modal-cancelar" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button
            className={`modal-confirmar ${peligro ? "peligro" : ""}`}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}