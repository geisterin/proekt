import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { productAPI } from '../services/api';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fab, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { STATIC_URL } from '../config';

const ClientProducts = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<any[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any | null>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Если пользователь не клиент, перенаправляем на страницу менеджера
    if (user?.userType === 'tootaja') {
      navigate('/manager/products');
      return;
    }
    fetchProducts();
  }, [user?.userType, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      // Можно добавить уведомление об ошибке
      console.error('Ошибка при загрузке товаров:', error);
    }
  };

  const getShortDescription = (text: string) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 4) return text;
    return words.slice(0, 4).join(' ') + '...';
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path || path.trim() === '') {
      return 'https://via.placeholder.com/250x200?text=Нет+фото';
    }
    // Убираем возможное дублирование URL
    const cleanPath = path.replace(/^https?:\/\/[^/]+/, '');
    return `${STATIC_URL}${cleanPath}`;
  };

  // Разбиваем товары на строки по 3
  const chunkArray = (arr: any[], size: number) => {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size));
    }
    return res;
  };
  const productRows = chunkArray(products, 3);

  return (
    <Layout>
      <Container maxWidth="lg">
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => navigate('/client')}
        >
          ← Назад
        </Button>
        <Typography variant="h4" gutterBottom>
          Каталог товаров
        </Typography>
        {/* Карточки товаров по 3 в строке */}
        {productRows.map((row, rowIdx) => (
          <Grid
            container
            spacing={4}
            key={rowIdx}
            justifyContent="center"
            sx={{ mb: rowIdx !== productRows.length - 1 ? 6 : 0 }}
          >
            {row.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.toode_id}>
                <Card
                  sx={{
                    height: 420,
                    width: 320,
                    minWidth: 320,
                    maxWidth: 320,
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 6 },
                  }}
                  onClick={() => {
                    setViewProduct(product);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      maxWidth: 300,
                      height: 180,
                      objectFit: 'contain',
                      backgroundColor: '#fafafa',
                      p: 1,
                      mb: 1,
                      margin: '0 auto',
                    }}
                    image={getImageUrl(product.toode_pilt)}
                    alt={product.nimetus}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/250x200?text=Ошибка+загрузки';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, minHeight: 140, p: 2 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {product.nimetus}
                    </Typography>
                    <Typography color="text.secondary" paragraph sx={{
                      maxHeight: 40,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {getShortDescription(product.kirjeldus)}
                    </Typography>
                    <Typography color="text.secondary">
                      Размер: {product.standart_suurus}
                    </Typography>
                    <Typography color="text.secondary">
                      Тип: {product.tuup}
                    </Typography>
                    <Typography color="text.secondary">
                      Бренд: {product.brand_id}
                    </Typography>
                    <Typography color="text.secondary">
                      Цена: {product.hind} €
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {/* Если последняя строка и карточек меньше 3 — добавляем пустые */}
            {rowIdx === productRows.length - 1 && row.length < 3 &&
              Array.from({ length: 3 - row.length }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={`empty-${idx}`} />
              ))
            }
          </Grid>
        ))}
        {/* Модальное окно для просмотра товара */}
        <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{viewProduct?.nimetus}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <img
                src={getImageUrl(viewProduct?.toode_pilt)}
                alt={viewProduct?.nimetus}
                style={{ maxWidth: 600, maxHeight: 400, borderRadius: 12, marginBottom: 24 }}
              />
              <Typography variant="body1" sx={{ mb: 2, fontSize: 18 }}>
                {viewProduct?.kirjeldus}
              </Typography>
              <Typography color="text.secondary" paragraph>
                Размер: {viewProduct?.standart_suurus}
              </Typography>
              <Typography color="text.secondary" paragraph>
                Тип: {viewProduct?.tuup}
              </Typography>
              <Typography color="text.secondary" paragraph>
                Бренд: {viewProduct?.brand_id}
              </Typography>
              <Typography color="text.secondary" paragraph>
                Цена: {viewProduct?.hind} €
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsViewDialogOpen(false)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </Container>
      {/* Кнопка "Наверх" */}
      <Fab
        color="primary"
        size="small"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Layout>
  );
};

export default ClientProducts; 