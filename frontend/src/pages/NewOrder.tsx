import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Checkbox,
} from '@mui/material';
import Layout from '../components/Layout';
import { productAPI, teenusedAPI } from '../services/api';
import type { Product, Service, OrderProduct, OrderService } from '../types';
import type { RootState } from '../store';

const steps = ['Выбор товаров', 'Детали заказа', 'Подтверждение'];

const NewOrder = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: { selected: boolean; quantity: number };
  }>({});
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<{
    [key: number]: { selected: boolean; quantity: number };
  }>({});
  const [months, setMonths] = useState(1);
  const [orderResult, setOrderResult] = useState<null | { message: string; tellimus_id: number; summa: string }>(null);
  const [orderDetails, setOrderDetails] = useState({
    address: '',
    installationDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!user || user.userType !== 'klient') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        const formattedProducts = response.data.map((product: any) => ({
          ...product,
          id: product.toode_id,
          hind: parseFloat(product.hind),
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await teenusedAPI.getTeenused();
        const formattedServices = response.data.map((service: any) => ({
          ...service,
          id: service.teenused_id,
        }));
        setServices(formattedServices);
      } catch (error) {
        console.error('Ошибка при загрузке услуг:', error);
      }
    };
    fetchServices();
  }, []);

  const handleProductCheckbox = (productId: number, checked: boolean) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        selected: checked,
        quantity: checked ? 1 : 0,
      },
    }));
  };

  const handleServiceCheckbox = (serviceId: number, checked: boolean) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: {
        selected: checked,
        quantity: checked ? 1 : 0,
      },
    }));
  };

  const handleProductSelect = (productId: number, quantity: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity,
      },
    }));
  };

  const handleServiceSelect = (serviceId: number, quantity: number) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        quantity,
      },
    }));
  };

  const handleOrderDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonths(Number(e.target.value));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const tooted: OrderProduct[] = Object.entries(selectedProducts)
        .filter(([_, v]) => v.selected && v.quantity > 0)
        .map(([toode_id, v]) => ({ toode_id: Number(toode_id), arv: v.quantity }));
      const teenused: OrderService[] = Object.entries(selectedServices)
        .filter(([_, v]) => v.selected && v.quantity > 0)
        .map(([teenused_id, v]) => ({ teenused_id: Number(teenused_id), arv: v.quantity }));
      const orderData = {
        kuu_arv: months,
        tooted,
        teenused,
      };
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tellimus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Ошибка при создании заказа');
      const data = await res.json();
      setOrderResult(data);
    } catch (error) {
      alert('Ошибка при создании заказа');
    }
  };

  // Сумма по товарам
  const totalProducts = Object.entries(selectedProducts).reduce((sum, [productId, v]) => {
    const product = products.find((p) => p.id === Number(productId));
    if (product && v.selected && v.quantity > 0) {
      return sum + v.quantity * product.hind;
    }
    return sum;
  }, 0);

  // Сумма по услугам
  const totalServices = Object.entries(selectedServices).reduce((sum, [serviceId, v]) => {
    const service = services.find((s) => s.id === Number(serviceId));
    if (service && v.selected && v.quantity > 0) {
      return sum + v.quantity * (service.hind || 0);
    }
    return sum;
  }, 0);

  const totalSum = totalProducts + totalServices;

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>Товары</Typography>
            <Box sx={{ mb: 4 }}>
              {products.map((product) => (
                <Box key={product.id} display="flex" alignItems="center" mb={2}>
                  <Checkbox
                    checked={selectedProducts[product.id]?.selected || false}
                    onChange={(e) => handleProductCheckbox(product.id, e.target.checked)}
                  />
                  <Typography sx={{ minWidth: 200 }}>{product.nimetus}</Typography>
                  <TextField
                    type="number"
                    label="Количество"
                    name={`product-qty-${product.id}`}
                    value={selectedProducts[product.id]?.quantity || ''}
                    onChange={(e) => handleProductSelect(product.id, Number(e.target.value))}
                    disabled={!selectedProducts[product.id]?.selected}
                    sx={{ width: 100, ml: 2 }}
                    inputProps={{ min: 1 }}
                  />
                  <Typography sx={{ ml: 2 }}>{product.hind} €</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Услуги</Typography>
            <Box>
              {services.map((service) => (
                <Box key={service.id} display="flex" alignItems="center" mb={2}>
                  <Checkbox
                    checked={selectedServices[service.id]?.selected || false}
                    onChange={(e) => handleServiceCheckbox(service.id, e.target.checked)}
                  />
                  <Typography sx={{ minWidth: 200 }}>{service.nimetus}</Typography>
                  <TextField
                    type="number"
                    label="Количество"
                    name={`service-qty-${service.id}`}
                    value={selectedServices[service.id]?.quantity || ''}
                    onChange={(e) => handleServiceSelect(service.id, Number(e.target.value))}
                    disabled={!selectedServices[service.id]?.selected}
                    sx={{ width: 100, ml: 2 }}
                    inputProps={{ min: 1 }}
                  />
                  <Typography sx={{ ml: 2 }}>{service.hind ? `${service.hind} €` : '—'}</Typography>
                </Box>
              ))}
            </Box>
          </>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Количество месяцев оплаты"
                type="number"
                value={months}
                onChange={handleMonthsChange}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Подтверждение заказа
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Пожалуйста, проверьте детали заказа перед подтверждением
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Выбранные товары:</Typography>
                {Object.entries(selectedProducts).map(([productId, v]) => {
                  const product = products.find((p) => p.id === Number(productId));
                  return (
                    product && v.selected && v.quantity > 0 && (
                      <Typography key={productId}>
                        {product.nimetus} - {v.quantity} x {product.hind} € = {(v.quantity * product.hind).toFixed(2)} €
                      </Typography>
                    )
                  );
                })}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Выбранные услуги:</Typography>
                {Object.entries(selectedServices).map(([serviceId, v]) => {
                  const service = services.find((s) => s.id === Number(serviceId));
                  return (
                    service && v.selected && v.quantity > 0 && (
                      <Typography key={serviceId}>
                        {service.nimetus} - {v.quantity} x {service.hind ? `${service.hind} €` : '—'} = {(v.quantity * (service.hind || 0)).toFixed(2)} €
                      </Typography>
                    )
                  );
                })}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Количество месяцев: {months}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Общая сумма заказа: {totalSum.toFixed(2)} €
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  if (orderResult) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Alert severity="success" sx={{ mb: 2 }}>{orderResult.message}</Alert>
          <Typography variant="h5" gutterBottom>Номер заказа: {orderResult.tellimus_id}</Typography>
          <Typography variant="h6">Сумма: {orderResult.summa} ₽</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => navigate('/client')}
          >
            В кабинет
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => navigate(-1)}
        >
          ← Назад
        </Button>
        <Typography variant="h4" gutterBottom>
          Новый заказ
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Назад
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Подтвердить заказ
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Далее
            </Button>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default NewOrder; 