import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import MenuIcon from '@mui/icons-material/Menu';
// import IconButton from '@mui/material/IconButton';

const NavigationPage = () => {
    const navigate = useNavigate()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}
                    <Button
                        sx={{ textTransform: 'capitalize' }}
                        variant='outlined'
                        color='logo'
                        onClick={() => navigate('/')}
                    >
                        Online Digitization Tool For Document
                    </Button>

                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
}

export default NavigationPage;
