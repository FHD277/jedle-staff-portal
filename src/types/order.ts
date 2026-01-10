export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type OrderType = 'pickup' | 'dinein' | 'delivery';

export type PaymentMethod = 'cash' | 'card' | 'apple_pay' | 'mada';

export interface OrderItem {
  id: string;
  name: string;
  nameAr: string;
  quantity: number;
  price: number;
  modifiers?: {
    name: string;
    nameAr: string;
    price: number;
  }[];
  notes?: string;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  notes?: string;
  tableNumber?: number;
  createdAt: Date;
  estimatedTime?: Date;
}