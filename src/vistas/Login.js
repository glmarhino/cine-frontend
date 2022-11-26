import axios from 'axios'
import { useState } from 'react'
import { useAutenticarContexto } from "../contextos/autenticar"
import { Container, Grid, Box, Typography, TextField, Stack, Button, Paper} from '@mui/material'

function Login() {
  const { iniciarSesion } = useAutenticarContexto()

  const [formulario, setFormulario] = useState({
    usuario: '',
    clave: ''
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
      const res = await axios.post('autenticar', formulario)
      iniciarSesion(res.datos.usuario, res.datos.rol, res.datos.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.datos.token}`
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

  return (
    <Container sx={{ height: '80vh' }}>
      <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
        <Grid item xs={12} sm={6} md={8} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box
            component="img"
            sx={{ width: '90%' }}
            alt="Fondo"
            src="/fondo.png"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 5 }}>
            <Typography variant="h6" component="div" align="center" sx={{ py: 2 }}>
              Iniciar sesión
            </Typography>
            { errores.error && (
              <Typography gutterBottom variant="body2" component="div" align="center" color="error" sx={{ mb: 2 }}>
                { errores.mensaje }
              </Typography>
            )}
            <form onSubmit={ handleSubmit }>
              <Stack spacing={3}>
                <TextField
                  error={ errores.datos.some(o => o.param === 'usuario') }
                  name="usuario"
                  label="Usuario"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'usuario') ? errores.datos.find(o => o.param === 'usuario').msg : '' }
                  fullWidth
                  required
                />
                <TextField
                  error={ errores.datos.some(o => o.param === 'clave') }
                  name="clave"
                  label="Contraseña"
                  onChange={ handleChange }
                  helperText={ errores.datos.some(o => o.param === 'clave') ? errores.datos.find(o => o.param === 'clave').msg : '' }
                  type="password"
                  fullWidth
                  required
                />
                <Button variant="contained" type="submit">Ingresar</Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login
