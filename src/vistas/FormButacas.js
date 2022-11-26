import axios from 'axios'
import moment from 'moment'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Breadcrumbs, Grid, Paper, Typography, TextField, Stack, Button, Box, Checkbox, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Modal, CardMedia } from '@mui/material'
import LocalMoviesIcon from '@mui/icons-material/LocalMovies'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AvTimerIcon from '@mui/icons-material/AvTimer'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import EventSeatIcon from '@mui/icons-material/EventSeat'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'

function FormButacas() {
  const navigate = useNavigate()
  const [estadoModal, setEstadoModal] = useState(false)
  const abrirModal = () => setEstadoModal(true)
  const cerrarModal = () => {
    setEstadoModal(false)
    navigate('/')
  }

  let { idPelicula, idHorario } = useParams()
  const [ formulario, setFormulario] = useState({
    horario: idHorario,
    nombre: null,
    nit: null,
    correo: null,
    total: 0,
    butacas: []
  })

  const [ butacas, setButacas] = useState({
    _id: idHorario,
    precio: 0,
    horaInicio: null,
    horaFin: null,
    butacasTotal: null,
    butacasVendidas: null,
    butacasLibres: null,
    butacas: [],
    sala: {
      _id: null,
      nombre: null,
      filas: 0,
      columnas: 0
    },
    pelicula: {
      _id: idPelicula,
      nombre: null,
      codigo: null,
      horas: 0,
      minutos: 0,
      imagen: null
    }
  })

  const [errores, setErrores] = useState({
    error: false,
    mensaje: '',
    datos: []
  })

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      if (formulario.butacas.length === 0) {
        setErrores({
          error: true,
          mensaje: 'Debe seleccionar al menos una butaca',
          datos: []
        })
      } else {
        setErrores({
          error: false,
          mensaje: '',
          datos: []
        })
        await axios.post('butacas', formulario)
        abrirModal()
      }
    } catch(error) {
      setErrores(error)
    }
  }

  const handleChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value
    })
  }

  const clickButaca = (event, fila, columna) => {
    if (event.target.checked) {
      let seleccion = formulario.butacas
      seleccion.push({
        fila: fila,
        columna: columna
      })
      setFormulario({
        ...formulario,
        butacas: seleccion,
        total: formulario.total + butacas.precio
      })
    } else {
      let seleccion = formulario.butacas
      const index = seleccion.findIndex(o => {
        return o.fila === fila && o.columna === columna
      })
      seleccion.splice(index, 1)
      setFormulario({
        ...formulario,
        butacas: seleccion,
        total: formulario.total - butacas.precio
      })
    }
  }

  const cargarDatos = useCallback(async () => {
    try {
      const res = await axios.get(`butacas/${idHorario}`)
      setButacas(res.datos)
    } catch(error) {
      setButacas({
        _id: idHorario,
        precio: 0,
        horaInicio: null,
        horaFin: null,
        butacasTotal: null,
        butacasVendidas: null,
        butacasLibres: null,
        butacas: [],
        sala: {
          _id: null,
          nombre: null,
          filas: 0,
          columnas: 0
        },
        pelicula: {
          _id: idPelicula,
          nombre: null,
          codigo: null,
          horas: 0,
          minutos: 0,
          imagen: null
        }
      })
    }
  }, [idPelicula, idHorario])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper sx={{ pb: 2, px: 3 }}>
          <Breadcrumbs sx={{ py: 2 }}>
            <Link to="/" style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              Cartelera
            </Link>
            <Link to={ `/cartelera/${idPelicula}` } style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              Horarios
            </Link>
            <Link to={ `` } style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Compra Online
            </Link>
          </Breadcrumbs>
          <Grid container spacing={0} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography gutterBottom variant="h6" component="div" align="center">
                Datos de la película
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LocalMoviesIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ butacas.pelicula.nombre } secondary="Película" />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <MeetingRoomIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ butacas.sala.nombre } secondary="Sala" />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EventSeatIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ butacas.butacasLibres } secondary="Asientos disponibles" />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AccessTimeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ moment(butacas.horaInicio).format('HH:mm') } secondary="Hora" />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AvTimerIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ `${butacas.pelicula.horas}:${butacas.pelicula.minutos}` } secondary="Duración" />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AttachMoneyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ `${(Math.round(butacas.precio * 100) / 100).toFixed(2)} Bs.` } secondary="Precio por entrada" />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="h6" component="div" align="center">
              Datos de la reserva
            </Typography>
          </Grid>
          { errores.error && (
            <Typography gutterBottom variant="body2" component="div" align="center" color="error" sx={{ mb: 2 }}>
              { errores.mensaje }
            </Typography>
          )}
          <form onSubmit={ handleSubmit }>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={8} xl={4}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'nombre') }
                  name="nombre"
                  label="Nombre / Razón Social"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'nombre') ? errores.datos.find(o => o.param === 'nombre').msg : '' }
                  fullWidth
                  required
                  value={ formulario.nombre || '' }
                />
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'nit') }
                  name="nit"
                  label="NIT / CI"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'nit') ? errores.datos.find(o => o.param === 'nit').msg : '' }
                  fullWidth
                  required
                  value={ formulario.nit || 0 }
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: 1000000000
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={4}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'correo') }
                  name="correo"
                  label="Email"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'correo') ? errores.datos.find(o => o.param === 'correo').msg : '' }
                  fullWidth
                  required
                  value={ formulario.correo || '' }
                />
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                <Box sx={{ border: 1, borderColor: 'grey.400' }}>
                  <table>
                    <thead>
                      <tr>
                        <td colSpan={ butacas.sala.columnas }>
                          <Box sx={{ border: 1, borderColor: 'grey.700' }}>
                            <Typography variant="body1" component="div" align="center">
                              Pantalla
                            </Typography>
                          </Box>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      [...Array(butacas.sala.filas).keys()].map(function(fila) {
                        return (
                          <tr key={ fila }>
                            {
                              [...Array(butacas.sala.columnas).keys()].map(function(columna) {
                                return (
                                  <td key={ `${fila}${columna}` }>
                                    <Checkbox
                                      icon={<BookmarkBorderIcon />}
                                      checkedIcon={<BookmarkIcon />}
                                      disabled={ butacas.butacas.some(o => (o.fila === fila && o.columna === columna)) }
                                      onChange={ (event) => { clickButaca(event, fila, columna) } }
                                    />
                                  </td>
                                )
                              })
                            }
                          </tr>
                        )
                      })
                    }
                    </tbody>
                  </table>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <AirlineSeatReclineNormalIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ formulario.butacas.length } secondary="Asientos seleccionados" />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <LocalAtmIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ `${(Math.round(formulario.total * 100) / 100).toFixed(2)} Bs.` } secondary="Precio total" />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </List>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button variant="contained" color="success" type="submit">Aceptar</Button>
                  <Button variant="contained" color="error" component={ Link } to={ `/cartelera/${idPelicula}` }>Cancelar</Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Modal
        open={ estadoModal }
        onClose={ cerrarModal }
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
        }}>
          <Typography gutterBottom variant="h6" component="div" align="center">
            ¡Gracias por su compra!
          </Typography>
          <CardMedia
            component="img"
            height="400"
            image="data:image/png;base64,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AAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAE3PUAzL31AAAj7j/ocv6BJC8AAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAALOegAAGHnrAcb8AwBAjBcAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAFnPcAXeOsBxup7oL7+dfX9T1v9/quf//r619X3f139/Kf3vxcAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAFnPQBzbz3AWP0M1Ncfyur3H23171/9/NfXvy69/70AAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAg46wEAYOStBxir/wNYf+hy/snyAgAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAgQAAAAACAAAEAAAAAAgQAAAAACBAAAAAAIEAAAAAAgAABAAAAAAIEAAAAAAgQAAAAACBAAAAAAIAAAQAAAAACBAAAAAAIEAAAAAAg4KwH+AJvPQDAiG9AW/37V9//9fWHsvr9l+YFAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAgAAAAAECAAAAAAAABAgAAAAAECAAAAAAQIAAAAABAgAAAAAAAAQIAAAAABAgAAAAAECAAAAAAQIAAAAAAAAECAAAAAAQIAAAAABAg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"
            alt="Pago QR"
          />
          <Typography gutterBottom variant="body-1" component="div" align="center">
            Pago Simple QR
          </Typography>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Button variant="contained" color="success" onClick={ cerrarModal }>Aceptar</Button>
          </Stack>
        </Box>
      </Modal>
    </Grid>
  )
}

export default FormButacas
