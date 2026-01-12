import { useState } from 'react';
import { AdminLayout } from '@/components/layout/DashboardLayout';
import { AdminHeader } from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, RotateCw, X, Crown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type StaffRole = 'owner' | 'admin' | 'manager' | 'cashier';

interface StaffMember {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  role: StaffRole;
  branchAr: string;
  branchEn: string;
  active: boolean;
  isCurrentUser?: boolean;
}

interface PendingInvite {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  role: StaffRole;
  sentAr: string;
  sentEn: string;
  expiresAr: string;
  expiresEn: string;
}

const roleConfig: Record<StaffRole, { labelAr: string; labelEn: string }> = {
  owner: { labelAr: 'مالك', labelEn: 'Owner' },
  admin: { labelAr: 'مدير', labelEn: 'Admin' },
  manager: { labelAr: 'مشرف', labelEn: 'Manager' },
  cashier: { labelAr: 'كاشير', labelEn: 'Cashier' },
};

const staffMembers: StaffMember[] = [
  { id: '1', nameAr: 'أنت', nameEn: 'You', email: 'eq.zx20@gmail.com', role: 'owner', branchAr: 'الكل', branchEn: 'All', active: true, isCurrentUser: true },
  { id: '2', nameAr: 'أحمد المدير', nameEn: 'Ahmed Admin', email: 'ahmed@demo.com', role: 'admin', branchAr: 'الكل', branchEn: 'All', active: true },
  { id: '3', nameAr: 'سارة كاشير', nameEn: 'Sara Cashier', email: 'sara@demo.com', role: 'cashier', branchAr: 'الرئيسي', branchEn: 'Main', active: true },
  { id: '4', nameAr: 'محمد كاشير', nameEn: 'Mohammed Cashier', email: 'mohammed@demo.com', role: 'cashier', branchAr: 'فرع 2', branchEn: 'Branch 2', active: false },
];

const pendingInvites: PendingInvite[] = [
  { id: '1', nameAr: 'خالد الجديد', nameEn: 'Khalid New', email: 'khalid@email.com', role: 'cashier', sentAr: 'اليوم', sentEn: 'Today', expiresAr: '7 أيام', expiresEn: '7 days' },
  { id: '2', nameAr: 'نورة المديرة', nameEn: 'Noura Manager', email: 'noura@email.com', role: 'manager', sentAr: 'أمس', sentEn: 'Yesterday', expiresAr: '6 أيام', expiresEn: '6 days' },
];

export default function Staff() {
  const { t, language } = useLanguage();
  
  return (
    <AdminLayout>
      <AdminHeader 
        title={t('الموظفين', 'Staff')} 
      />
      
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button>
            <Plus className="w-4 h-4" />
            {t('دعوة موظف', 'Invite Staff')}
          </Button>
        </div>
        
        <Tabs defaultValue="staff" className="space-y-6">
          <TabsList>
            <TabsTrigger value="staff">{t('الموظفين الحاليين', 'Current Staff')}</TabsTrigger>
            <TabsTrigger value="pending">
              {t('الدعوات المعلقة', 'Pending Invitations')}
              <span className="ms-2 bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingInvites.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          {/* Current Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <div className="bg-card rounded-xl border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('الاسم', 'Name')}</th>
                    <th>{t('البريد', 'Email')}</th>
                    <th>{t('الدور', 'Role')}</th>
                    <th>{t('الفرع', 'Branch')}</th>
                    <th>{t('الحالة', 'Status')}</th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((staff) => {
                    const role = roleConfig[staff.role];
                    return (
                      <tr key={staff.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            {staff.isCurrentUser && <Crown className="w-4 h-4 text-warning" />}
                            <span className="font-medium">
                              {language === 'ar' ? staff.nameAr : staff.nameEn}
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground">{staff.email}</td>
                        <td>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {language === 'ar' ? role.labelAr : role.labelEn}
                          </span>
                        </td>
                        <td>{language === 'ar' ? staff.branchAr : staff.branchEn}</td>
                        <td>
                          <span className={cn(
                            'status-badge',
                            staff.active ? 'status-ready' : 'status-completed'
                          )}>
                            {staff.active 
                              ? <><Check className="w-3 h-3" /> {t('نشط', 'Active')}</>
                              : <><X className="w-3 h-3" /> {t('معطل', 'Disabled')}</>
                            }
                          </span>
                        </td>
                        <td>
                          {!staff.isCurrentUser && (
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          {/* Pending Invitations Tab */}
          <TabsContent value="pending" className="space-y-6">
            <div className="bg-card rounded-xl border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('الاسم', 'Name')}</th>
                    <th>{t('البريد', 'Email')}</th>
                    <th>{t('الدور', 'Role')}</th>
                    <th>{t('أُرسلت', 'Sent')}</th>
                    <th>{t('تنتهي', 'Expires')}</th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvites.map((invite) => {
                    const role = roleConfig[invite.role];
                    return (
                      <tr key={invite.id}>
                        <td className="font-medium">
                          {language === 'ar' ? invite.nameAr : invite.nameEn}
                        </td>
                        <td className="text-muted-foreground">{invite.email}</td>
                        <td>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {language === 'ar' ? role.labelAr : role.labelEn}
                          </span>
                        </td>
                        <td className="text-muted-foreground">
                          {language === 'ar' ? invite.sentAr : invite.sentEn}
                        </td>
                        <td className="text-muted-foreground">
                          {language === 'ar' ? invite.expiresAr : invite.expiresEn}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" title={t('إعادة إرسال', 'Resend')}>
                              <RotateCw className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" title={t('إلغاء', 'Cancel')}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              🔄 = {t('إعادة إرسال الدعوة', 'Resend invitation')} &nbsp;&nbsp; ✕ = {t('إلغاء الدعوة', 'Cancel invitation')}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
