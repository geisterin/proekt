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
import { klientAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nimi: '',
    perekonnanimi: '',
    email: '',
    telefon: '',
    aadress: '',
  });
  const [newClientId, setNewClientId] = useState<number | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await klientAPI.getClients();
        setClients(response.data);
      } catch (err: any) {
        setError('Ошибка при загрузке клиентов');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleOpenDialog = () => {
    setFormData({ nimi: '', perekonnanimi: '', email: '', telefon: '', aadress: '' });
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const response = await klientAPI.createClient(formData);
      setIsDialogOpen(false);
      const clientsResp = await klientAPI.getClients();
      setClients(clientsResp.data);
      setNewClientId(response.data.klient_id);
      setTimeout(() => setNewClientId(null), 2000);
    } catch (e) {
      alert('Ошибка при добавлении клиента');
    }
  };

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
          Клиенты
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleOpenDialog}
        >
          Добавить клиента
        </Button>
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
                  <TableCell>Адрес</TableCell>
                  <TableCell>Дата регистрации</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.klient_id}>
                    <TableCell>{client.klient_id}</TableCell>
                    <TableCell>{client.nimi}</TableCell>
                    <TableCell>{client.perekonnanimi}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.telefon}</TableCell>
                    <TableCell>{client.aadress || '—'}</TableCell>
                    <TableCell>{new Date(client.reg_kuupaev).toLocaleString('ru-RU')}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/manager/chat/${client.klient_id}`)}
                      >
                        Чат
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить клиента</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Имя" name="nimi" value={formData.nimi} onChange={handleInputChange} fullWidth />
            <TextField label="Фамилия" name="perekonnanimi" value={formData.perekonnanimi} onChange={handleInputChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />
            <TextField label="Телефон" name="telefon" value={formData.telefon} onChange={handleInputChange} fullWidth />
            <TextField label="Адрес" name="aadress" value={formData.aadress} onChange={handleInputChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
      {newClientId && navigate(`/manager/chat/${newClientId}`)}
    </Layout>
  );
};

export default Clients; 