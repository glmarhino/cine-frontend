import axios from 'axios'
import moment from 'moment'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAlertaContexto } from '../contextos/alerta'
import { Breadcrumbs, Grid, Paper, Typography, TextField, Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

function FormHorarios() {
  const navigate = useNavigate()
  const { mostrarAlerta } = useAlertaContexto()

  let { id } = useParams()
  const [ formulario, setFormulario] = useState({
    pelicula: id,
    precio: 50,
    fechaInicio: moment().format('YYYY-MM-DD'),
    fechaFin: moment().format('YYYY-MM-DD'),
    hora: moment().format(),
    salas: []
  })
  const [ pelicula, setPelicula] = useState({
    _id: null,
    nombre: ''
  })
  const [ salas, setSalas] = useState([])

  const [errores, setErrores] = useState({
    error: false,
    mensaje: '',
    datos: []
  })

  const cargarDatos = useCallback(async () => {
    try {
      const resPelicula = await axios.get(`peliculas/${id}`)
      setPelicula(resPelicula.datos.pelicula)
      const resSalas = await axios.get(`salas`, {
        params: {
          combo: true
        }
      })
      setSalas(resSalas.datos)
    } catch(error) {
      setPelicula({})
      setSalas([])
    }
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setErrores({
        error: false,
        mensaje: '',
        datos: []
      })
      const res = await axios.post('cartelera', formulario)
      if (res.datos.length > 0) {
        mostrarAlerta(res.datos.join('\n'), 'error')
      } else {
        mostrarAlerta(res.mensaje, 'success')
      }
      navigate(`/admin/peliculas/horarios/${id}`)
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
    setFormulario({
      pelicula: id,
      precio: 50,
      fechaInicio: moment().format('YYYY-MM-DD'),
      fechaFin: moment().format('YYYY-MM-DD'),
      hora: moment().format(),
      salas: []
    })
    cargarDatos()
  }, [id, navigate, cargarDatos])

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
            <Link to={ `/admin/peliculas/horarios/${id}` } style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              { pelicula.nombre }
            </Link>
            <Link to={ `` } style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Agregar horario
            </Link>
          </Breadcrumbs>
          { errores.error && (
            <Typography gutterBottom variant="body2" component="div" align="center" color="error" sx={{ mb: 2 }}>
              { errores.mensaje }
            </Typography>
          )}
          <form onSubmit={ handleSubmit }>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={6}>
                <DesktopDatePicker
                  error={ errores.datos.some(o => o.param === 'fechaInicio') }
                  name="fechaInicio"
                  label="Fecha de estreno"
                  onChange={ (fecha) => setFormulario({
                    ...formulario,
                    fechaInicio: fecha.format('YYYY-MM-DD')
                  }) }
                  helperText={ errores.datos.some(o => o.param === 'fechaInicio') ? errores.datos.find(o => o.param === 'fechaInicio').msg : '' }
                  fullWidth
                  required
                  value={ formulario.fechaInicio || moment().format('YYYY-MM-DD') }
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DesktopDatePicker
                  error={ errores.datos.some(o => o.param === 'fechaFin') }
                  name="fechaFin"
                  label="Fecha de clausura"
                  onChange={ (fecha) => setFormulario({
                    ...formulario,
                    fechaFin: fecha.format('YYYY-MM-DD')
                  }) }
                  helperText={ errores.datos.some(o => o.param === 'fechaFin') ? errores.datos.find(o => o.param === 'fechaFin').msg : '' }
                  fullWidth
                  required
                  value={ formulario.fechaFin || moment().format('YYYY-MM-DD') }
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  error={ errores.datos.some(o => o.param === 'hora') }
                  name="hora"
                  label="Hora de inicio"
                  onChange={ (fecha) => setFormulario({
                    ...formulario,
                    hora: fecha.format('YYYY-MM-DDTHH:mm:00-04:00')
                  }) }
                  helperText={ errores.datos.some(o => o.param === 'hora') ? errores.datos.find(o => o.param === 'hora').msg : '' }
                  fullWidth
                  required
                  value={ formulario.hora || moment().format() }
                  renderInput={(params) => <TextField {...params} />}
                  ampm
                  minutesStep={ 5 }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                  error={ errores.datos.some(o => o.param === 'precio') }
                  name="precio"
                  label="Precio por entrada"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'precio') ? errores.datos.find(o => o.param === 'precio').msg : '' }
                  fullWidth
                  type="number"
                  value={ formulario.precio || 50 }
                  required
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max: 200
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel required id="selectSalas">Salas</InputLabel>
                  <Select
                    labelId="selectSalas"
                    name="salas"
                    label="Salas"
                    onChange={ handleChange }
                    fullWidth
                    required
                    value={ formulario.salas || [] }
                    multiple
                    sx={{ pr: 15 }}
                  >
                    {salas.map(function(sala){
                      return <MenuItem value={ sala._id } key={ sala._id }>{ sala.nombre }</MenuItem>
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
                  <Button variant="contained" color="error" component={ Link } to={ `/admin/peliculas/horarios/${id}` }>Cancelar</Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default FormHorarios
