import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';


function Navbar() {
    
return (
    <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button href="/" sx={{ my: 2, color: 'white', display: 'block' }}>
                    Home
                </Button>
                <Button href="/imageupload" sx={{ my: 2, color: 'white', display: 'block' }}>
                    Image Upload
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>


    );
}

export default Navbar;
