import { productos } from "../data/productos";
import ProductCard from "../components/ProductCard";
import { useCarrito } from "../context/useCarrito";

export default function Tienda() {
  const { carrito, agregar, quitar, total } = useCarrito();

  return (
    <section className="tienda">
      <h2>Elegí tu modelo</h2>

      <div className="productos">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} onAgregar={agregar} />
        ))}
      </div>

      <aside className="carrito">
        <h3>🛒 Tu carrito</h3>
        {carrito.length === 0 ? (
          <p>Todavía no agregaste nada.</p>
        ) : (
          <>
            {carrito.map((item) => (
              <div key={item.id} className="carrito-item">
                <span>{item.nombre} × {item.cantidad}</span>
                <span>${(item.precio * item.cantidad).toLocaleString("es-AR")}</span>
                <button onClick={() => quitar(item.id)}>−</button>
              </div>
            ))}
            <p className="total">Total: ${total.toLocaleString("es-AR")}</p>
            <button className="btn">Finalizar compra</button>
          </>
        )}
      </aside>
    </section>
  );
}