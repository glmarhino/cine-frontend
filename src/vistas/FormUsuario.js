import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAutenticarContexto } from '../contextos/autenticar'
import { useAlertaContexto } from '../contextos/alerta'
import { Breadcrumbs, Grid, Paper, Typography, TextField, Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

function FormUsuario() {
  const navigate = useNavigate()
  const { mostrarAlerta } = useAlertaContexto()
  const { rol } = useAutenticarContexto()

  let { id } = useParams()
  const [ formulario, setFormulario] = useState({
    _id: null,
    nombre: null,
    apellido: null,
    telefono: null,
    email: null,
    direccion: null,
    usuario: null,
    clave: null,
    rol: rol
  })

  const [errores, setErrores] = useState({
    error: false,
    mensaje: '',
    datos: []
  })

  const roles = rol === 'Administrador' ? ['Administrador', 'Gerente'] : ['Gerente']

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setErrores({
        error: false,
        mensaje: '',
        datos: []
      })
      if (id === '0') {
        const res = await axios.post('usuarios', formulario)
        mostrarAlerta(res.mensaje, 'success')
        navigate('/admin/usuarios')
      } else{
        const res = await axios.patch(`usuarios/${formulario._id}`, formulario)
        mostrarAlerta(res.mensaje, 'success')
        navigate('/admin/usuarios')
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

  useEffect(() => {
    if (id === '0') {
      setFormulario({
        _id: null,
        nombre: null,
        apellido: null,
        telefono: null,
        email: null,
        direccion: null,
        usuario: null,
        clave: null,
        rol: rol
      })
    } else {
      axios.get(`usuarios/${id}`).then(res => {
        setFormulario({ ...res.datos.usuario, clave: null})
      }).catch((error) => {
        navigate('usuarios')
      })
    }
  }, [id, rol, navigate])

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper sx={{ pb: 2, px: 3 }}>
          <Breadcrumbs sx={{ py: 2 }}>
            <Link to="/admin/usuarios" style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              Usuarios
            </Link>
            <Link to={ `` } style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              { id === '0' ? 'Nuevo' : 'Editar' } Usuario
            </Link>
          </Breadcrumbs>
          { errores.error && (
            <Typography gutterBottom variant="body2" component="div" align="center" color="error" sx={{ mb: 2 }}>
              { errores.mensaje }
            </Typography>
          )}
          <form onSubmit={ handleSubmit }>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'nombre') }
                  name="nombre"
                  label="Nombre"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'nombre') ? errores.datos.find(o => o.param === 'nombre').msg : '' }
                  fullWidth
                  required
                  value={ formulario.nombre || '' }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'apellido') }
                  name="apellido"
                  label="Apellido"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'apellido') ? errores.datos.find(o => o.param === 'apellido').msg : '' }
                  fullWidth
                  required
                  value={ formulario.apellido || '' }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'telefono') }
                  name="telefono"
                  label="Teléfono"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'telefono') ? errores.datos.find(o => o.param === 'telefono').msg : '' }
                  fullWidth
                  type="number"
                  value={ formulario.telefono || '' }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'email') }
                  name="email"
                  label="Correo"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'email') ? errores.datos.find(o => o.param === 'email').msg : '' }
                  fullWidth
                  value={ formulario.email || '' }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'direccion') }
                  name="direccion"
                  label="Dirección"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'direccion') ? errores.datos.find(o => o.param === 'direccion').msg : '' }
                  fullWidth
                  value={ formulario.direccion || '' }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'usuario') }
                  name="usuario"
                  label="Usuario"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'usuario') ? errores.datos.find(o => o.param === 'usuario').msg : '' }
                  fullWidth
                  required
                  value={ formulario.usuario || '' }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'clave') }
                  name="clave"
                  label="Contraseña"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'clave') ? errores.datos.find(o => o.param === 'clave').msg : '' }
                  type="password"
                  fullWidth
                  required={ id === '0' }
                  value={ formulario.clave || '' }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel required id="selectRol">Rol</InputLabel>
                  <Select
                    labelId="selectRol"
                    name="rol"
                    label="Rol"
                    onChange={ handleChange }
                    fullWidth
                    required
                    value={ formulario.rol || '' }
                  >
                    {roles.map(function(rol, i){
                      return <MenuItem value={ rol } key={ i }>{ rol }</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button variant="contained" color="success" type="submit">Guardar</Button>
                  <Button variant="contained" color="error" component={ Link } to="/admin/usuarios">Cancelar</Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default FormUsuario
