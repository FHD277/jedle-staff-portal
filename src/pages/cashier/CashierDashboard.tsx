import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { DashboardHeader } from '@/components/cashier/DashboardHeader';
import { OrderColumn } from '@/components/cashier/OrderColumn';
import { OrderDetailModal } from '@/components/cashier/OrderDetailModal';
import { SettingsModal } from '@/components/cashier/SettingsModal';
import { CreateOrderModal } from '@/components/cashier/CreateOrderModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types/order';

export default function CashierDashboard() {
  const { logout, user } = useAuth();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Fetch orders from Supabase
  useEffect(() => {
    if (!user?.tenant_id) return;

    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `tenant_id=eq.${user.tenant_id}`,
        },
        (payload) => {
          console.log('Order update:', payload);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.tenant_id]);

  async function fetchOrders() {
    if (!user?.tenant_id) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('tenant_id', user.tenant_id)
        .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database orders to match Order type
      const transformedOrders: Order[] = (data || []).map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status as OrderStatus,
        type: order.order_type as 'pickup' | 'dinein' | 'delivery',
        customer: {
          name: order.customer_name || 'Guest',
          phone: order.customer_phone || '',
          email: order.customer_email,
        },
        items: Array.isArray(order.items) ? order.items.map((item: any) => ({
          id: item.id || Math.random().toString(),
          name: item.name || '',
          nameAr: item.name_ar || item.nameAr || '',
          quantity: item.quantity || 1,
          price: parseFloat(item.price || 0),
          modifiers: item.modifiers || [],
          notes: item.notes,
        })) : [],
        subtotal: parseFloat(order.subtotal || 0),
        tax: parseFloat(order.tax || 0),
        total: parseFloat(order.total || 0),
        paymentMethod: order.payment_method as 'cash' | 'card' | 'apple_pay' | 'mada',
        isPaid: order.payment_status === 'paid',
        notes: order.notes,
        tableNumber: order.table_number ? parseInt(order.table_number) : undefined,
        createdAt: new Date(order.created_at),
        estimatedTime: order.pickup_time ? new Date(order.pickup_time) : undefined,
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      return false;
    }
  }

  const handleAccept = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'preparing');
    if (success) {
      toast.success(language === 'ar' ? 'تم قبول الطلب' : 'Order accepted', {
        description: language === 'ar' ? 'تم نقل الطلب إلى قيد التحضير' : 'Order moved to preparing',
      });
      setShowOrderDetail(false);
    }
  };

  const handleReject = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'cancelled');
    if (success) {
      toast.error(language === 'ar' ? 'تم رفض الطلب' : 'Order rejected', {
        description: language === 'ar' ? 'سيتم إشعار العميل' : 'Customer will be notified',
      });
      setShowOrderDetail(false);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'ready');
    if (success) {
      toast.success(language === 'ar' ? 'الطلب جاهز!' : 'Order ready!', {
        description: language === 'ar' ? 'تم إشعار العميل' : 'Customer notified',
      });
      setShowOrderDetail(false);
    }
  };

  const handleMarkCompleted = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'completed');
    if (success) {
      toast.success(language === 'ar' ? 'تم تسليم الطلب' : 'Order completed', {
        description: language === 'ar' ? 'شكراً لك!' : 'Thank you!',
      });
      setShowOrderDetail(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === 'pending'),
    preparing: orders.filter((o) => o.status === 'preparing' || o.status === 'confirmed'),
    ready: orders.filter((o) => o.status === 'ready'),
    completed: orders.filter((o) => o.status === 'completed'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onLogout={logout}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* New Order Button */}
      <div className="px-6 pt-4">
        <Button 
          onClick={() => setShowCreateOrder(true)}
          size="lg"
          className="w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('طلب جديد', 'New Order')}
        </Button>
      </div>

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

      <CreateOrderModal
        open={showCreateOrder}
        onClose={() => setShowCreateOrder(false)}
        onOrderCreated={fetchOrders}
      />
    </div>
  );
}