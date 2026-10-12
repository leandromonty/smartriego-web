import { useEffect, useRef, useState } from 'react'

// Carrusel de imágenes: avanza solo, se puede mover con flechas, puntitos
// o deslizando con el dedo. Se pausa al pasar el mouse o enfocarlo con el teclado.
export default function Carrusel({ imagenes, intervalo = 5000 }) {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const inicioX = useRef(null)
  const total = imagenes.length

  const ir = (indice) => setActual((indice + total) % total)

  // Pasa a la siguiente foto cada tanto (si no hay pausa ni preferencia de menos movimiento).
  // "actual" está en las dependencias para que, al cambiar a mano, el reloj arranque de nuevo.
  useEffect(() => {
    if (pausado || total < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActual((a) => (a + 1) % total), intervalo)
    return () => clearInterval(id)
  }, [pausado, total, intervalo, actual])

  const alTocar = (e) => {
    inicioX.current = e.touches[0].clientX
  }

  const alSoltar = (e) => {
    if (inicioX.current === null) return
    const diferencia = e.changedTouches[0].clientX - inicioX.current
    inicioX.current = null
    if (Math.abs(diferencia) > 40) ir(actual + (diferencia < 0 ? 1 : -1))
  }

  return (
    <div
      className="carrusel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotos de plantas"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onTouchStart={alTocar}
      onTouchEnd={alSoltar}
    >
      {imagenes.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={i === actual ? 'carrusel-slide activa' : 'carrusel-slide'}
          aria-hidden={i !== actual}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      {total > 1 && (
        <>
          <button
            type="button"
            className="carrusel-flecha izq"
            onClick={() => ir(actual - 1)}
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="carrusel-flecha der"
            onClick={() => ir(actual + 1)}
            aria-label="Foto siguiente"
          >
            ›
          </button>

          <div className="carrusel-puntos">
            {imagenes.map((img, i) => (
              <button
                type="button"
                key={img.src}
                className={i === actual ? 'punto activo' : 'punto'}
                onClick={() => ir(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                aria-current={i === actual}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
