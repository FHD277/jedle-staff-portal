import { Order, OrderType, OrderStatus } from '@/types/order';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Phone, Store, UtensilsCrossed, Truck, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkReady?: () => void;
  onMarkCompleted?: () => void;
  onClick?: () => void;
}

const typeIcons: Record<OrderType, React.ReactNode> = {
  pickup: <Store className="w-3.5 h-3.5" />,
  dinein: <UtensilsCrossed className="w-3.5 h-3.5" />,
  delivery: <Truck className="w-3.5 h-3.5" />,
};

const typeClasses: Record<OrderType, string> = {
  pickup: 'type-pickup',
  dinein: 'type-dinein',
  delivery: 'type-delivery',
};

export function OrderCard({
  order,
  onAccept,
  onReject,
  onMarkReady,
  onMarkCompleted,
  onClick,
}: OrderCardProps) {
  const { t, language, isRTL } = useLanguage();
  
  const timeAgo = formatDistanceToNow(order.createdAt, {
    addSuffix: false,
    locale: language === 'ar' ? ar : enUS,
  });
  
  const isNew = order.status === 'pending';
  const isPreparing = order.status === 'preparing';
  const isReady = order.status === 'ready';
  
  const statusBorderClass = {
    pending: 'border-l-4 border-l-status-new',
    confirmed: 'border-l-4 border-l-status-preparing',
    preparing: 'border-l-4 border-l-status-preparing',
    ready: 'border-l-4 border-l-status-ready',
    completed: 'border-l-4 border-l-status-completed',
    cancelled: 'border-l-4 border-l-destructive',
  }[order.status];
  
  const rtlBorderClass = isRTL ? statusBorderClass.replace('border-l-', 'border-r-').replace('border-l-4', 'border-r-4') : statusBorderClass;
  
  return (
    <div
      className={`order-card bg-card rounded-xl shadow-sm border border-border overflow-hidden cursor-pointer ${rtlBorderClass} ${isNew ? 'animate-order-pulse' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            #{order.orderNumber}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeClasses[order.type]}`}>
            {typeIcons[order.type]}
            {order.type === 'dinein' && order.tableNumber 
              ? `${t('type.dinein')} #${order.tableNumber}`
              : t(`type.${order.type}`)}
          </span>
        </div>
      </div>
      
      {/* Customer Info */}
      <div className="px-4 py-3 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-foreground font-medium">
          <span>👤</span>
          <span>{order.customer.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />
          <span dir="ltr">{order.customer.phone}</span>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="px-4 py-3 bg-muted/30 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t('order.items')}
          </span>
          <span className="font-bold text-foreground" dir="ltr">
            ﷼ {order.total.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Time & Status */}
      <div className="px-4 py-2 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>⏱️</span>
          <span>
            {language === 'ar' ? `منذ ${timeAgo}` : `${timeAgo} ago`}
          </span>
          {isReady && (
            <span className="ms-auto inline-flex items-center gap-1 text-status-ready font-medium">
              🔔 {t('misc.readyAlert')}
            </span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      {(isNew || isPreparing || isReady) && (
        <div 
          className="px-4 py-3 border-t border-border/50 flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {isNew && (
            <>
              <Button
                variant="accept"
                size="sm"
                className="flex-1"
                onClick={onAccept}
              >
                {t('action.accept')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={onReject}
              >
                {t('action.reject')}
                <ChevronDown className="w-3.5 h-3.5 ms-1" />
              </Button>
            </>
          )}
          {isPreparing && (
            <Button
              variant="ready"
              size="sm"
              className="flex-1"
              onClick={onMarkReady}
            >
              {t('action.markReady')} ➜
            </Button>
          )}
          {isReady && (
            <Button
              variant="complete"
              size="sm"
              className="flex-1"
              onClick={onMarkCompleted}
            >
              {t('action.markCompleted')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
