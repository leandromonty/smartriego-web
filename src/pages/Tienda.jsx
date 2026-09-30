import { useState } from "react";
import { productos } from "../data/productos";
import ProductCard from "../components/ProductCard";

export default function Tienda() {
  const [carrito, setCarrito] = useState([]); // [{ ...producto, cantidad }]

  const agregar = (producto) => {
    setCarrito((actual) => {
      const existe = actual.find((item) => item.id === producto.id);
      if (existe) {
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...actual, { ...producto, cantidad: 1 }];
    });
  };

  const quitar = (id) => {
    setCarrito((actual) =>
      actual
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

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