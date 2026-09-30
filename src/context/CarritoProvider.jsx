import { useState, useEffect } from "react";
import { CarritoContext } from "./carritoContext";

export default function CarritoProvider({ children }) {
  // Al iniciar, intenta recuperar el carrito guardado en el navegador
  const [carrito, setCarrito] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carrito")) || [];
    } catch {
      return [];
    }
  });

  // Cada vez que cambia el carrito, lo guarda
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

  const quitar = (id) => {
    setCarrito((actual) =>
      actual
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const cantidadTotal = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ carrito, agregar, quitar, total, cantidadTotal }}>
      {children}
    </CarritoContext.Provider>
  );
}