import { useState, useMemo } from 'react';
import { Order, OrderStatus, mockOrders } from '@/types/order';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardHeader } from './DashboardHeader';
import { OrderColumn } from './OrderColumn';
import { OrderDetailModal } from './OrderDetailModal';
import { SettingsModal } from './SettingsModal';
import { toast } from 'sonner';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Group orders by status
  const ordersByStatus = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === 'pending'),
      preparing: orders.filter(o => o.status === 'preparing' || o.status === 'confirmed'),
      ready: orders.filter(o => o.status === 'ready'),
      completed: orders.filter(o => o.status === 'completed'),
    };
  }, [orders]);
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };
  
  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
    toast.success(language === 'ar' ? 'تم قبول الطلب' : 'Order accepted', {
      description: language === 'ar' ? 'تم نقل الطلب إلى قيد التحضير' : 'Order moved to preparing',
    });
    setShowOrderDetail(false);
  };
  
  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
    toast.error(language === 'ar' ? 'تم رفض الطلب' : 'Order rejected', {
      description: language === 'ar' ? 'سيتم إشعار العميل' : 'Customer will be notified',
    });
    setShowOrderDetail(false);
  };
  
  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
    toast.success(language === 'ar' ? 'الطلب جاهز!' : 'Order ready!', {
      description: language === 'ar' ? 'تم إشعار العميل' : 'Customer notified',
    });
    setShowOrderDetail(false);
  };
  
  const handleMarkCompleted = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    toast.success(language === 'ar' ? 'تم تسليم الطلب' : 'Order completed', {
      description: language === 'ar' ? 'شكراً لك!' : 'Thank you!',
    });
    setShowOrderDetail(false);
  };
  
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onLogout={onLogout}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 h-full">
          <OrderColumn
            status="pending"
            orders={ordersByStatus.pending}
            onOrderClick={handleOrderClick}
            onAccept={handleAccept}
            onReject={handleReject}
          />
          <OrderColumn
            status="preparing"
            orders={ordersByStatus.preparing}
            onOrderClick={handleOrderClick}
            onMarkReady={handleMarkReady}
          />
          <OrderColumn
            status="ready"
            orders={ordersByStatus.ready}
            onOrderClick={handleOrderClick}
            onMarkCompleted={handleMarkCompleted}
          />
          <OrderColumn
            status="completed"
            orders={ordersByStatus.completed}
            onOrderClick={handleOrderClick}
          />
        </div>
      </main>
      
      <OrderDetailModal
        order={selectedOrder}
        open={showOrderDetail}
        onClose={() => setShowOrderDetail(false)}
        onAccept={selectedOrder ? () => handleAccept(selectedOrder.id) : undefined}
        onReject={selectedOrder ? () => handleReject(selectedOrder.id) : undefined}
        onMarkReady={selectedOrder ? () => handleMarkReady(selectedOrder.id) : undefined}
        onMarkCompleted={selectedOrder ? () => handleMarkCompleted(selectedOrder.id) : undefined}
      />
      
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />
    </div>
  );
}
