import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    parool: '',
    confirmParool: '',
    nimi: '',
    perekonnanimi: '',
    telefon: '',
    aadress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.parool !== formData.confirmParool) {
      return;
    }
    await register(
      formData.email,
      formData.parool,
      formData.nimi,
      formData.perekonnanimi,
      formData.telefon,
      formData.aadress
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Регистрация
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Имя"
              name="nimi"
              value={formData.nimi}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Фамилия"
              name="perekonnanimi"
              value={formData.perekonnanimi}
              onChange={handleChange}
              margin="normal"
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Телефон"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              margin="normal"
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Адрес"
              name="aadress"
              value={formData.aadress}
              onChange={handleChange}
              margin="normal"
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Пароль"
              name="parool"
              type="password"
              value={formData.parool}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Подтвердите пароль"
              name="confirmParool"
              type="password"
              value={formData.confirmParool}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
              error={formData.parool !== formData.confirmParool}
              helperText={
                formData.parool !== formData.confirmParool
                  ? 'Пароли не совпадают'
                  : ''
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={isLoading || formData.parool !== formData.confirmParool}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
            >
              Уже есть аккаунт? Войти
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 