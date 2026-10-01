import { useState, useEffect } from "react";
import { CarritoContext } from "./carritoContext";

export default function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carrito")) || [];
    } catch {
      return [];
    }
  });
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

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

  // Resta una unidad; si llega a 0, el producto sale del carrito
  const quitar = (id) => {
    setCarrito((actual) =>
      actual
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  // Saca el producto completo, sin importar la cantidad
  const eliminar = (id) => setCarrito((actual) => actual.filter((item) => item.id !== id));

  const vaciar = () => setCarrito([]);

  const cantidadDe = (id) => carrito.find((item) => item.id === id)?.cantidad || 0;

  const abrirCarrito = () => setAbierto(true);
  const cerrarCarrito = () => setAbierto(false);

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const cantidadTotal = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito, agregar, quitar, eliminar, vaciar, cantidadDe,
        total, cantidadTotal, abierto, abrirCarrito, cerrarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}