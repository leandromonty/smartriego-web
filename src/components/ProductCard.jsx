export default function ProductCard({ producto, onAgregar }) {
  return (
    <article className="product-card">
      <img src={producto.imagen} alt={producto.nombre} />
      <div className="product-info">
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <ul>
          {producto.caracteristicas.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="precio">${producto.precio.toLocaleString("es-AR")}</p>
        <button className="btn" onClick={() => onAgregar(producto)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}