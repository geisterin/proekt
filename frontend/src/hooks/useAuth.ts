import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/index';
import { setCredentials, logout, setError, setLoading } from '../store/authSlice';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await authAPI.login(email, password);
      dispatch(setCredentials(response.data));
      const userType = response.data.user.userType;
      if (userType === 'klient') {
        navigate('/client');
      } else if (userType === 'tootaja') {
        navigate('/manager');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка входа'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (
    email: string,
    parool: string,
    nimi: string,
    perekonnanimi?: string,
    telefon?: string,
    aadress?: string
  ) => {
    try {
      dispatch(setLoading(true));
      await authAPI.register(email, parool, nimi, perekonnanimi, telefon, aadress);
      await login(email, parool);
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка регистрации'));
      dispatch(setLoading(false));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
  };
}; 