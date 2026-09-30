// PLACEHOLDER: reemplazar por la imagen real del producto Estándar
const ImagenProductoEstandar = "https://placehold.co/400x300/e8f5e9/2e7d32?text=Estandar"; // placeholder

// PLACEHOLDER: reemplazar por la imagen real del producto Premium
const ImagenProductoPremium = "https://placehold.co/400x300/e8f5e9/2e7d32?text=Premium"; // placeholder

export const productos = [
  {
    id: "estandar",
    nombre: "SmartRiego Estándar",
    descripcion: "Ideal para una o dos macetas en interior.", // placeholder
    precio: 110000, // placeholder (ARS)
    imagen: ImagenProductoEstandar,
    caracteristicas: [
      "1 sensor de humedad capacitivo",
      "1 bomba sumergible",
      "Pantalla LCD local",
      "Control desde la app",
    ], // placeholder
  },
  {
    id: "premium",
    nombre: "SmartRiego Premium",
    descripcion: "Para balcones y huertas urbanas pequeñas.", // placeholder
    precio: 150000, // placeholder (ARS)
    imagen: ImagenProductoPremium,
    caracteristicas: [
      "2 sensores de humedad capacitivos",
      "2 bombas sumergibles",
      "Pantalla LCD local",
      "Control desde la app",
      "Alerta de depósito bajo",
    ], // placeholder
  },
];