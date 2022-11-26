import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Snackbar, Alert } from '@mui/material'

export const AlertaContexto = createContext()

export function AlertaContextoProveedor({ children }) {
  const [alerta, setAlerta] = useState({
    estado: false,
    mensaje: '',
    vertical: 'top',
    horizontal: 'center',
    tipo: 'info'
  })
  const { estado, mensaje, vertical, horizontal, tipo } = alerta

  const handleAlerta = () => {
    setAlerta({ ...alerta, estado: false })
  }

  const mostrarAlerta = useCallback(function(mensaje, tipo) {
    setAlerta({
      ...alerta,
      estado: true,
      mensaje: mensaje,
      tipo: tipo
    })
  }, [alerta])

  const datos = useMemo(
    () => ({
      mostrarAlerta
    }),
    [mostrarAlerta]
  )

  const lineas = function(mensaje) {
    const mensajes = []
    mensaje.split('\n').forEach((texto, i) => {
      mensajes.push(<div key={i}>{ texto }</div>)
    })
    return mensajes;
  }

  return (
    <AlertaContexto.Provider value={ datos }>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={ estado }
        onClose={ handleAlerta }
        autoHideDuration={ 6000 }
        severity={ tipo }
      >
        <Alert onClose={ handleAlerta } severity={ tipo } sx={{ width: '100%' }}>
          { lineas(mensaje) }
        </Alert>
      </Snackbar>
      { children }
    </AlertaContexto.Provider>
  )
}

AlertaContextoProveedor.propTypes = {
  children: PropTypes.object
}

export function useAlertaContexto() {
  return useContext(AlertaContexto)
}
