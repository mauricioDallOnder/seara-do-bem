//atualizado
import * as React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Avatar,
  Drawer,
  Button,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import {TabelaDados} from "../TabelaBeneficiarios/TabelaDados"
import { TabelaInativos } from '../TabelaBeneficiarios/TabelaDadosInativos';
const pages = [
  { title: "Cadastro", link: "/Registration" },
  { title: "Atualização", link: "/UpdateData" },
  { title: "Frequencia Mensal", link: "https://script.google.com/macros/s/AKfycbzwFdWLHqfzvIwef5GlrhwX4IKlOak3cwmhrUJRRU9ZnoyiVPVjb9IUJHVycOhBZwYPLg/exec" },
];

export default function ResponsiveAppBar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderList = (items: typeof pages, direction: 'column' | 'row' = 'row') => (
    <List sx={{ display: 'flex', flexDirection: direction,alignItems:'center',gap:'10px' }}>
      {items.map((item) => (
        <Link href={item.link} passHref key={item.title}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={item.title} />
            </ListItemButton>
            
          </ListItem>
        </Link>
      ))}
      <TabelaDados/>
      <TabelaInativos/>
    </List>
  );

  const links = renderList(pages);
  const drawerLinks = renderList(pages, 'column');

  return (
    <AppBar position="static" color='primary'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%',alignItems:'center' }}>
            <Link href={"/"}>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: 'white',marginBottom:'5px',marginTop:'5px' }}
              >
                <img src="https://firebasestorage.googleapis.com/v0/b/chat-dos-otarios.appspot.com/o/ceab%2Falunos.6466ab2a87c256.49461801.jpg?alt=media&token=42b3312e-02ba-4379-8d1a-8ae0fc96b20a" alt="" />
              </Avatar>
            </Link>
            
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {links}
            </Box>
          </Box>
        </Toolbar>
      </Container>
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <IconButton
          edge="end"
          color="inherit"
          aria-label="close drawer"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <CloseIcon />
        </IconButton>
        {drawerLinks}
      </Drawer>
    </AppBar>
  );
}
