// Avatares de SmartRiego. Las imágenes están en /public/avatares/<id>.svg
// Si agregás uno nuevo: sumá el SVG en esa carpeta y una línea acá.
export const AVATARES = [
  { id: 'plantita', nombre: 'Plantita' },
  { id: 'gotita', nombre: 'Gotita' },
  { id: 'cactus', nombre: 'Cactus' },
  { id: 'girasol', nombre: 'Girasol' },
  { id: 'hoja', nombre: 'Hoja' },
  { id: 'regadera', nombre: 'Regadera' },
  { id: 'tomate', nombre: 'Tomate' },
  { id: 'nube', nombre: 'Nube' },
]

export const AVATAR_POR_DEFECTO = 'plantita'

export const rutaAvatar = (id) => `/avatares/${id}.svg`

const existe = (id) => AVATARES.some((a) => a.id === id)
const clave = (email) => `smartriego_avatar_${email}`

// Devuelve el avatar del usuario: primero el del servidor (cuando exista
// usuario.avatar) y, si no, el que se guardó en este navegador.
export function leerAvatar(usuario) {
  if (usuario?.avatar && existe(usuario.avatar)) return usuario.avatar
  try {
    const guardado = localStorage.getItem(clave(usuario?.email))
    if (guardado && existe(guardado)) return guardado
  } catch {
    // sin localStorage: se usa el avatar por defecto
  }
  return AVATAR_POR_DEFECTO
}

export function guardarAvatarLocal(usuario, id) {
  try {
    localStorage.setItem(clave(usuario?.email), id)
  } catch {
    // si el navegador no deja guardar, el cambio vale solo para esta sesión
  }
}
