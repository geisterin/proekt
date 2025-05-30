import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardMedia,
} from '@mui/material';
import { Add as AddIcon, List as ListIcon, Store as BrandsIcon, Store as StoreIcon } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import Layout from '../components/Layout';
import type { RootState } from '../store';
import { orderAPI, productAPI } from '../services/api';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ChatWithManager from '../components/ChatWithManager';
import BuildIcon from '@mui/icons-material/Build';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const username = user?.email ? user.email.split('@')[0] : '';

  const features = [
    {
      title: 'Новый заказ',
      description: 'Создайте новый заказ на окна',
      icon: <AddIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/client/new-order'),
    },
    {
      title: 'Мои заказы',
      description: 'Просмотр и управление вашими заказами',
      icon: <ListIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/client/orders'),
    },
    {
      title: 'Бренды',
      description: 'Смотрите бренды окон и их описание',
      icon: <BrandsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/brands'),
    },
    {
      title: 'Чат с менеджером',
      description: 'Быстрый чат с менеджером по всем вопросам',
      icon: <ChatIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/client/chat'),
    },
    {
      title: 'Каталог товаров',
      description: 'Смотреть все доступные товары',
      icon: <StoreIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/client/products'),
    },
    {
      title: 'Услуги',
      description: 'Посмотреть все доступные услуги',
      icon: <BuildIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/client/services'),
    },
  ];

  // --- Новое: товары ---
  const [products, setProducts] = useState<any[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        setProducts(response.data);
      } catch (error) {
        // Можно добавить уведомление об ошибке
      }
    };
    fetchProducts();
  }, []);

  // Обрезка описания
  const getShortDescription = (text: string) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 4) return text;
    return words.slice(0, 4).join(' ') + '...';
  };

  const chatRef = useRef<HTMLDivElement>(null);
  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Добро пожаловать, {username}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Управляйте своими заказами на окна
        </Typography>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx} display="flex" justifyContent="center">
              <Card sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 }, minWidth: 260, maxWidth: 320, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={feature.action}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 160, justifyContent: 'center' }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>{feature.title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Нужна помощь?
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/client/chat')}
        >
          Связаться с менеджером
        </Button>
      </Box>
    </Layout>
  );
};

export default ClientDashboard; 