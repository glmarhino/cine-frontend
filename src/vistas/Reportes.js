import axios from 'axios'
import { debounce } from 'lodash'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { DataGrid, esES } from '@mui/x-data-grid'
import { Breadcrumbs, Container, Stack, Paper, Box, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

function Salas() {
  const [paginacion, setPaginacion] = useState({
    cargando: false,
    docs: [],
    totalDocs: 0,
    page: 1,
    limit: 10
  })

  const cargarDatos = useCallback(async (texto) => {
    try {
      setPaginacion(p => ({ ...p, cargando: true }))
      const res = await axios.get('reportes', {
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
    { field: 'nombre', headerName: 'Película', headerAlign: 'center', align: 'center', sortable: false, width: 340 },
    { field: 'horariosFuturos', headerName: 'Funciones próximas', headerAlign: 'center', align: 'center', sortable: false, width: 160 },
    { field: 'horariosPasados', headerName: 'Funciones pasadas', headerAlign: 'center', align: 'center', sortable: false, width: 160 },
    {
      field: 'totalButacas',
      headerName: 'Butacas Vendidas',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { params.row.totalButacasVendidas }/{ params.row.totalButacas }
          </Box>
        )
      }
    }, {
      field: 'totalEsperado',
      headerName: 'Total Vendido [Bs.]',
      headerAlign: 'center',
      align: 'right',
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
      field: 'totalRecaudado',
      headerName: 'Retorno',
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box component="div" whiteSpace="normal">
            { (params.row.totalEsperado > 0 ? (Math.round(params.row.totalRecaudado * 10000 / params.row.totalEsperado) / 100) : 0).toFixed(2) }%
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
            <Link to="" style={{
              textDecoration: 'none',
              color: 'black',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Reportes
            </Link>
          </Breadcrumbs>
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
    </Container>
  )
}

export default Salas
