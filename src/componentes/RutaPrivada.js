import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navigate, Outlet } from 'react-router-dom'
import { useAutenticarContexto } from '../contextos/autenticar'
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Button, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'

export default function RutaPublica() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const open = Boolean(anchorEl)
  const abrirMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const cerrarMenu = () => {
    setAnchorEl(null)
  }

  const { usuario, autenticado } = useAutenticarContexto()
  if (!autenticado) {
    return <Navigate to="/" />
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box
        component="img"
        sx={{ height: 50, my: 2 }}
        alt="Logo"
        src="/logo.png"
      />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="">
            <ListItemText primary="INICIO" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="peliculas">
            <ListItemText primary="PELÍCULAS" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="salas">
            <ListItemText primary="SALAS" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="usuarios">
            <ListItemText primary="USUARIOS" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="reportes">
            <ListItemText primary="REPORTES" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="perfil">
            <ListItemText primary="PERFIL" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="logout">
            <ListItemText primary="SALIR" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <AppBar component="nav" position="absolute">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              sx={{ height: 50, mr: 4, display: { xs: 'none', sm: 'block' } }}
              alt="Logo"
              src="/logo.png"
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button variant="text" color="secondary" component={ Link } to="">
                INICIO
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button variant="text" color="secondary" component={ Link } to="peliculas">
                PELÍCULAS
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button variant="text" color="secondary" component={ Link } to="salas">
                SALAS
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button variant="text" color="secondary" component={ Link } to="usuarios">
                USUARIOS
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button variant="text" color="secondary" component={ Link } to="reportes">
                REPORTES
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button
                id="basic-button"
                variant="outlined"
                color="secondary"
                startIcon={<PersonIcon />}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={ abrirMenu }
              >
                { usuario }
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={ cerrarMenu }
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={ cerrarMenu } component={ Link } to="perfil">PERFIL</MenuItem>
                <MenuItem onClick={ cerrarMenu } component={ Link } to="logout">SALIR</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={ mobileOpen }
            onClose={ handleDrawerToggle }
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
      <Toolbar />
      <Outlet />
    </div>
  )
}
