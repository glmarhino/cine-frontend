import axios from 'axios'
import { useState, useEffect, createElement } from 'react'
import { Link } from 'react-router-dom'
import { Container, Grid, CardActionArea, Card, CardContent, CardActions, Typography, Stack, Paper } from '@mui/material'
import LocalMoviesIcon from '@mui/icons-material/LocalMovies'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import PersonIcon from '@mui/icons-material/Person'

function Inicio() {
  const [medidas, setMedidas] = useState([])

  useEffect(() => {
    const Iconos = {
      LocalMoviesIcon: LocalMoviesIcon,
      MeetingRoomIcon: MeetingRoomIcon,
      PersonIcon: PersonIcon
    }

    axios.get('inicio').then(res => {
      let lista = []
      res.datos.medidas.forEach(medida => {
        lista.push(
          <Grid item xs={12} sm={6} md={3} key={ medida.titulo }>
            <Card sx={{ borderRadius: '14px' }}>
              <CardActionArea component={ Link } to={ medida.link }>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
                    <Typography variant="h4" component="div" align="center">
                      { medida.total }
                    </Typography>
                    { createElement(Iconos[medida.icono], { fontSize: 'large' }) }
                  </Stack>
                </CardContent>
                <CardActions sx={{ backgroundColor: medida.colorFondo, color: medida.colorTexto }}>
                  <Typography component="div" align="center" sx={{ px: 3 }}>
                    { medida.titulo }
                  </Typography>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        )
      })
      setMedidas(lista)
    }).catch((error) => {
      setMedidas([])
    })
  }, [])

  return (
    <Container>
      <Paper sx={{ pb: 2, px: 3 }}>
        <Typography variant="h6" component="div" align="center" sx={{ py: 2 }}>
          Bienvenido
        </Typography>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          { medidas }
        </Grid>
      </Paper>
    </Container>
  )
}

export default Inicio
