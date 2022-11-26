import axios from 'axios'
import moment from 'moment'
import { debounce } from 'lodash'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { DataGrid, esES } from '@mui/x-data-grid'
import { Breadcrumbs, Container, Stack, Box, Grid, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, IconButton, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import { useParams, Link } from 'react-router-dom'
import LocalMoviesIcon from '@mui/icons-material/LocalMovies'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import QrCodeIcon from '@mui/icons-material/QrCode'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

function Salas() {
  let { idPelicula, idHorario } = useParams()

  const [paginacion, setPaginacion] = useState({
    cargando: false,
    docs: [],
    totalDocs: 0,
    page: 1,
    limit: 10
  })
  const [horario, setHorario] = useState({
    _id: idHorario,
    precio: 0,
    horaInicio: null,
    horaFin: null,
    sala: {
      _id: null,
      nombre: null
    },
    pelicula: {
      _id: idPelicula,
      nombre: null,
      codigo: null
    }
  })

  const cargarDatos = useCallback(async (texto) => {
    try {
      setPaginacion(p => ({ ...p, cargando: true }))
      const res = await axios.get(`facturas/${idHorario}`, {
        params: {
          page: paginacion.page,
          limit: paginacion.limit,
          buscar: texto
        }
      })
      if (horario.horaInicio === null) {
        setHorario(res.datos.horario)
      }
      setPaginacion(p => ({ ...p, cargando: false, docs: res.datos.facturas.docs, totalDocs: res.datos.facturas.totalDocs }))
    } catch(error) {
      setPaginacion({
        cargando: false,
        docs: [],
        totalDocs: 0,
        page: 1,
        limit: 10
      })
      setHorario({
        _id: idHorario,
        precio: 0,
        horaInicio: null,
        horaFin: null,
        sala: {
          _id: null,
          nombre: null
        },
        pelicula: {
          _id: idPelicula,
          nombre: null,
          codigo: null
        }
      })
    }
  }, [paginacion.page, paginacion.limit, horario.horaInicio, idHorario, idPelicula])

  const [buscar, setBuscar] = useState('')
  const handleDebounceFn = useCallback(async (texto) => {
    cargarDatos(texto)
  }, [cargarDatos])
  const debounceFn = useMemo(() => debounce(handleDebounceFn, 600), [handleDebounceFn])
  function handleChange(event) {
    setBuscar(event.target.value)
    debounceFn(event.target.value)
  }

  useEffect(() => {
    cargarDatos('')
  }, [paginacion.page, paginacion.limit, cargarDatos])

  const columnas = [
    {
      field: 'createdAt',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { moment(params.formattedValue).format('DD/MM/YY HH:mm') }
          </Box>
        )
      }
    },
    { field: 'nombre', headerName: 'Nombre/Razón Social', headerAlign: 'center', align: 'center', sortable: false, width: 280 },
    { field: 'nit', headerName: 'NIT/CI', headerAlign: 'center', align: 'center', sortable: false, width: 200 },
    { field: 'correo', headerName: 'Email', headerAlign: 'center', align: 'center', sortable: false, width: 200 },
    {
      field: 'total',
      headerName: 'Total [Bs.]',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { (Math.round(params.formattedValue * 100) / 100).toFixed(2) }
          </Box>
        )
      }
    },
    {
      field: 'butacas',
      headerName: 'N° de butacas',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { params.formattedValue.length }
          </Box>
        )
      }
    }
  ]

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
            <Link to="/admin/peliculas" style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              Películas
            </Link>
            <Link to={ `/admin/peliculas/horarios/${idPelicula}` } style={{
              textDecoration: 'none',
              color: 'gray',
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              { horario.pelicula.nombre }
            </Link>
            <Link to={ `` } style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Facturas
            </Link>
          </Breadcrumbs>
        </Stack>
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
                <ListItemText primary={ horario.pelicula.nombre } secondary="Película" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <MeetingRoomIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ horario.sala.nombre } secondary="Sala" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <QrCodeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ horario.pelicula.codigo } secondary="Código" />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <CalendarMonthIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ moment(horario.horaInicio).format('DD/MM/YY') } secondary="Fecha" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccessTimeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ moment(horario.horaInicio).format('HH:mm') } secondary="Hora" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AttachMoneyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ `${(Math.round(horario.precio * 100) / 100).toFixed(2)} Bs.` } secondary="Precio por entrada" />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          </Grid>
        </Grid>
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel htmlFor="buscar">Buscar</InputLabel>
          <OutlinedInput
            id="buscar"
            onChange={ handleChange }
            startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
            endAdornment={
              <IconButton
                sx={{ visibility: buscar !== '' ? "visible" : "hidden" }}
                onClick={ () => { setBuscar(''); cargarDatos('') } }
              >
                <ClearIcon />
              </IconButton>
            }
            label="Buscar"
            value={ buscar }
          />
        </FormControl>
        <DataGrid
          rows={ paginacion.docs }
          rowCount={ paginacion.totalDocs }
          loading={ paginacion.cargando }
          rowsPerPageOptions={ [10, 20, 30] }
          pagination
          page={ paginacion.page - 1 }
          pageSize={ paginacion.limit || 2 }
          paginationMode="server"
          onPageChange={ (dato) => setPaginacion(pag => ({ ...pag, page: dato + 1 })) }
          onPageSizeChange={ (dato) => setPaginacion(pag => ({ ...pag, limit: dato })) }
          columns={ columnas }
          getRowId={ row => row._id }
          autoHeight
          disableSelectionOnClick
          disableColumnMenu
          localeText={ esES.components.MuiDataGrid.defaultProps.localeText }
          sx={{
            boxShadow: 2,
            border: 0,
            borderColor: 'secondary.light',
            '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
              border: '1px solid #dedede',
            },
            '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
              border: '1px solid #dedede',
            },
            '& .MuiDataGrid-cell': {
              color: 'rgba(0,0,0,.85)'
            },
            '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
              outline: 'none'
            }
          }}
        />
      </Paper>
    </Container>
  )
}

export default Salas
