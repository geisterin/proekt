import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { orderAPI } from '../services/api';
import type { Order as BaseOrder } from '../types/index';
import type { RootState } from '../store';

type Order = BaseOrder & { clientName?: string };

const statusColors = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  cancelled: 'error',
} as const;

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log('user из useSelector:', user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTotalSum = (orderData: any) => {
    if (!orderData) return 0;
    const products = orderData?.products || [];
    const services = orderData?.services || [];
    let productSum = products.reduce((acc: number, item: any) => {
      const price = item.toode?.hinnad?.[0]?.hind || 0;
      return acc + price * (item.arv || 0);
    }, 0);
    let serviceSum = services.reduce((acc: number, item: any) => {
      const price = item.Teenused?.hind || 0;
      return acc + price * (item.arv || 0);
    }, 0);
    return productSum + serviceSum;
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (selectedOrder) {
      console.log('Детали заказа:', selectedOrder);
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('user:', user, 'user?.roll:', user?.roll, 'user?.userType:', user?.userType, 'user?.role:', user?.role);
      let response;
      if (user?.userType === 'klient') {
        response = await orderAPI.getMyOrders();
      } else {
        response = await orderAPI.getOrders();
      }
      const processedOrders = response.data.map((order: any) => ({
        id: order.tellimus_id || null,
        clientName: order.klient || '—',
        status: order.status || 'processing',
        totalAmount: parseFloat(order.summa) || 0,
        createdAt: order.tellimuse_kuupaev ? new Date(order.tellimuse_kuupaev).toISOString() : null,
        updatedAt: order.tellimuse_kuupaev ? new Date(order.tellimuse_kuupaev).toISOString() : null
      }));
      setOrders(processedOrders);
    } catch (error) {
      console.error('Ошибка при загрузке заказов:', error);
      setError('Произошла ошибка при загрузке заказов. Пожалуйста, попробуйте позже.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    if (!order.id) {
      setOrderError('ID заказа отсутствует');
      return;
    }
    
    setIsOrderLoading(true);
    setOrderError(null);
    setIsDialogOpen(true);
    
    try {
      console.log('Запрос деталей заказа для ID:', order.id);
      const response = await orderAPI.getOrderDetails(order.id);
      console.log('Детали заказа:', response.data);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Ошибка при получении деталей заказа:', error);
      setOrderError('Ошибка при получении деталей заказа');
      setSelectedOrder(null);
    } finally {
      setIsOrderLoading(false);
    }
  };

  const handleEditOrder = (orderId: number) => {
    navigate(`/orders/${orderId}/edit`);
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await orderAPI.deleteOrder(orderId);
        fetchOrders();
      } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('et-EE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null || isNaN(price)) return '—';
    return new Intl.NumberFormat('et-EE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => navigate(user?.roll === 'manager' ? '/manager' : '/client')}
        >
          ← Назад
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">Заказы</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/new-order')}
          >
            Новый заказ
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : orders.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            Заказы не найдены
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>№ Заказа</TableCell>
                  <TableCell>Клиент</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Сумма</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id || '—'}</TableCell>
                    <TableCell>{order.clientName || '—'}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status || 'Неизвестно'}
                        color={statusColors[order.status as keyof typeof statusColors] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewOrder(order)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => order.id && handleEditOrder(order.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => order.id && handleDeleteOrder(order.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedOrder(null);
            setOrderError(null);
          }}
          maxWidth="md"
          fullWidth
        >
          {isOrderLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : orderError ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {orderError}
              </Alert>
              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)}>Закрыть</Button>
              </DialogActions>
            </Box>
          ) : !selectedOrder ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Нет данных о заказе
              </Alert>
              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)}>Закрыть</Button>
              </DialogActions>
            </Box>
          ) : (
            <>
              <DialogTitle>
                Детали заказа #{selectedOrder?.order?.tellimus_id || '—'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Информация о заказе:
                  </Typography>
                  <Typography>
                    Дата создания: {selectedOrder?.order?.tellimuse_kuupaev ? formatDate(selectedOrder.order.tellimuse_kuupaev) : '—'}
                  </Typography>
                  <Typography>
                    Статус: <Chip label="processing" color="info" size="small" />
                  </Typography>
                  <Typography>
                    Общая сумма: {selectedOrder ? formatPrice(getTotalSum(selectedOrder)) : '—'}
                  </Typography>

                  <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                    Товары:
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Товар</TableCell>
                          <TableCell>Количество</TableCell>
                          <TableCell>Цена</TableCell>
                          <TableCell>Сумма</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(!selectedOrder?.products || selectedOrder.products.length === 0) ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              Нет товаров в заказе
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectedOrder.products.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.toode?.nimetus || '—'}</TableCell>
                              <TableCell>{item.arv || 0}</TableCell>
                              <TableCell>{formatPrice(item.toode?.hinnad?.[0]?.hind || 0)}</TableCell>
                              <TableCell>{formatPrice((item.toode?.hinnad?.[0]?.hind || 0) * (item.arv || 0))}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                    Услуги:
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Услуга</TableCell>
                          <TableCell>Количество</TableCell>
                          <TableCell>Цена</TableCell>
                          <TableCell>Сумма</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(!selectedOrder?.services || selectedOrder.services.length === 0) ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              Нет услуг в заказе
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectedOrder.services.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.Teenused?.nimetus || '—'}</TableCell>
                              <TableCell>{item.arv || 0}</TableCell>
                              <TableCell>{formatPrice(item.Teenused?.hind || 0)}</TableCell>
                              <TableCell>{formatPrice((item.Teenused?.hind || 0) * (item.arv || 0))}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)}>Закрыть</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Orders; 