// Imágenes de los productos (ilustraciones en /public/img).
// Si más adelante tenés fotos reales, cambiá solo estas dos rutas.
const IMAGEN_PRODUCTO_ESTANDAR = '/img/producto-estandar.svg';
const IMAGEN_PRODUCTO_PREMIUM = '/img/producto-premium.svg';

export const productos = [
  {
    id: "estandar",
    nombre: "SmartRiego Estándar",
    descripcion: "Ideal para una o dos macetas en interior.", // placeholder
    precio: 110000, // placeholder (ARS)
    imagen: IMAGEN_PRODUCTO_ESTANDAR,
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
    imagen: IMAGEN_PRODUCTO_PREMIUM,
    caracteristicas: [
      "2 sensores de humedad capacitivos",
      "2 bombas sumergibles",
      "Pantalla LCD local",
      "Control desde la app",
      "Alerta de depósito bajo",
    ], // placeholder
  },
];