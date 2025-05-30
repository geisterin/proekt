export interface User {
  id: number;
  email: string;
  roll: 'client' | 'klient' | 'manager' | 'tootaja';
  name?: string;
  userType: string; // 'klient' | 'tootaja'
}

export interface Product {
  id: number;
  name: string;
  nimetus: string;
  description: string;
  price: number;
  imageUrl?: string;
  hind: number;
}

export interface Order {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export interface Service {
  id: number;
  name: string;
  nimetus: string;
  description?: string;
  price: number;
}

export interface OrderProduct {
  toode_id: number;
  arv: number;
}

export interface OrderService {
  teenused_id: number;
  arv: number;
}

// Здесь можно добавить другие интерфейсы (Product, Order и т.д.) по мере необходимости 