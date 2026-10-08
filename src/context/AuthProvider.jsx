import { useState, useEffect } from 'react'
import { AuthContext } from './authContext'
import { api } from '../api'

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario'))
    } catch {
      return null
    }
  })

  const guardarSesion = (datos) => {
    localStorage.setItem('token', datos.access_token)
    localStorage.setItem('usuario', JSON.stringify(datos.usuario))
    setToken(datos.access_token)
    setUsuario(datos.usuario)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  const login = async (email, password) => {
    guardarSesion(await api('/auth/login', { metodo: 'POST', cuerpo: { email, password } }))
  }

  const registro = async (nombre, email, password) => {
    guardarSesion(
      await api('/auth/registro', { metodo: 'POST', cuerpo: { nombre, email, password } })
    )
  }

  // Al abrir la web, verifica que el token guardado siga siendo válido
  useEffect(() => {
    if (!token) return
    api('/auth/me', { token }).catch((error) => {
      if (error.message === 'Token inválido o vencido') logout()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ token, usuario, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}