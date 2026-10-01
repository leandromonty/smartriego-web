import { useCarrito } from "../context/useCarrito";
import Cantidad from "./Cantidad";

export default function ProductCard({ producto }) {
  const { agregar, quitar, cantidadDe } = useCarrito();
  const cantidad = cantidadDe(producto.id);

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

        {cantidad === 0 ? (
          <button className="btn" onClick={() => agregar(producto)}>
            Agregar al carrito
          </button>
        ) : (
          <Cantidad
            cantidad={cantidad}
            onMas={() => agregar(producto)}
            onMenos={() => quitar(producto.id)}
          />
        )}
      </div>
    </article>
  );
}