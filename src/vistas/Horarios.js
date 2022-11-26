import axios from 'axios'
import moment from 'moment'
import { debounce } from 'lodash'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { DataGrid, esES } from '@mui/x-data-grid'
import { Breadcrumbs, Container, Typography, Stack, IconButton, Button, Modal, Box, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAlertaContexto } from '../contextos/alerta'
import DeleteIcon from '@mui/icons-material/Delete'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

function Horarios() {
  const navigate = useNavigate()
  let { id } = useParams()
  const [paginacion, setPaginacion] = useState({
    cargando: false,
    pelicula: {
      _id: null,
      nombre: null,
      codigo: null,
      detalle: null,
      trailer: null,
      imagen: null,
    },
    horarios: {
      docs: [],
      totalDocs: 0,
      page: 1,
      limit: 10
    }
  })

  const { mostrarAlerta } = useAlertaContexto()
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null)
  const [estadoModal, setEstadoModal] = useState(false)
  const abrirModal = () => setEstadoModal(true)
  const cerrarModal = () => {
    setEstadoModal(false)
    setRegistroSeleccionado(null)
  }

  const cargarDatos = useCallback(async (texto) => {
    try {
      setPaginacion(p => ({ ...p, cargando: true }))
      const res = await axios.get(`cartelera/${id}`, {
        params: {
          page: paginacion.horarios.page,
          limit: paginacion.horarios.limit,
          buscar: texto
        }
      })
      setPaginacion(p => ({ ...p, cargando: false, pelicula: res.datos.pelicula, horarios: {
        ...p.horarios,
        docs: res.datos.horarios.docs,
        totalDocs: res.datos.horarios.totalDocs
      }}))
    } catch(error) {
      setPaginacion({
        cargando: false,
        pelicula: {
          _id: null,
          nombre: null,
          codigo: null,
          detalle: null,
          trailer: null,
          imagen: null,
        },
        horarios: {
          docs: [],
          totalDocs: 0,
          page: 1,
          limit: 10
        }
      })
    }
  }, [paginacion.horarios.page, paginacion.horarios.limit, id])

  const [buscar, setBuscar] = useState('')
  const handleDebounceFn = useCallback(async (texto) => {
    cargarDatos(texto)
  }, [cargarDatos])
  const debounceFn = useMemo(() => debounce(handleDebounceFn, 600), [handleDebounceFn])
  function handleChange(event) {
    setBuscar(event.target.value)
    debounceFn(event.target.value)
  }

  async function eliminarRegistro() {
    try {
      const res = await axios.delete(`cartelera/${registroSeleccionado}`)
      mostrarAlerta(res.mensaje, 'success')
      cerrarModal()
      setPaginacion(pag => ({ ...pag, horarios: { ...pag.horarios, page: 1 } }))
      cargarDatos('')
      setRegistroSeleccionado(null)
    } catch(error) {
      mostrarAlerta(error.mensaje, 'error')
    }
  }

  useEffect(() => {
    cargarDatos('')
  }, [paginacion.horarios.page, paginacion.horarios.limit, cargarDatos])

  const columnas = [
    {
      field: 'sala',
      headerName: 'Sala',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { params.row.sala.nombre }
          </Box>
        )
      }
    }, {
      field: 'fecha',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { moment(params.row.horaInicio).format('L') }
          </Box>
        )
      }
    }, {
      field: 'horaInicio',
      headerName: 'Hora Inicio',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { moment(params.row.horaInicio).format('HH:mm') }
          </Box>
        )
      }
    }, {
      field: 'horaFin',
      headerName: 'Hora Fin',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { moment(params.row.horaFin).format('HH:mm') }
          </Box>
        )
      }
    },
    { field: 'precio', headerName: 'Precio entrada', headerAlign: 'center', align: 'center', sortable: false, width: 120 },
    { field: 'butacasVendidas', headerName: 'Comprados', headerAlign: 'center', align: 'center', sortable: false, width: 100 },
    { field: 'butacasLibres', headerName: 'Butacas libres', headerAlign: 'center', align: 'center', sortable: false, width: 120 },
    { field: 'butacasTotal', headerName: 'Butacas total', headerAlign: 'center', align: 'center', sortable: false, width: 120 },
    {
      field: 'accion',
      headerName: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const eliminar = (e) => {
          e.stopPropagation()
          setRegistroSeleccionado(params.id)
          abrirModal()
        }
        const facturas = (e) => {
          e.stopPropagation()
          navigate(`/admin/peliculas/horarios/${id}/facturas/${params.id}`)
        }

        return (
          <Stack direction="row" spacing={0}>
            <IconButton color="success" onClick={ facturas }>
              <ReceiptLongIcon />
            </IconButton>
            <IconButton color="error" onClick={ eliminar }>
              <DeleteIcon />
            </IconButton>
          </Stack>
        )
      }
    },
  ]

  return (
    <Container>
      <Paper sx={{ pb: 2, px: 3 }}>
        <Breadcrumbs>
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
            Asignación de horarios
          </Link>
        </Breadcrumbs>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          sx={{ py: 2 }}
        >
          <div>
            <Typography style={{ fontSize: 25, fontWeight: 100 }} component="span">Película: </Typography>
            <Typography style={{ fontSize: 25, fontWeight: 500 }} component="span">{ paginacion.pelicula.nombre }</Typography>
          </div>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} component={ Link } to="agregar">
            Nuevo
          </Button>
        </Stack>
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
          rows={ paginacion.horarios.docs }
          rowCount={ paginacion.horarios.totalDocs }
          loading={ paginacion.cargando }
          rowsPerPageOptions={ [10, 20, 30] }
          pagination
          page={ paginacion.horarios.page - 1 }
          pageSize={ paginacion.horarios.limit || 2 }
          paginationMode="server"
          onPageChange={ (dato) => setPaginacion(pag => ({ ...pag, horarios: { ...pag.horarios, page: dato + 1 } })) }
          onPageSizeChange={ (dato) => setPaginacion(pag => ({ ...pag, horarios: { ...pag.horarios, limit: dato } })) }
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
      <Modal
        open={ estadoModal }
        onClose={ cerrarModal }
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
        }}>
          <Typography gutterBottom variant="h6" component="div" align="center">
            ¿Seguro que desea eliminar el registro?
          </Typography>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Button variant="contained" color="error" onClick={ cerrarModal }>No</Button>
            <Button variant="contained" color="success" onClick={ eliminarRegistro }>Si</Button>
          </Stack>
        </Box>
      </Modal>
      </Paper>
    </Container>
  )
}

export default Horarios
