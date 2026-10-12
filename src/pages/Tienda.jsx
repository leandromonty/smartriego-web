import { productos } from "../data/productos";
import ProductCard from "../components/ProductCard";
import { useCarrito } from "../context/useCarrito";

export default function Tienda() {
  const { cantidadTotal, abrirCarrito } = useCarrito();

  return (
    <section className="tienda">
      <h2>Elegí tu modelo</h2>
      <p className="tienda-intro">
        Elegí el equipo que mejor se adapte a tus plantas. Al comprar recibís tu
        código de activación en la sección Mi cuenta.
      </p>

      <div className="productos">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>

      {cantidadTotal > 0 && (
        <div className="tienda-ver-carrito">
          <button className="btn" onClick={abrirCarrito}>
            Ver carrito ({cantidadTotal})
          </button>
        </div>
      )}
    </section>
  );
}
