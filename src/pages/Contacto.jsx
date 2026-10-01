import { useState } from "react";

// PLACEHOLDER: reemplazar por los datos reales de contacto
const datosContacto = {
  email: "contacto@smartriego.com", // placeholder
  telefono: "+54 381 000-0000", // placeholder
  ubicacion: "San Miguel de Tucumán, Argentina", // placeholder
};

const formularioVacio = { nombre: "", email: "", mensaje: "" };

export default function Contacto() {
  const [datos, setDatos] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setEnviado(false);
  };

  const validar = () => {
    const nuevos = {};
    if (datos.nombre.trim().length < 2) nuevos.nombre = "Ingresá tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(datos.email)) nuevos.email = "Ingresá un email válido.";
    if (datos.mensaje.trim().length < 10) nuevos.mensaje = "Escribí al menos 10 caracteres.";
    return nuevos;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);

    if (Object.keys(nuevos).length === 0) {
      // PLACEHOLDER: acá iría el envío real (Formspree, EmailJS, backend, etc.)
      console.log("Mensaje de contacto:", datos);
      setEnviado(true);
      setDatos(formularioVacio);
    }
  };

  return (
    <section className="contacto">
      <h2>Contacto</h2>
      <p>¿Tenés dudas sobre los modelos o querés una instalación? Escribinos.</p>

      <div className="contacto-grid">
        <form className="contacto-form" onSubmit={handleSubmit} noValidate>
          <label>
            Nombre
            <input name="nombre" value={datos.nombre} onChange={handleChange} />
            {errores.nombre && <span className="error">{errores.nombre}</span>}
          </label>

          <label>
            Email
            <input name="email" type="email" value={datos.email} onChange={handleChange} />
            {errores.email && <span className="error">{errores.email}</span>}
          </label>

          <label>
            Mensaje
            <textarea name="mensaje" rows="5" value={datos.mensaje} onChange={handleChange} />
            {errores.mensaje && <span className="error">{errores.mensaje}</span>}
          </label>

          <button type="submit" className="btn">Enviar mensaje</button>

          {enviado && (
            <p className="exito">✅ ¡Gracias! Recibimos tu mensaje y te respondemos pronto.</p>
          )}
        </form>

        <aside className="contacto-info">
          <h3>Datos de contacto</h3>
          <p>📧 {datosContacto.email}</p>
          <p>📞 {datosContacto.telefono}</p>
          <p>📍 {datosContacto.ubicacion}</p>
        </aside>
      </div>
    </section>
  );
}