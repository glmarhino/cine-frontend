import axios from 'axios'
import moment from 'moment'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Grid, Container, Typography, Stack, Button, Breadcrumbs, Paper } from '@mui/material'

function CarteleraPelicula() {
  const navigate = useNavigate()
  let { id } = useParams()
  const [ cartelera, setCartelera] = useState({
    pelicula: {
      _id: null,
      nombre: null,
      codigo: null,
      detalle: null,
      trailer: null,
      imagen: null,
    },
    horarios: []
  })

  const cargarDatos = useCallback(async () => {
    try {
      const res = await axios.get(`cartelera/${id}`, {
        params: {
          dias: 3
        }
      })
      setCartelera(res.datos)
    } catch(error) {
      setCartelera({
        pelicula: {
          _id: null,
          nombre: null,
          codigo: null,
          detalle: null,
          trailer: null,
          imagen: null,
        },
        horarios: []
      })
    }
  }, [id])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  function horarios() {
    if (cartelera.horarios.length > 0) {
      return cartelera.horarios.map(function(horario) {
        return (
          <Grid item xs={6} sm={3} md={2} key={horario._id}>
            <Button variant="outlined" color="tertiary" fullWidth onClick={ () => navigate(`butacas/${horario._id}`) }>
              <Stack>
                <Typography variant="body2" component="div" align="center" color="black">
                  { moment(horario.horaInicio).calendar(null, {
                      sameDay: '[Hoy a las]',
                      nextDay: '[Mañana a las]',
                      nextWeek: 'dddd [a las]',
                      lastDay: '[Ayer a las]',
                      lastWeek: 'dddd [a las]',
                      sameElse: 'DD/MM/YY [a las]'
                  }) }
                </Typography>
                <Typography variant="body1" component="div" align="center" color="black">
                  { moment(horario.horaInicio).format('HH:mm') }
                </Typography>
                <Typography variant="body2" component="div" align="center" color="primary">
                  { horario.sala.nombre }
                </Typography>
              </Stack>
            </Button>
          </Grid>
        )
      })
    } else {
      return (
        <Grid item xs={12}>
          <Typography variant="body1" component="div" align="center" color="error">
            No quedan entradas para esta película
          </Typography>
        </Grid>
      )
    }
  }

  return (
    <Container>
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
          <Link to={ `` } style={{
            textDecoration: 'none',
            color: 'black',
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}>
            { cartelera.pelicula.nombre }
          </Link>
        </Breadcrumbs>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Typography component="div" align="justify">
                { cartelera.pelicula.detalle }
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${cartelera.pelicula.trailer}?autoplay=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="div" align="center">
              Elige el horario
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} alignItems="center" justifyContent="center" style={{textAlign: "center"}}>
              { horarios() }
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default CarteleraPelicula
