import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cartelera from './vistas/Cartelera'
import CarteleraPelicula from './vistas/CarteleraPelicula'
import FormButacas from './vistas/FormButacas'
import Inicio from './vistas/Inicio'
import Login from './vistas/Login'
import Usuarios from './vistas/Usuarios'
import FormUsuario from './vistas/FormUsuario'
import Salas from './vistas/Salas'
import Reportes from './vistas/Reportes'
import FormSala from './vistas/FormSala'
import Peliculas from './vistas/Peliculas'
import FormPelicula from './vistas/FormPelicula'
import FormHorarios from './vistas/FormHorarios'
import Horarios from './vistas/Horarios'
import Facturas from './vistas/Facturas'
import Logout from './vistas/Logout'
import Perfil from './vistas/Perfil'
import { AutenticarContextoProveedor } from './contextos/autenticar'
import { AlertaContextoProveedor } from './contextos/alerta'
import RutaPublica from './componentes/RutaPublica'
import RutaPrivada from './componentes/RutaPrivada'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { blue, teal, amber } from '@mui/material/colors'
import { esES } from '@mui/x-data-grid'
import { esES as coreEsES } from '@mui/material/locale'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const theme = createTheme({
  palette: {
    primary: {
      main: '#090b13'
    },
    secondary: {
      main: blue['50']
    },
    tertiary: {
      main: teal['500']
    },
    extra: {
      main: amber['500']
    },
  },
}, {
  esES,
  coreEsES,
})

function App() {
  return (
    <LocalizationProvider dateAdapter={ AdapterMoment }>
      <ThemeProvider theme={ theme }>
        <AlertaContextoProveedor>
          <AutenticarContextoProveedor>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={ <RutaPublica /> }>
                  <Route index element={ <Cartelera /> } />
                  <Route path='cartelera/:id' element={ <CarteleraPelicula /> } />
                  <Route path='cartelera/:idPelicula/butacas/:idHorario' element={ <FormButacas /> } />
                  <Route path='login' element={ <Login /> } />
                </Route>
                <Route path='admin' element={ <RutaPrivada /> }>
                  <Route index element={ <Inicio /> } />
                  <Route path='usuarios' element={ <Usuarios /> } />
                  <Route path="usuarios/editar/:id" element={<FormUsuario />} />
                  <Route path='salas' element={ <Salas /> } />
                  <Route path='reportes' element={ <Reportes /> } />
                  <Route path="salas/editar/:id" element={<FormSala />} />
                  <Route path='peliculas' element={ <Peliculas /> } />
                  <Route path="peliculas/editar/:id" element={<FormPelicula />} />
                  <Route path="peliculas/horarios/:id" element={<Horarios />} />
                  <Route path="peliculas/horarios/:id/agregar" element={<FormHorarios />} />
                  <Route path="peliculas/horarios/:idPelicula/facturas/:idHorario" element={<Facturas />} />
                  <Route path='logout' element={ <Logout /> } />
                  <Route path='perfil' element={ <Perfil /> } />
                </Route>
              </Routes>
            </BrowserRouter>
          </AutenticarContextoProveedor>
        </AlertaContextoProveedor>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
