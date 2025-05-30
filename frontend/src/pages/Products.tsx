import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { productAPI } from '../services/api';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { STATIC_URL } from '../config';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    nimetus: '',
    kirjeldus: '',
    standart_suurus: '',
    toode_pilt: '',
    tuup: '',
    brand_id: '',
    hind: '',
    kuupaev: new Date().toISOString().split('T')[0],
  });
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const isManager = user?.userType === 'tootaja';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isManager) {
      navigate('/client/products');
      return;
    }
    fetchProducts();
  }, [isManager, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    }
  };

  const handleOpenDialog = (product?: any) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        nimetus: product.nimetus,
        kirjeldus: product.kirjeldus,
        standart_suurus: product.standart_suurus,
        toode_pilt: product.toode_pilt || '',
        tuup: product.tuup,
        brand_id: product.brand_id,
        hind: product.hind || '',
        kuupaev: new Date().toISOString().split('T')[0],
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        nimetus: '',
        kirjeldus: '',
        standart_suurus: '',
        toode_pilt: '',
        tuup: '',
        brand_id: '',
        hind: '',
        kuupaev: new Date().toISOString().split('T')[0],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setFormData({
      nimetus: '',
      kirjeldus: '',
      standart_suurus: '',
      toode_pilt: '',
      tuup: '',
      brand_id: '',
      hind: '',
      kuupaev: new Date().toISOString().split('T')[0],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      console.log('Ответ от сервера:', data);
      console.log('Загружена картинка:', data.path);
      setFormData((prev) => ({
        ...prev,
        toode_pilt: data.path,
      }));
    } catch (err) {
      alert('Ошибка загрузки файла');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.toode_pilt) {
        alert('Картинка не загружена. Сначала выберите изображение.');
        return;
      }

      const productData = {
        ...formData,
        hind: formData.hind ? parseFloat(formData.hind) : undefined,
        kuupaev: formData.kuupaev || new Date().toISOString().split('T')[0],
      };
      
      console.log('Отправка товара:', productData);

      if (selectedProduct) {
        const response = await productAPI.updateProduct(selectedProduct.toode_id, productData);
        // Обновляем цену в списке товаров
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.toode_id === selectedProduct.toode_id 
              ? { ...p, hind: response.data.hind }
              : p
          )
        );
      } else {
        await productAPI.createProduct(productData);
      }

      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
    }
  };

  const handleDelete = async (toode_id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await productAPI.deleteProduct(toode_id);
        fetchProducts();
      } catch (error) {
        console.error('Ошибка при удалении товара:', error);
      }
    }
  };

  // Функция для обрезки описания до 4-5 слов
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

  const chunkArray = (arr, size) => {
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
          onClick={() => navigate('/manager')}
        >
          ← Назад
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">Управление товарами</Typography>
          {isManager && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Добавить товар
            </Button>
          )}
        </Box>

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
                  {isManager && (
                    <Box sx={{
                      display: 'flex',
                      gap: 1,
                      position: 'absolute',
                      bottom: 8,
                      left: 16,
                    }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(product);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.toode_id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowUpwardIcon />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Наверх
          </Button>
        </Box>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedProduct ? 'Редактировать товар' : 'Добавить товар'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {isManager && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginBottom: 16 }}
                  />
                  {formData.toode_pilt && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <img
                        src={getImageUrl(formData.toode_pilt)}
                        alt="Превью"
                        style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }}
                      />
                      <Button
                        color="error"
                        size="small"
                        onClick={() => setFormData({ ...formData, toode_pilt: '' })}
                        sx={{ ml: 2 }}
                      >
                        Удалить картинку
                      </Button>
                    </Box>
                  )}
                </>
              )}
              <TextField
                fullWidth
                label="Название"
                name="nimetus"
                value={formData.nimetus}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Описание"
                name="kirjeldus"
                value={formData.kirjeldus}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <TextField
                fullWidth
                label="Размер"
                name="standart_suurus"
                value={formData.standart_suurus}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Тип"
                name="tuup"
                value={formData.tuup}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="ID бренда"
                name="brand_id"
                value={formData.brand_id}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Цена"
                name="hind"
                type="number"
                value={formData.hind}
                onChange={handleInputChange}
                margin="normal"
                required
                inputProps={{ step: "0.01", min: "0" }}
              />
              <TextField
                fullWidth
                label="Дата изменения цены"
                name="kuupaev"
                type="date"
                value={formData.kuupaev}
                onChange={handleInputChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedProduct ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </Dialog>

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
    </Layout>
  );
};

export default Products; 