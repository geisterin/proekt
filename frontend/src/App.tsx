import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ErrorSnackbar from './components/ErrorSnackbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Brands from './pages/Brands';
import Workers from './pages/Workers';
import ManagerChat from './pages/ManagerChat';
import ClientChat from './pages/ClientChat';
import ClientProducts from './pages/ClientProducts';
import NewOrder from './pages/NewOrder';
import Teenused from './pages/Teenused';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <Router>
          <ErrorSnackbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/client" element={
              <PrivateRoute role="klient">
                <ClientDashboard />
              </PrivateRoute>
            } />
            <Route path="/client/orders" element={
              <PrivateRoute role="klient">
                <Orders />
              </PrivateRoute>
            } />
            <Route path="/client/new-order" element={
              <PrivateRoute role="klient">
                <NewOrder />
              </PrivateRoute>
            } />
            <Route path="/client/chat" element={
              <PrivateRoute role="klient">
                <ClientChat />
              </PrivateRoute>
            } />
            <Route path="/client/products" element={
              <PrivateRoute role="klient">
                <ClientProducts />
              </PrivateRoute>
            } />
            <Route path="/client/services" element={
              <PrivateRoute role="klient">
                <Teenused />
              </PrivateRoute>
            } />
            <Route path="/manager" element={
              <PrivateRoute role="tootaja">
                <ManagerDashboard />
              </PrivateRoute>
            } />
            <Route path="/manager/orders" element={
              <PrivateRoute role="tootaja">
                <Orders />
              </PrivateRoute>
            } />
            <Route path="/manager/products" element={
              <PrivateRoute role="tootaja">
                <Products />
              </PrivateRoute>
            } />
            <Route path="/manager/clients" element={
              <PrivateRoute role="tootaja">
                <Clients />
              </PrivateRoute>
            } />
            <Route path="/manager/workers" element={
              <PrivateRoute role="tootaja">
                <Workers />
              </PrivateRoute>
            } />
            <Route path="/brands" element={<Brands />} />
            <Route path="/manager/brands" element={
              <PrivateRoute role="tootaja">
                <Brands />
              </PrivateRoute>
            } />
            <Route path="/manager/chat/:klientId" element={
              <PrivateRoute role="tootaja">
                <ManagerChat />
              </PrivateRoute>
            } />
            <Route path="/manager/services" element={
              <PrivateRoute role="tootaja">
                <Teenused />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
