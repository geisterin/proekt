import { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { Box, Typography, TextField, Button, Paper, CircularProgress } from '@mui/material';

interface ChatWithManagerProps {
  klientId: number;
  managerId: number;
  userRole: 'klient' | 'manager';
}

const ChatWithManager = ({ klientId, managerId, userRole }: ChatWithManagerProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Получить историю сообщений
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/sms/klient/${klientId}`);
      setMessages(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Можно добавить setInterval для автообновления
    // const interval = setInterval(fetchMessages, 5000);
    // return () => clearInterval(interval);
  }, [klientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправить сообщение
  const sendMessage = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post('/sms', {
        klient_id: klientId,
        tootaja_id: managerId,
        tekst: text
      });
      setText('');
      await fetchMessages();
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper sx={{ p: 2, maxWidth: 500, mx: 'auto', mt: 4 }} elevation={3}>
      <Typography variant="h6" gutterBottom>Чат с менеджером</Typography>
      <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2, bgcolor: '#f9f9f9', p: 1, borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={24} /></Box>
        ) : messages.length === 0 ? (
          <Typography color="text.secondary">Нет сообщений</Typography>
        ) : (
          messages.map(msg => (
            <Box
              key={msg.sms_id}
              sx={{
                textAlign: msg.klient_id === klientId ? (userRole === 'klient' ? 'right' : 'left') : (userRole === 'manager' ? 'right' : 'left'),
                mb: 1
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <b>{msg.klient_id === klientId ? (userRole === 'klient' ? 'Вы' : 'Клиент') : (userRole === 'manager' ? 'Вы' : 'Менеджер')}:</b> {msg.tekst}
              </Typography>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
          mt: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Введите сообщение..."
          value={text}
          onChange={e => setText(e.target.value)}
          multiline
          minRows={3}
          maxRows={5}
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={sending}
          sx={{
            bgcolor: '#f8f9fa',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={sending || !text.trim()}
          sx={{
            minWidth: '110px',
            height: 'fit-content',
            alignSelf: 'stretch',
          }}
        >
          Отправить
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatWithManager; 