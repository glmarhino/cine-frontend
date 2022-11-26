import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAlertaContexto } from '../contextos/alerta'
import { Breadcrumbs, Grid, Paper, Typography, TextField, Stack, Button, OutlinedInput, Box } from '@mui/material'

function FormPelicula() {
  const navigate = useNavigate()
  const { mostrarAlerta } = useAlertaContexto()

  let { id } = useParams()
  const [ formulario, setFormulario] = useState({
    _id: null,
    nombre: null,
    codigo: null,
    horas: 2,
    minutos: 0,
    detalle: null,
    trailer: null,
    imagen: null
  })

  const [errores, setErrores] = useState({
    error: false,
    mensaje: '',
    datos: []
  })

  async function subirImagen(id) {
    let imagefile = document.getElementsByName('imagen')[0]
    if (imagefile.files.length === 1) {
      const formData = new FormData()
      formData.append('imagen', imagefile.files[0])
      await axios.post(`peliculas/${id}/imagen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    let imagefile = document.getElementsByName('imagen')[0]
    if (imagefile.files.length === 1) {
      if (imagefile.files[0].size > 5 * 1024 * 1024) {
        mostrarAlerta('El tamaño máximo de imagen es de 5 MB', 'error')
        return
      }
    }


    try {
      setErrores({
        error: false,
        mensaje: '',
        datos: []
      })
      if (id === '0') {
        const res = await axios.post('peliculas', formulario)
        if (!res.error) {
          subirImagen(res.datos.pelicula._id)
        }
        mostrarAlerta(res.mensaje, 'success')
        navigate('/admin/peliculas')
      } else{
        const res = await axios.patch(`peliculas/${formulario._id}`, formulario)
        if (!res.error) {
          subirImagen(res.datos.pelicula._id)
        }
        mostrarAlerta(res.mensaje, 'success')
        navigate('/admin/peliculas')
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
        codigo: null,
        horas: 2,
        minutos: 0,
        detalle: null,
        trailer: null,
        imagen: null
      })
    } else {
      axios.get(`peliculas/${id}`).then(res => {
        setFormulario({ ...res.datos.pelicula, imagen: null})
      }).catch((error) => {
        navigate('peliculas')
      })
    }
  }, [id, navigate])

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper sx={{ pb: 2, px: 3 }}>
          <Breadcrumbs sx={{ py: 2 }}>
            <Link to="/admin/peliculas" style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              Películas
            </Link>
            <Link to={ `` } style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              { id === '0' ? 'Nueva' : 'Editar' } Película
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
              <Grid item xs={12}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'codigo') }
                  name="codigo"
                  label="Código"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'codigo') ? errores.datos.find(o => o.param === 'codigo').msg : '' }
                  fullWidth
                  required
                  value={ formulario.codigo || '' }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'horas') }
                  name="horas"
                  label="Horas"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'horas') ? errores.datos.find(o => o.param === 'horas').msg : '' }
                  fullWidth
                  type="number"
                  value={ formulario.horas || 1 }
                  required
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: 4
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'minutos') }
                  name="minutos"
                  label="Minutos"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'minutos') ? errores.datos.find(o => o.param === 'minutos').msg : '' }
                  fullWidth
                  type="number"
                  value={ formulario.minutos || 0 }
                  required
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max: 59
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'detalle') }
                  name="detalle"
                  label="Sinopsis"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'detalle') ? errores.datos.find(o => o.param === 'detalle').msg : '' }
                  fullWidth
                  value={ formulario.detalle || '' }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <fieldset sx={{ border: '1px solid lightgray' }}>
                  <legend>Trailer YouTube</legend>
                  <Box
                    component="img"
                    sx={{ width: '100%', height: 130 }}
                    alt="Ejemplo ID trailer"
                    src="/ejemplo.png"
                  />
                  <Stack direction="row" justifyContent="center" sx={{ mb: 1 }}>
                    <Typography align="center" variant="overline">
                      Copie el texto como se muestra en el ejemplo
                    </Typography>
                  </Stack>
                  <TextField
                    error={ errores.datos.some(o => o.param === 'trailer') }
                    name="trailer"
                    label="ID Trailer YouTube"
                    onChange={ handleChange }
                    helperText={ errores.datos.some(o => o.param === 'trailer') ? errores.datos.find(o => o.param === 'trailer').msg : '' }
                    fullWidth
                    value={ formulario.trailer || '' }
                  />
                </fieldset>
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  error={ errores.datos.some(o => o.param === 'imagen') }
                  name="imagen"
                  label="Imagen"
                  type="file"
                  fullWidth
                  required={ id === '0' }
                  inputProps={{ accept: 'image/*' }}
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
                  <Button variant="contained" color="error" component={ Link } to="/admin/peliculas">Cancelar</Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default FormPelicula
