import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import {
  Window as WindowIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import React from 'react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <img
          src="/images/1.png"
          alt="Качественные окна"
          style={{ width: 180, height: 180, objectFit: 'contain', marginBottom: 16 }}
        />
      ),
      title: 'Качественные окна',
      description: 'Мы предлагаем только лучшие окна от проверенных производителей',
    },
    {
      icon: (
        <img
          src="/images/2.png"
          alt="Гарантия качества"
          style={{ width: 180, height: 180, objectFit: 'contain', marginBottom: 16 }}
        />
      ),
      title: 'Гарантия качества',
      description: 'На все наши окна предоставляется гарантия до 10 лет',
    },
    {
      icon: (
        <img
          src="/images/3.png"
          alt="Быстрая установка"
          style={{ width: 180, height: 180, objectFit: 'contain', marginBottom: 16 }}
        />
      ),
      title: 'Быстрая установка',
      description: 'Профессиональная установка окон в кратчайшие сроки',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Современные окна для вашего дома
          </Typography>
          <Typography variant="h5" paragraph>
            Качественные окна по доступным ценам с профессиональной установкой
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mt: 2 }}
          >
            Сделать заказ
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', mb: 8 }}>
          {features.map((feature, index) => (
            <Card sx={{ width: { xs: '100%', md: 340 }, minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} key={index}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Готовы сделать заказ?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Зарегистрируйтесь сейчас и получите скидку 10% на первый заказ
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Начать сейчас
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 