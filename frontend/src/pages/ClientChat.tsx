import Layout from '../components/Layout';
import ChatWithManager from '../components/ChatWithManager';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ClientChat = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/client')} sx={{ mb: 2 }}>
          ← Назад
        </Button>
        <Typography variant="h5" gutterBottom>
          Чат с менеджером
        </Typography>
        {user?.id && (
          <ChatWithManager klientId={user.id} managerId={1} userRole="klient" />
        )}
      </Box>
    </Layout>
  );
};

export default ClientChat; 