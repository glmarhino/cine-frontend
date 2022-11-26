import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Container, Stack, Paper, Grid, List, ListItem, ListItemAvatar, Avatar, Divider, ListItemText, TextField, InputAdornment, Button } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import HomeIcon from '@mui/icons-material/Home'
import PortraitIcon from '@mui/icons-material/Portrait'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { useAlertaContexto } from '../contextos/alerta'
import { useAutenticarContexto } from '../contextos/autenticar'
import KeyIcon from '@mui/icons-material/Key'

function Salas() {
  const { mostrarAlerta } = useAlertaContexto()
  const { cerrarSesion } = useAutenticarContexto()

  const [ formulario, setFormulario] = useState({
    clave: null
  })
  const [errores, setErrores] = useState({
    error: false,
    mensaje: '',
    datos: []
  })
  const [ usuario, setUsuario] = useState({
    _id: null,
    nombre: null,
    apellido: null,
    telefono: null,
    email: null,
    direccion: null,
    usuario: null,
    rol: null
  })

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setErrores({
        error: false,
        mensaje: '',
        datos: []
      })
      const res = await axios.patch(`autenticar/${usuario._id}`, formulario)
      mostrarAlerta(res.mensaje, 'success')
      cerrarSesion()
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

  useEffect(() => {
    axios.get(`autenticar`).then(res => {
      setUsuario({ ...res.datos.usuario })
    }).catch((error) => {
      setUsuario({
        _id: null,
        nombre: null,
        apellido: null,
        telefono: null,
        email: null,
        direccion: null,
        usuario: null,
        rol: null
      })
    })
  }, [])

  return (
    <Container>
      <Paper sx={{ pb: 2, px: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          sx={{ py: 2 }}
        >
          <Breadcrumbs>
            <Link to="" style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Perfil
            </Link>
          </Breadcrumbs>
        </Stack>
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ usuario.nombre } secondary="Nombre" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonOutlineIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ usuario.apellido } secondary="Apellido" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LocalPhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ usuario.telefono || '-' } secondary="Teléfono" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <HomeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ usuario.direccion || '-' } secondary="Dirección" />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AlternateEmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ usuario.email || '-' } secondary="Email" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PortraitIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ usuario.usuario } secondary="Usuario" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <VerifiedUserIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ usuario.rol } secondary="Rol" />
              </ListItem>
              <ListItem>
              <Grid item xs={12}>
                <form onSubmit={ handleSubmit }>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                  >
                    <TextField
                      error={ errores.datos.some(o => o.param === 'clave') }
                      name="clave"
                      label="Nueva contraseña"
                      onChange={ handleChange }
                      helperText={ errores.datos.some(o => o.param === 'clave') ? errores.datos.find(o => o.param === 'clave').msg : '' }
                      type="password"
                      fullWidth
                      required
                      value={ formulario.clave || '' }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                    <Button variant="contained" color="success" type="submit">Guardar</Button>
                  </Stack>
                </form>
              </Grid>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Salas
