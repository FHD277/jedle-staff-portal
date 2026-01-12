import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  name_ar: string;
  quantity: number;
  price: number;
}

export function CreateOrderModal({ open, onClose, onOrderCreated }: CreateOrderModalProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);

  // Form state
  const [orderType, setOrderType] = useState<'pickup' | 'dinein' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'apple_pay' | 'mada'>('cash');
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', name: '', name_ar: '', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      name: '', 
      name_ar: '', 
      quantity: 1, 
      price: 0 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.15; // 15% VAT
  };

  const handleSubmit = async () => {
    // Validation
    if (!customerName.trim()) {
      toast.error(t('الرجاء إدخال اسم العميل', 'Please enter customer name'));
      return;
    }

    if (!customerPhone.trim()) {
      toast.error(t('الرجاء إدخال رقم الهاتف', 'Please enter phone number'));
      return;
    }

    const validItems = items.filter(item => item.name.trim() && item.price > 0);
    if (validItems.length === 0) {
      toast.error(t('الرجاء إضافة منتج واحد على الأقل', 'Please add at least one item'));
      return;
    }

    setLoading(true);

    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax(subtotal);
      const total = subtotal + tax;

      // Generate order number
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('order_number')
        .eq('tenant_id', user?.tenant_id)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      const orderNumber = String((todayOrders?.length || 0) + 1).padStart(3, '0');

      // Create order
      const { error } = await supabase
        .from('orders')
        .insert({
          tenant_id: user?.tenant_id,
          order_number: orderNumber,
          order_type: orderType,
          status: 'pending',
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || null,
          table_number: orderType === 'dinein' && tableNumber ? parseInt(tableNumber) : null,
          items: validItems,
          subtotal,
          tax,
          delivery_fee: 0,
          discount: 0,
          total,
          payment_method: paymentMethod,
          payment_status: 'paid',
          notes: notes || null,
        });

      if (error) throw error;

      toast.success(t('تم إنشاء الطلب بنجاح', 'Order created successfully'));
      onOrderCreated();
      handleClose();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(t('فشل إنشاء الطلب', 'Failed to create order'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setOrderType('pickup');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setTableNumber('');
    setNotes('');
    setPaymentMethod('cash');
    setItems([{ id: '1', name: '', name_ar: '', quantity: 1, price: 0 }]);
    onClose();
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            {t('طلب جديد', 'New Order')}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Type */}
          <div className="space-y-2">
            <Label>{t('نوع الطلب', 'Order Type')}</Label>
            <Select value={orderType} onValueChange={(v: any) => setOrderType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">{t('استلام', 'Pickup')}</SelectItem>
                <SelectItem value="dinein">{t('تناول في المطعم', 'Dine-in')}</SelectItem>
                <SelectItem value="delivery">{t('توصيل', 'Delivery')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('اسم العميل', 'Customer Name')} *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('أدخل الاسم', 'Enter name')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('رقم الهاتف', 'Phone Number')} *</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('البريد الإلكتروني', 'Email')} ({t('اختياري', 'optional')})</Label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            {orderType === 'dinein' && (
              <div className="space-y-2">
                <Label>{t('رقم الطاولة', 'Table Number')}</Label>
                <Input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="7"
                />
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">{t('المنتجات', 'Items')}</Label>
              <Button onClick={addItem} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {t('إضافة منتج', 'Add Item')}
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted rounded-lg">
                <div className="col-span-4">
                  <Input
                    placeholder={t('اسم المنتج', 'Item name')}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    placeholder={t('الاسم بالعربي', 'Arabic name')}
                    value={item.name_ar}
                    onChange={(e) => updateItem(item.id, 'name_ar', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder={t('الكمية', 'Qty')}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder={t('السعر', 'Price')}
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>{t('طريقة الدفع', 'Payment Method')}</Label>
            <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">{t('نقدي', 'Cash')}</SelectItem>
                <SelectItem value="card">{t('بطاقة', 'Card')}</SelectItem>
                <SelectItem value="apple_pay">{t('أبل باي', 'Apple Pay')}</SelectItem>
                <SelectItem value="mada">{t('مدى', 'Mada')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>{t('ملاحظات', 'Notes')} ({t('اختياري', 'optional')})</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('أي ملاحظات خاصة؟', 'Any special notes?')}
              rows={3}
            />
          </div>

          {/* Total Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('المجموع الفرعي', 'Subtotal')}</span>
              <span className="font-medium">﷼{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('الضريبة (15%)', 'Tax (15%)')}</span>
              <span className="font-medium">﷼{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>{t('الإجمالي', 'Total')}</span>
              <span className="text-primary">﷼{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? t('جارٍ الإنشاء...', 'Creating...') : t('إنشاء الطلب', 'Create Order')}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              size="lg"
            >
              {t('إلغاء', 'Cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}