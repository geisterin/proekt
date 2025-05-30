import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ChatWithManager from '../components/ChatWithManager';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ManagerChat = () => {
  const { klientId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const managerId = user?.tootaja_id;
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    // Можно получить имя клиента с бэка, если нужно
    // fetch(`/api/klient/${klientId}`).then(...)
  }, [klientId]);

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/manager/clients')} sx={{ mb: 2 }}>
          ← Назад
        </Button>
        <Typography variant="h5" gutterBottom>
          Чат с клиентом {clientName || klientId}
        </Typography>
        {klientId && (
          <ChatWithManager klientId={Number(klientId)} managerId={managerId || 1} userRole="manager" />
        )}
      </Box>
    </Layout>
  );
};

export default ManagerChat; 