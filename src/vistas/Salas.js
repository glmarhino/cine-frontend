import axios from 'axios'
import { debounce } from 'lodash'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { DataGrid, esES } from '@mui/x-data-grid'
import { Breadcrumbs, Container, Typography, Stack, IconButton, Button, Modal, Box, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useAlertaContexto } from '../contextos/alerta'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

function Salas() {
  const navigate = useNavigate()
  const [paginacion, setPaginacion] = useState({
    cargando: false,
    docs: [],
    totalDocs: 0,
    page: 1,
    limit: 10
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
      const res = await axios.get('salas', {
        params: {
          page: paginacion.page,
          limit: paginacion.limit,
          buscar: texto
        }
      })
      setPaginacion(p => ({ ...p, cargando: false, docs: res.datos.docs, totalDocs: res.datos.totalDocs }))
    } catch(error) {
      setPaginacion({
        cargando: false,
        docs: [],
        totalDocs: 0,
        page: 1,
        limit: 10
      })
    }
  }, [paginacion.page, paginacion.limit])

  async function eliminarRegistro() {
    try {
      const res = await axios.delete(`salas/${registroSeleccionado}`)
      mostrarAlerta(res.mensaje, 'success')
      cerrarModal()
      setPaginacion(pag => ({ ...pag, page: 1 }))
      cargarDatos('')
      setRegistroSeleccionado(null)
    } catch(error) {
      mostrarAlerta(error.mensaje, 'error')
    }
  }

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
    { field: 'nombre', headerName: 'Nombre', headerAlign: 'center', align: 'center', sortable: false, width: 650 },
    { field: 'filas', headerName: 'Filas', headerAlign: 'center', align: 'center', sortable: false, width: 150 },
    { field: 'columnas', headerName: 'Columnas', headerAlign: 'center', align: 'center', sortable: false, width: 150 },
    {
      field: 'accion',
      headerName: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const editar = (e) => {
          e.stopPropagation()
          navigate(`editar/${params.id}`)
        }
        const eliminar = (e) => {
          e.stopPropagation()
          setRegistroSeleccionado(params.id)
          abrirModal()
        }

        return (
          <Stack direction="row" spacing={0}>
            <IconButton color="primary" onClick={ editar }>
              <EditIcon />
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          sx={{ py: 2 }}
        >
          <Breadcrumbs>
            <Link to="" style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Salas
            </Link>
          </Breadcrumbs>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} component={ Link } to="editar/0">
            Nueva
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
    </Container>
  )
}

export default Salas
