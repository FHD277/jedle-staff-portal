import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (keyOrAr: string, en?: string) => string;
}

// Translation dictionary from cashier app
const translations: Record<string, Record<Language, string>> = {
  // Auth
  'auth.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'auth.password': { ar: 'كلمة المرور', en: 'Password' },
  'auth.signIn': { ar: 'تسجيل الدخول', en: 'Sign In' },
  'auth.pinLogin': { ar: 'الدخول برمز PIN', en: 'PIN Login' },
  'auth.enterPin': { ar: 'أدخل رمز PIN', en: 'Enter PIN' },
  'auth.backToEmail': { ar: 'العودة للبريد', en: 'Back to Email' },
  'auth.or': { ar: 'أو', en: 'OR' },
  
  // Dashboard
  'dashboard.title': { ar: 'لوحة الطلبات', en: 'Order Board' },
  'dashboard.branch': { ar: 'الفرع', en: 'Branch' },
  'dashboard.mainBranch': { ar: 'الرئيسي', en: 'Main' },
  
  // Order Statuses
  'status.new': { ar: 'جديد', en: 'New' },
  'status.preparing': { ar: 'قيد التحضير', en: 'Preparing' },
  'status.ready': { ar: 'جاهز', en: 'Ready' },
  'status.completed': { ar: 'مكتمل', en: 'Completed' },
  'status.cancelled': { ar: 'ملغي', en: 'Cancelled' },
  
  // Order Types
  'type.pickup': { ar: 'استلام', en: 'Pickup' },
  'type.dinein': { ar: 'طاولة', en: 'Table' },
  'type.delivery': { ar: 'توصيل', en: 'Delivery' },
  
  // Actions
  'action.accept': { ar: 'قبول', en: 'Accept' },
  'action.reject': { ar: 'رفض', en: 'Reject' },
  'action.markReady': { ar: 'جاهز', en: 'Ready' },
  'action.markCompleted': { ar: 'تم التسليم', en: 'Completed' },
  'action.print': { ar: 'طباعة', en: 'Print' },
  'action.call': { ar: 'اتصال', en: 'Call' },
  
  // Time
  'time.minutesAgo': { ar: 'منذ {n} دقيقة', en: '{n} min ago' },
  'time.justNow': { ar: 'الآن', en: 'Just now' },
  
  // Order Details
  'order.items': { ar: 'عناصر', en: 'items' },
  'order.customerInfo': { ar: 'معلومات العميل', en: 'Customer Info' },
  'order.orderType': { ar: 'نوع الطلب', en: 'Order Type' },
  'order.itemsList': { ar: 'العناصر', en: 'Items' },
  'order.customerNotes': { ar: 'ملاحظات العميل', en: 'Customer Notes' },
  'order.summary': { ar: 'ملخص الطلب', en: 'Order Summary' },
  'order.subtotal': { ar: 'المجموع الفرعي', en: 'Subtotal' },
  'order.vat': { ar: 'ضريبة 15%', en: '15% VAT' },
  'order.total': { ar: 'الإجمالي', en: 'Total' },
  'order.payment': { ar: 'الدفع', en: 'Payment' },
  'order.paid': { ar: 'تم الدفع', en: 'Paid' },
  'order.expectedTime': { ar: 'الوقت المتوقع', en: 'Expected Time' },
  
  // Settings
  'settings.title': { ar: 'الإعدادات', en: 'Settings' },
  'settings.sound': { ar: 'الصوت', en: 'Sound' },
  'settings.enableSound': { ar: 'تفعيل صوت الإشعارات', en: 'Enable notification sounds' },
  'settings.volume': { ar: 'مستوى الصوت', en: 'Volume' },
  'settings.printing': { ar: 'الطباعة', en: 'Printing' },
  'settings.autoPrint': { ar: 'طباعة تلقائية عند القبول', en: 'Auto-print on accept' },
  'settings.language': { ar: 'اللغة', en: 'Language' },
  'settings.save': { ar: 'حفظ الإعدادات', en: 'Save Settings' },
  
  // Misc
  'misc.readyAlert': { ar: 'جاهز!', en: 'Ready!' },
  'misc.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  
  // Admin translations
  'الطلبات حسب الساعة': { ar: 'الطلبات حسب الساعة', en: 'Orders by Hour' },
  'طلب': { ar: 'طلب', en: 'Orders' },
  'آخر الطلبات': { ar: 'آخر الطلبات', en: 'Recent Orders' },
  'عرض الكل': { ar: 'عرض الكل', en: 'View All' },
  'الأصناف الأكثر مبيعاً': { ar: 'الأصناف الأكثر مبيعاً', en: 'Top Selling Items' },
  'الإيرادات (آخر 7 أيام)': { ar: 'الإيرادات (آخر 7 أيام)', en: 'Revenue (Last 7 Days)' },
  'الإيرادات': { ar: 'الإيرادات', en: 'Revenue' },
  'صباح الخير': { ar: 'صباح الخير', en: 'Good morning' },
  'مساء الخير': { ar: 'مساء الخير', en: 'Good afternoon' },
  'اليوم': { ar: 'اليوم', en: 'Today' },
  'أمس': { ar: 'أمس', en: 'Yesterday' },
  'آخر 7 أيام': { ar: 'آخر 7 أيام', en: 'Last 7 Days' },
  'آخر 30 يوم': { ar: 'آخر 30 يوم', en: 'Last 30 Days' },
  'هذا الشهر': { ar: 'هذا الشهر', en: 'This Month' },
  'الملف الشخصي': { ar: 'الملف الشخصي', en: 'Profile' },
  'الإعدادات': { ar: 'الإعدادات', en: 'Settings' },
  'تسجيل خروج': { ar: 'تسجيل خروج', en: 'Logout' },
  'لوحة التحكم': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'الطلبات': { ar: 'الطلبات', en: 'Orders' },
  'القائمة': { ar: 'القائمة', en: 'Menu' },
  'العملاء': { ar: 'العملاء', en: 'Customers' },
  'الولاء': { ar: 'الولاء', en: 'Loyalty' },
  'العروض': { ar: 'العروض', en: 'Promotions' },
  'التذاكر': { ar: 'التذاكر', en: 'Tickets' },
  'التقارير': { ar: 'التقارير', en: 'Reports' },
  'الموظفين': { ar: 'الموظفين', en: 'Staff' },
  'الفروع': { ar: 'الفروع', en: 'Branches' },
  'ديمو كافيه': { ar: 'ديمو كافيه', en: 'Demo Cafe' },
  'أحمد': { ar: 'أحمد', en: 'Ahmed' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';
  
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);
  
  // Unified translation function that handles BOTH patterns:
  // 1. t('key') - looks up in dictionary
  // 2. t('Arabic text', 'English text') - direct translation
  const t = (keyOrAr: string, en?: string): string => {
    // If second parameter provided, it's direct translation mode
    if (en !== undefined) {
      return language === 'ar' ? keyOrAr : en;
    }
    
    // Otherwise, look up in dictionary
    return translations[keyOrAr]?.[language] || keyOrAr;
  };
  
  return (
    <LanguageContext.Provider value={{ language, direction, isRTL, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}