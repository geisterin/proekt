import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { teenusedAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Teenused = ({ onAddToOrder }: { onAddToOrder?: (teenus: any) => void }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isManager = user?.userType === 'tootaja';
  const [teenused, setTeenused] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeenus, setSelectedTeenus] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    nimetus: '',
    hind: '',
  });

  useEffect(() => {
    fetchTeenused();
  }, []);

  const fetchTeenused = async () => {
    try {
      const response = await teenusedAPI.getTeenused();
      setTeenused(response.data);
    } catch (error) {
      // обработка ошибки
    }
  };

  const handleOpenDialog = (teenus?: any) => {
    if (teenus) {
      setSelectedTeenus(teenus);
      setFormData({
        nimetus: teenus.nimetus,
        hind: teenus.hind,
      });
    } else {
      setSelectedTeenus(null);
      setFormData({ nimetus: '', hind: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTeenus(null);
    setFormData({ nimetus: '', hind: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (selectedTeenus) {
        await teenusedAPI.updateTeenus(selectedTeenus.teenused_id, formData);
      } else {
        await teenusedAPI.createTeenus(formData);
      }
      handleCloseDialog();
      fetchTeenused();
    } catch (e) {
      alert('Ошибка при сохранении услуги');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить услугу?')) {
      try {
        await teenusedAPI.deleteTeenus(id);
        fetchTeenused();
      } catch (e) {
        alert('Ошибка при удалении');
      }
    }
  };

  // Функция для получения пути к иконке по id услуги
  const getIconForTeenus = (teenus: any) => {
    return `/images/service-${teenus.teenused_id}.png`;
  };

  return (
    <Layout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => navigate(isManager ? '/manager' : '/client')}
        >
          ← Назад
        </Button>
        <Typography variant="h4" gutterBottom>
          Услуги
        </Typography>
        {isManager && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Добавить услугу
          </Button>
        )}
      </Box>
      <Grid container spacing={4}>
        {teenused.map((teenus) => (
          <Grid item xs={12} sm={6} md={4} key={teenus.teenused_id}>
            <Card sx={{ minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardMedia
                component="img"
                height="120"
                image={getIconForTeenus(teenus)}
                alt={teenus.nimetus}
                sx={{ objectFit: 'contain', backgroundColor: '#fafafa', width: 120, mt: 2 }}
                onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/service-placeholder.png'; }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>{teenus.nimetus}</Typography>
                {isManager && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    ID: {teenus.teenused_id}
                  </Typography>
                )}
                <Typography color="text.secondary" paragraph>Цена: {teenus.hind} €</Typography>
                {isManager && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenDialog(teenus)}><EditIcon /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(teenus.teenused_id)}><DeleteIcon /></IconButton>
                  </Box>
                )}
                {!isManager && onAddToOrder && (
                  <Button variant="outlined" onClick={() => onAddToOrder(teenus)} fullWidth>
                    Добавить в заказ
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTeenus ? 'Редактировать услугу' : 'Добавить услугу'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Название" name="nimetus" value={formData.nimetus} onChange={handleInputChange} fullWidth />
            <TextField label="Цена (€)" name="hind" value={formData.hind} onChange={handleInputChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedTeenus ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Teenused; 