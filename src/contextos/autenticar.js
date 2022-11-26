import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export const AutenticarContexto = createContext()

export function AutenticarContextoProveedor({ children }) {
  const [autenticado, setAutenticado] = useState(window.localStorage.getItem('token') ?? false)
  const [usuario, setUsuario] = useState(window.localStorage.getItem('usuario') ?? false)
  const [rol, setRol] = useState(window.localStorage.getItem('rol') ?? false)

  const iniciarSesion = useCallback(function(usuario, rol, token) {
    window.localStorage.setItem('usuario', usuario)
    window.localStorage.setItem('rol', rol)
    window.localStorage.setItem('token', token)
    setUsuario(usuario)
    setRol(rol)
    setAutenticado(true)
  }, [])

  const cerrarSesion = useCallback(function() {
    window.localStorage.removeItem('usuario')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('rol')
    setUsuario(null)
    setRol(null)
    setAutenticado(false)
  }, [])

  const datos = useMemo(
    () => ({
      iniciarSesion,
      cerrarSesion,
      usuario,
      rol,
      autenticado
    }),
    [iniciarSesion, cerrarSesion, usuario, rol, autenticado]
  )

  return <AutenticarContexto.Provider value={ datos }>{ children }</AutenticarContexto.Provider>
}

AutenticarContextoProveedor.propTypes = {
  children: PropTypes.object
}

export function useAutenticarContexto() {
  return useContext(AutenticarContexto)
}
