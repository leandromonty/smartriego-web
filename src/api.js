const API_URL = import.meta.env.VITE_API_URL

export async function api(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: {
        ...(cuerpo && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor.')
  }

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const detalle = datos?.detail
    throw new Error(typeof detalle === 'string' ? detalle : 'Revisá los datos ingresados.')
  }
  return datos
}