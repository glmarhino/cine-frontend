import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navigate, Outlet } from 'react-router-dom'
import { useAutenticarContexto } from '../contextos/autenticar'
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function RutaPublica() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { autenticado } = useAutenticarContexto()
  if (autenticado) {
    return <Navigate to="admin" />
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
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="/">
            <ListItemText primary="CARTELERA" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} component={ Link } to="login">
            <ListItemText primary="INGRESAR" />
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
              <Button variant="text" color="secondary" component={ Link } to="/">
                CARTELERA
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button variant="outlined" color="secondary" component={ Link } to="login">
                INGRESAR
              </Button>
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
