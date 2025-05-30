import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  People as ClientsIcon,
  Inventory as ProductsIcon,
  Store as BrandsIcon,
  Group as WorkersIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import type { RootState } from '../store';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const username = user?.email ? user.email.split('@')[0] : '';
  const role = user?.roll || '';

  const features = [
    {
      title: 'Заказы',
      description: 'Управление заказами клиентов',
      icon: <OrdersIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/manager/orders'),
    },
    {
      title: 'Клиенты',
      description: 'Управление клиентами',
      icon: <ClientsIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/manager/clients'),
    },
    {
      title: 'Товары',
      description: 'Управление каталогом товаров',
      icon: <ProductsIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/manager/products'),
    },
    {
      title: 'Работники',
      description: 'Просмотр и управление сотрудниками',
      icon: <WorkersIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/manager/workers'),
    },
    {
      title: 'Бренды',
      description: 'Управление брендами окон',
      icon: <BrandsIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/manager/brands'),
    },
    {
      title: 'Услуги',
      description: 'Управление услугами',
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/manager/services'),
    },
  ];

  const recentActivities = [
    { id: 1, text: 'Новый заказ #1234 от Ивана Иванова', time: '10 минут назад' },
    { id: 2, text: 'Заказ #1233 оплачен', time: '1 час назад' },
    { id: 3, text: 'Добавлен новый товар "Окно ПВХ"', time: '2 часа назад' },
  ];

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Добро пожаловать, {username}{role ? ` (${role})` : ''}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Добро пожаловать, {username}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={feature.action}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
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
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Последние действия
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem>
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статистика
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    12
                  </Typography>
                  <Typography color="text.secondary">Новых заказов</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    5
                  </Typography>
                  <Typography color="text.secondary">Новых клиентов</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ManagerDashboard; 