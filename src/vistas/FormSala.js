import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAlertaContexto } from '../contextos/alerta'
import { Breadcrumbs, Grid, Paper, Typography, TextField, Stack, Button, Box } from '@mui/material'

function FormSala() {
  const navigate = useNavigate()
  const { mostrarAlerta } = useAlertaContexto()

  let { id } = useParams()
  const [ formulario, setFormulario] = useState({
    _id: null,
    nombre: null,
    filas: 8,
    columnas: 8
  })

  const [errores, setErrores] = useState({
    error: false,
    mensaje: '',
    datos: []
  })

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setErrores({
        error: false,
        mensaje: '',
        datos: []
      })
      if (id === '0') {
        const res = await axios.post('salas', formulario)
        mostrarAlerta(res.mensaje, 'success')
        navigate('/admin/salas')
      } else{
        const res = await axios.patch(`salas/${formulario._id}`, formulario)
        mostrarAlerta(res.mensaje, 'success')
        navigate('/admin/salas')
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
        filas: 8,
        columnas: 8
      })
    } else {
      axios.get(`salas/${id}`).then(res => {
        setFormulario({ ...res.datos.sala, clave: null})
      }).catch((error) => {
        navigate('salas')
      })
    }
  }, [id, navigate])

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper sx={{ pb: 2, px: 3 }}>
          <Breadcrumbs sx={{ py: 2 }}>
            <Link to="/admin/salas" style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              Salas
            </Link>
            <Link to={ `` } style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              { id === '0' ? 'Nueva' : 'Editar' } Sala
            </Link>
          </Breadcrumbs>
          { errores.error && (
            <Typography gutterBottom variant="body2" component="div" align="center" color="error" sx={{ mb: 2 }}>
              { errores.mensaje }
            </Typography>
          )}
          <form onSubmit={ handleSubmit }>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
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
              <Grid item xs={4} sm={3}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'filas') }
                  name="filas"
                  label="Filas"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'filas') ? errores.datos.find(o => o.param === 'filas').msg : '' }
                  fullWidth
                  type="number"
                  value={ formulario.filas || 8 }
                  required
                  InputProps={{
                    inputProps: {
                      min: 4,
                      max: 100
                    }
                  }}
                />
              </Grid>
              <Grid item xs={8} sm={9}>
                <Box
                  component="img"
                  sx={{ width: '100%' }}
                  alt="Butacas"
                  src="/butacas.png"
                />
              </Grid>
              <Grid item xs={4} sm={4}></Grid>
              <Grid item xs={4} sm={3}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'columnas') }
                  name="columnas"
                  label="Columnas"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'columnas') ? errores.datos.find(o => o.param === 'columnas').msg : '' }
                  fullWidth
                  type="number"
                  value={ formulario.columnas || 8 }
                  required
                  InputProps={{
                    inputProps: {
                      min: 4,
                      max: 100
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button variant="contained" color="success" type="submit">Guardar</Button>
                  <Button variant="contained" color="error" component={ Link } to="/admin/salas">Cancelar</Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default FormSala
