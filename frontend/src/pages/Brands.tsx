import { useEffect, useState } from 'react';
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
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { brandAPI } from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

const Brands = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const canEdit = user?.roll === 'Manager' || user?.roll === 'SalesManager';
  const navigate = useNavigate();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editBrand, setEditBrand] = useState<any | null>(null);
  const [form, setForm] = useState({ nimi: '', kirjeldus: '' });

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await brandAPI.getBrands();
      setBrands(response.data);
    } catch (err) {
      setError('Ошибка при загрузке брендов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleOpenDialog = (brand?: any) => {
    if (brand) {
      setEditBrand(brand);
      setForm({ nimi: brand.nimi, kirjeldus: brand.kirjeldus });
    } else {
      setEditBrand(null);
      setForm({ nimi: '', kirjeldus: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditBrand(null);
    setForm({ nimi: '', kirjeldus: '' });
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editBrand) {
        await brandAPI.updateBrand(editBrand.brand_id, form);
      } else {
        await brandAPI.createBrand(form);
      }
      handleCloseDialog();
      fetchBrands();
    } catch (err) {
      setError('Ошибка при сохранении бренда');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить бренд?')) {
      try {
        await brandAPI.deleteBrand(id);
        fetchBrands();
      } catch (err) {
        setError('Ошибка при удалении бренда');
      }
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => navigate(canEdit ? '/manager' : '/client')}
        >
          ← Назад
        </Button>
        <Typography variant="h4" gutterBottom>Бренды</Typography>
        {canEdit && (
          <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>
            Добавить бренд
          </Button>
        )}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Описание</TableCell>
                  {canEdit && <TableCell>Действия</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.brand_id}>
                    <TableCell>{brand.brand_id}</TableCell>
                    <TableCell>{brand.nimi}</TableCell>
                    <TableCell>{brand.kirjeldus}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <IconButton size="small" onClick={() => handleOpenDialog(brand)}><EditIcon /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(brand.brand_id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Модалка для добавления/редактирования бренда */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
          <DialogTitle>{editBrand ? 'Редактировать бренд' : 'Добавить бренд'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Название"
              name="nimi"
              value={form.nimi}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Описание"
              name="kirjeldus"
              value={form.kirjeldus}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editBrand ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Brands; 