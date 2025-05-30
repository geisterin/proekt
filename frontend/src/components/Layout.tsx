import { Box, Container } from '@mui/material';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
          👻 {new Date().getFullYear()} Окна Про. Все права защищены.<br />
            Ты дошёл до низа страницы. Хочешь скидку? 😉 Скажи менеджеру :"Эспрессо Макиато" и получи -10% на весь заказ. PS: но не забудь принести кофейку менеджеру.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 