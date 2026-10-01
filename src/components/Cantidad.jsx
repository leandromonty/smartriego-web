export default function Cantidad({ cantidad, onMas, onMenos }) {
  return (
    <div className="stepper">
      <button onClick={onMenos} aria-label="Quitar una unidad">−</button>
      <span>{cantidad}</span>
      <button onClick={onMas} aria-label="Agregar una unidad">+</button>
    </div>
  );
}