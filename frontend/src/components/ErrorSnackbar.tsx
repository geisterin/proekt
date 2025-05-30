import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setError } from '../store/authSlice';

const ErrorSnackbar = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(setError(null));
  };

  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar; 