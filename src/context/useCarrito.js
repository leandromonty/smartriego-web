import { useContext } from "react";
import { CarritoContext } from "./carritoContext";

export function useCarrito() {
  return useContext(CarritoContext);
}