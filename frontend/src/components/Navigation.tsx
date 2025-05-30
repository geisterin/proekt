import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';
import type { RootState } from '../store/index'; 
import { logout } from '../store/authSlice';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const username = user?.email ? user.email.split('@')[0] : '';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Окна Про
        </Typography>

        {user ? (
          <>
            {user.role === 'client' ? (
              <>
                <Button color="inherit" onClick={() => navigate('/client/orders')}>
                  Мои заказы
                </Button>
                <Button color="inherit" onClick={() => navigate('/client/new-order')}>
                  Новый заказ
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/manager/orders')}>
                  Заказы
                </Button>
                <Button color="inherit" onClick={() => navigate('/manager/products')}>
                  Товары
                </Button>
                <Button color="inherit" onClick={() => navigate('/manager/clients')}>
                  Клиенты
                </Button>
              </>
            )}

            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {username}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                handleClose();
                navigate('/profile');
              }}>
                Профиль
              </MenuItem>
              <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Войти
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Регистрация
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 