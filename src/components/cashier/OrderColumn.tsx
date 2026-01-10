import { Order, OrderStatus } from '@/types/order';
import { OrderCard } from './OrderCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderColumnProps {
  status: OrderStatus;
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onMarkReady?: (orderId: string) => void;
  onMarkCompleted?: (orderId: string) => void;
}

const statusConfig: Record<OrderStatus, { 
  icon: string; 
  colorClass: string;
  bgClass: string;
}> = {
  pending: { 
    icon: '🔴', 
    colorClass: 'text-status-new',
    bgClass: 'bg-status-new-bg',
  },
  confirmed: { 
    icon: '🟡', 
    colorClass: 'text-status-preparing',
    bgClass: 'bg-status-preparing-bg',
  },
  preparing: { 
    icon: '🟠', 
    colorClass: 'text-status-preparing',
    bgClass: 'bg-status-preparing-bg',
  },
  ready: { 
    icon: '🟢', 
    colorClass: 'text-status-ready',
    bgClass: 'bg-status-ready-bg',
  },
  completed: { 
    icon: '✓', 
    colorClass: 'text-status-completed',
    bgClass: 'bg-status-completed-bg',
  },
  cancelled: { 
    icon: '✕', 
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
  },
};

export function OrderColumn({
  status,
  orders,
  onOrderClick,
  onAccept,
  onReject,
  onMarkReady,
  onMarkCompleted,
}: OrderColumnProps) {
  const { t } = useLanguage();
  const config = statusConfig[status];
  
  const statusKey = status === 'pending' ? 'new' : status;
  
  return (
    <div className="flex flex-col min-w-[280px] lg:min-w-0">
      {/* Column Header */}
      <div className={`rounded-xl px-4 py-3 mb-4 ${config.bgClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <h3 className={`font-semibold ${config.colorClass}`}>
              {t(`status.${statusKey}`)}
            </h3>
          </div>
          {orders.length > 0 && (
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${config.bgClass} ${config.colorClass} border border-current/20`}>
              {orders.length}
            </span>
          )}
        </div>
      </div>
      
      {/* Orders */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {orders.map((order, index) => (
          <div 
            key={order.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <OrderCard
              order={order}
              onClick={() => onOrderClick(order)}
              onAccept={onAccept ? () => onAccept(order.id) : undefined}
              onReject={onReject ? () => onReject(order.id) : undefined}
              onMarkReady={onMarkReady ? () => onMarkReady(order.id) : undefined}
              onMarkCompleted={onMarkCompleted ? () => onMarkCompleted(order.id) : undefined}
            />
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <div className="text-3xl mb-2 opacity-50">📋</div>
            <p>No orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
