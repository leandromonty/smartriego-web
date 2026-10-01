import { useEffect } from "react";
import { useCarrito } from "../context/useCarrito";
import Cantidad from "./Cantidad";

export default function CarritoDrawer() {
  const {
    carrito, agregar, quitar, eliminar, vaciar,
    total, cantidadTotal, abierto, cerrarCarrito,
  } = useCarrito();

  // Cierra con la tecla Esc
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => e.key === "Escape" && cerrarCarrito();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, cerrarCarrito]);

  const handleVaciar = () => {
    if (window.confirm("¿Querés vaciar el carrito?")) vaciar();
  };

  return (
    <>
      <div className={`drawer-overlay ${abierto ? "visible" : ""}`} onClick={cerrarCarrito} />

      <aside className={`drawer ${abierto ? "abierto" : ""}`} aria-hidden={!abierto}>
        <header className="drawer-header">
          <h3>🛒 Tu carrito ({cantidadTotal})</h3>
          <button onClick={cerrarCarrito} aria-label="Cerrar carrito">✕</button>
        </header>

        {carrito.length === 0 ? (
          <p className="drawer-vacio">Todavía no agregaste nada.</p>
        ) : (
          <>
            <div className="drawer-items">
              {carrito.map((item) => (
                <div key={item.id} className="drawer-item">
                  <img src={item.imagen} alt={item.nombre} />

                  <div className="drawer-item-info">
                    <p className="drawer-item-nombre">{item.nombre}</p>
                    <p>${item.precio.toLocaleString("es-AR")}</p>
                    <Cantidad
                      cantidad={item.cantidad}
                      onMas={() => agregar(item)}
                      onMenos={() => quitar(item.id)}
                    />
                  </div>

                  <div className="drawer-item-derecha">
                    <p>${(item.precio * item.cantidad).toLocaleString("es-AR")}</p>
                    <button
                      className="drawer-eliminar"
                      onClick={() => eliminar(item.id)}
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="drawer-footer">
              <div className="drawer-total">
                <span>Total</span>
                <span>${total.toLocaleString("es-AR")}</span>
              </div>
              {/* PLACEHOLDER: conectar este botón con la página de checkout */}
              <button className="btn">Finalizar compra</button>
              <button className="btn-limpiar" onClick={handleVaciar}>Vaciar carrito</button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}