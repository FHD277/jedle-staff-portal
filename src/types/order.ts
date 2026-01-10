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

// Mock data for demonstration
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '047',
    status: 'pending',
    type: 'pickup',
    customer: {
      name: 'أحمد محمد',
      phone: '+966 512 345 678',
      email: 'ahmed@email.com',
    },
    items: [
      {
        id: 'i1',
        name: 'Spanish Latte',
        nameAr: 'سبانش لاتيه',
        quantity: 2,
        price: 25,
        modifiers: [
          { name: 'Oat Milk', nameAr: 'حليب شوفان', price: 3 },
          { name: 'Extra Shot', nameAr: 'شوت إضافي', price: 4 },
        ],
      },
      {
        id: 'i2',
        name: 'Cheese Croissant',
        nameAr: 'كرواسون جبنة',
        quantity: 2,
        price: 8,
        notes: 'سخنوه من فضلكم',
      },
      {
        id: 'i3',
        name: 'Date Cake',
        nameAr: 'كيكة التمر',
        quantity: 1,
        price: 12.83,
      },
    ],
    subtotal: 77.39,
    tax: 11.61,
    total: 89,
    paymentMethod: 'apple_pay',
    isPaid: true,
    notes: 'أرجو عدم وضع سكر في القهوة',
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: '2',
    orderNumber: '046',
    status: 'pending',
    type: 'pickup',
    customer: {
      name: 'سارة علي',
      phone: '+966 555 123 456',
    },
    items: [
      {
        id: 'i4',
        name: 'Cappuccino',
        nameAr: 'كابتشينو',
        quantity: 1,
        price: 18,
      },
      {
        id: 'i5',
        name: 'Chocolate Muffin',
        nameAr: 'مافن شوكولاتة',
        quantity: 2,
        price: 17,
      },
    ],
    subtotal: 45.22,
    tax: 6.78,
    total: 52,
    paymentMethod: 'card',
    isPaid: true,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '3',
    orderNumber: '045',
    status: 'pending',
    type: 'dinein',
    tableNumber: 7,
    customer: {
      name: 'محمد خالد',
      phone: '+966 500 999 888',
    },
    items: [
      {
        id: 'i6',
        name: 'Iced Americano',
        nameAr: 'أمريكانو مثلج',
        quantity: 2,
        price: 15,
      },
      {
        id: 'i7',
        name: 'Club Sandwich',
        nameAr: 'كلوب ساندويتش',
        quantity: 1,
        price: 35,
      },
    ],
    subtotal: 56.52,
    tax: 8.48,
    total: 65,
    paymentMethod: 'mada',
    isPaid: true,
    createdAt: new Date(Date.now() - 1 * 60 * 1000),
  },
  {
    id: '4',
    orderNumber: '044',
    status: 'preparing',
    type: 'pickup',
    customer: {
      name: 'نورة أحمد',
      phone: '+966 533 222 111',
    },
    items: [
      {
        id: 'i8',
        name: 'Caramel Macchiato',
        nameAr: 'كراميل ماكياتو',
        quantity: 3,
        price: 22,
      },
      {
        id: 'i9',
        name: 'Blueberry Cheesecake',
        nameAr: 'تشيز كيك توت',
        quantity: 2,
        price: 28,
      },
    ],
    subtotal: 135.65,
    tax: 20.35,
    total: 156,
    paymentMethod: 'apple_pay',
    isPaid: true,
    createdAt: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: '5',
    orderNumber: '043',
    status: 'preparing',
    type: 'dinein',
    tableNumber: 5,
    customer: {
      name: 'فهد العتيبي',
      phone: '+966 544 333 222',
    },
    items: [
      {
        id: 'i10',
        name: 'Flat White',
        nameAr: 'فلات وايت',
        quantity: 2,
        price: 20,
      },
      {
        id: 'i11',
        name: 'Avocado Toast',
        nameAr: 'توست أفوكادو',
        quantity: 1,
        price: 32,
      },
    ],
    subtotal: 62.61,
    tax: 15.39,
    total: 78,
    paymentMethod: 'card',
    isPaid: true,
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: '6',
    orderNumber: '042',
    status: 'ready',
    type: 'pickup',
    customer: {
      name: 'ليلى محمود',
      phone: '+966 566 777 888',
    },
    items: [
      {
        id: 'i12',
        name: 'Matcha Latte',
        nameAr: 'ماتشا لاتيه',
        quantity: 1,
        price: 24,
      },
      {
        id: 'i13',
        name: 'Protein Ball',
        nameAr: 'كرات البروتين',
        quantity: 2,
        price: 10.5,
      },
    ],
    subtotal: 39.13,
    tax: 5.87,
    total: 45,
    paymentMethod: 'mada',
    isPaid: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
];
