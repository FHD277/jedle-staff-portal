import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  Gift,
  Tags,
  MessageSquare,
  BarChart3,
  Settings,
  UserCog,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavItem {
  icon: React.ElementType;
  labelAr: string;
  labelEn: string;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard', path: '/admin' },
  { icon: ClipboardList, labelAr: 'الطلبات', labelEn: 'Orders', path: '/admin/orders', badge: 5 },
  { icon: UtensilsCrossed, labelAr: 'القائمة', labelEn: 'Menu', path: '/admin/menu' },
  { icon: Users, labelAr: 'العملاء', labelEn: 'Customers', path: '/admin/customers' },
  { icon: Gift, labelAr: 'الولاء', labelEn: 'Loyalty', path: '/admin/loyalty' },
  { icon: Tags, labelAr: 'العروض', labelEn: 'Promotions', path: '/admin/promotions' },
  { icon: MessageSquare, labelAr: 'التذاكر', labelEn: 'Tickets', path: '/admin/tickets', badge: 3 },
  { icon: BarChart3, labelAr: 'التقارير', labelEn: 'Reports', path: '/admin/reports' },
];

const settingsNavItems: NavItem[] = [
  { icon: Settings, labelAr: 'الإعدادات', labelEn: 'Settings', path: '/admin/settings' },
  { icon: UserCog, labelAr: 'الموظفين', labelEn: 'Staff', path: '/admin/staff' },
  { icon: Building2, labelAr: 'الفروع', labelEn: 'Branches', path: '/admin/branches' },
];

export function AdminSidebar() {
  const { t, direction } = useLanguage();
  const { logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const CollapseIcon = direction === 'rtl' 
    ? (collapsed ? ChevronLeft : ChevronRight)
    : (collapsed ? ChevronRight : ChevronLeft);
  
  return (
    <aside 
      className={cn(
        "fixed top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-50",
        direction === 'rtl' ? 'right-0' : 'left-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-lg">J</span>
            </div>
            <div>
              <h1 className="font-bold text-sidebar-accent-foreground">Demo Cafe</h1>
              <p className="text-xs text-sidebar-muted">{t('ديمو كافيه', 'Demo Cafe')}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <span className="text-sidebar-primary-foreground font-bold text-lg">J</span>
          </div>
        )}
      </div>
      
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-4 w-6 h-6 rounded-full bg-sidebar-accent hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors",
          direction === 'rtl' ? '-left-3' : '-right-3'
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        <CollapseIcon className="w-4 h-4" />
      </Button>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'nav-item',
                  isActive(item.path) && 'nav-item-active',
                  collapsed && 'justify-center px-2'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{t(item.labelAr, item.labelEn)}</span>
                    {item.badge && (
                      <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="my-4 border-t border-sidebar-border" />
        
        <ul className="space-y-1">
          {settingsNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'nav-item',
                  isActive(item.path) && 'nav-item-active',
                  collapsed && 'justify-center px-2'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{t(item.labelAr, item.labelEn)}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button 
          onClick={logout}
          className={cn('nav-item w-full', collapsed && 'justify-center px-2')}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t('تسجيل خروج', 'Logout')}</span>}
        </button>
      </div>
    </aside>
  );
}