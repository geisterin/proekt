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
  CircularProgress,
  Button,
} from '@mui/material';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWithManager from '../components/ChatWithManager';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { workerAPI } from '../services/api';

const Workers = () => {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canEdit = user?.roll === 'Manager' || user?.roll === 'SalesManager';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    nimi: '',
    perekonnanimi: '',
    email: '',
    telefon: '',
    roll_nimi: '',
  });

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workerAPI.getWorkers();
      setWorkers(response.data);
    } catch (err: any) {
      setError('Ошибка при загрузке работников');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (worker?: any) => {
    if (worker) {
      setSelectedWorker(worker);
      setFormData({
        nimi: worker.nimi || '',
        perekonnanimi: worker.perekonnanimi || '',
        email: worker.email || '',
        telefon: worker.telefon || '',
        roll_nimi: worker.Roll?.roll_nimi || '',
      });
    } else {
      setSelectedWorker(null);
      setFormData({ nimi: '', perekonnanimi: '', email: '', telefon: '', roll_nimi: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (selectedWorker) {
        await workerAPI.updateWorker(selectedWorker.tootaja_id, formData);
      } else {
        await workerAPI.createWorker(formData);
      }
      setIsDialogOpen(false);
      fetchWorkers();
    } catch (e) {
      alert('Ошибка при сохранении работника');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить работника?')) {
      try {
        await workerAPI.deleteWorker(id);
        fetchWorkers();
      } catch (e) {
        alert('Ошибка при удалении');
      }
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

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
        <Typography variant="h4" gutterBottom>
          Работники
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Имя</TableCell>
                  <TableCell>Фамилия</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Роль</TableCell>
                  {canEdit && <TableCell>Действия</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.tootaja_id}>
                    <TableCell>{worker.tootaja_id}</TableCell>
                    <TableCell>{worker.nimi}</TableCell>
                    <TableCell>{worker.perekonnanimi}</TableCell>
                    <TableCell>{worker.email}</TableCell>
                    <TableCell>{worker.telefon}</TableCell>
                    <TableCell>{worker.Roll ? worker.Roll.roll_nimi : '—'}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <IconButton size="small" onClick={() => handleOpenDialog(worker)}><EditIcon /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(worker.tootaja_id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={() => handleOpenDialog()}
          >
            Добавить работника
          </Button>
        )}
      </Container>
      {user?.tootaja_id && (
        <ChatWithManager klientId={1} managerId={user.tootaja_id} userRole="manager" />
      )}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedWorker ? 'Редактировать работника' : 'Добавить работника'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Имя" name="nimi" value={formData.nimi} onChange={handleInputChange} fullWidth />
            <TextField label="Фамилия" name="perekonnanimi" value={formData.perekonnanimi} onChange={handleInputChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />
            <TextField label="Телефон" name="telefon" value={formData.telefon} onChange={handleInputChange} fullWidth />
            <TextField label="Роль" name="roll_nimi" value={formData.roll_nimi} onChange={handleInputChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedWorker ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Workers; 