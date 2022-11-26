import { useEffect } from 'react'
import { useAutenticarContexto } from '../contextos/autenticar'

function Logout() {
  const { cerrarSesion } = useAutenticarContexto()
  useEffect(() => {
    cerrarSesion()
  })
  return null
}

export default Logout
