import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 1) Al cambiar de página, vuelve arriba (React Router no lo hace solo).
// 2) Si tocás un enlace a la página en la que ya estás (ej. "Inicio" estando
//    en el inicio), sube suavemente al principio.
export default function ScrollAlInicio() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  useEffect(() => {
    const alTocar = (e) => {
      const enlace = e.target.closest('a[href]')
      if (!enlace || enlace.target === '_blank') return
      const url = new URL(enlace.href, window.location.href)
      const mismaPagina = url.origin === window.location.origin && url.pathname === window.location.pathname
      if (mismaPagina && !url.hash) window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    document.addEventListener('click', alTocar)
    return () => document.removeEventListener('click', alTocar)
  }, [])

  return null
}
