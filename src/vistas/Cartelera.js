import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Container, Grid, CardActionArea, Card, CardMedia, CardContent, Typography, Paper } from '@mui/material'

function Cartelera() {
  const [peliculas, setPeliculas] = useState([])

  const cargarDatos = useCallback(async () => {
    try {
      const res = await axios.get('cartelera')
      setPeliculas(res.datos.peliculas)
    } catch(error) {
      setPeliculas([])
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  return (
    <Container>
      <Paper sx={{ pb: 2, px: 3 }}>
        <Typography variant="h6" component="div" align="center" sx={{ py: 2 }}>
          Cartelera
        </Typography>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {
            peliculas.map(function(pelicula) {
              return (
                <Grid item xs={12} sm={6} md={3} key={ pelicula._id }>
                  <Card>
                    <CardActionArea component={ Link } to={ `cartelera/${pelicula._id}` }>
                      <CardMedia
                        component="img"
                        height="415"
                        image={`${axios.defaults.baseURL}peliculas/${pelicula._id}/imagen`}
                        alt="Cargando..."
                      />
                      <CardContent>
                        <Typography variant="body1" component="div" align="center">
                          { pelicula.nombre }
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
      </Paper>
    </Container>
  )
}

export default Cartelera
