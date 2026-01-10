import { Order } from '@/types/order';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, Mail, Store, UtensilsCrossed, Truck, Clock, Printer, X, CreditCard, Smartphone } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkReady?: () => void;
  onMarkCompleted?: () => void;
}

const typeIcons = {
  pickup: Store,
  dinein: UtensilsCrossed,
  delivery: Truck,
};

const paymentIcons = {
  cash: '💵',
  card: '💳',
  apple_pay: '📱',
  mada: '💳',
};

const paymentLabels = {
  cash: { ar: 'نقدي', en: 'Cash' },
  card: { ar: 'بطاقة', en: 'Card' },
  apple_pay: { ar: 'Apple Pay', en: 'Apple Pay' },
  mada: { ar: 'مدى', en: 'Mada' },
};

export function OrderDetailModal({
  order,
  open,
  onClose,
  onAccept,
  onReject,
  onMarkReady,
  onMarkCompleted,
}: OrderDetailModalProps) {
  const { t, language, isRTL } = useLanguage();
  
  if (!order) return null;
  
  const TypeIcon = typeIcons[order.type];
  const isNew = order.status === 'pending';
  const isPreparing = order.status === 'preparing';
  const isReady = order.status === 'ready';
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-card z-10 px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {language === 'ar' ? 'طلب' : 'Order'} #{order.orderNumber}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-6">
          {/* Customer Info */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('order.customerInfo')}
            </h3>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">👤</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span dir="ltr" className="text-muted-foreground">{order.customer.phone}</span>
                <Button variant="ghost" size="sm" className="ms-auto text-primary">
                  {t('action.call')} 📞
                </Button>
              </div>
              {order.customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{order.customer.email}</span>
                </div>
              )}
            </div>
          </section>
          
          {/* Order Type */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('order.orderType')}
            </h3>
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <TypeIcon className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  {order.type === 'dinein' && order.tableNumber 
                    ? `${t('type.dinein')} #${order.tableNumber}`
                    : t(`type.${order.type}`)}
                </span>
              </div>
              {order.estimatedTime && (
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{t('order.expectedTime')}: {order.estimatedTime.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </section>
          
          {/* Items */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('order.itemsList')}
            </h3>
            <div className="bg-muted/30 rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-border/50">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-4">
                        <div className="font-medium">
                          {language === 'ar' ? item.nameAr : item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === 'ar' ? item.name : item.nameAr}
                        </div>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.modifiers.map((mod, i) => (
                              <div key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <span>└─</span>
                                <span>{language === 'ar' ? mod.nameAr : mod.name}</span>
                                {mod.price > 0 && (
                                  <span className="text-primary" dir="ltr">(+﷼{mod.price})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {item.notes && (
                          <div className="mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-md inline-flex items-center gap-1">
                            <span>⚠️</span>
                            <span>"{item.notes}"</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        ×{item.quantity}
                      </td>
                      <td className="p-4 text-end font-medium" dir="ltr">
                        ﷼ {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Customer Notes */}
          {order.notes && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('order.customerNotes')}
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>"{order.notes}"</span>
                </div>
              </div>
            </section>
          )}
          
          {/* Order Summary */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('order.summary')}
            </h3>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('order.subtotal')}</span>
                <span dir="ltr">﷼ {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('order.vat')}</span>
                <span dir="ltr">﷼ {order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('order.total')}</span>
                  <span dir="ltr">﷼ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Payment */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('order.payment')}
            </h3>
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{paymentIcons[order.paymentMethod]}</span>
                  <span>{paymentLabels[order.paymentMethod][language]}</span>
                </div>
                {order.isPaid && (
                  <span className="inline-flex items-center gap-1 text-status-ready text-sm font-medium">
                    ✓ {t('order.paid')}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
        
        {/* Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4">
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="gap-2">
              <Printer className="w-4 h-4" />
              {t('action.print')}
            </Button>
            
            <div className="flex-1 flex gap-2 justify-end">
              {isNew && (
                <>
                  <Button variant="accept" size="lg" onClick={onAccept}>
                    {t('action.accept')} ✓
                  </Button>
                  <Button variant="outline" size="lg" className="text-destructive" onClick={onReject}>
                    {t('action.reject')} ▼
                  </Button>
                </>
              )}
              {isPreparing && (
                <Button variant="ready" size="lg" onClick={onMarkReady}>
                  {t('action.markReady')} ➜
                </Button>
              )}
              {isReady && (
                <Button variant="complete" size="lg" onClick={onMarkCompleted}>
                  {t('action.markCompleted')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
