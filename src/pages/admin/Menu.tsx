import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Upload, Download, GripVertical, Pencil, Trash2, Star, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  itemCount: number;
  active: boolean;
}

interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  categoryAr: string;
  price: number;
  available: boolean;
  featured: boolean;
}

const categories: Category[] = [
  { id: '1', nameAr: 'مشروبات ساخنة', nameEn: 'Hot Drinks', itemCount: 12, active: true },
  { id: '2', nameAr: 'مشروبات باردة', nameEn: 'Cold Drinks', itemCount: 8, active: true },
  { id: '3', nameAr: 'المخبوزات', nameEn: 'Bakery', itemCount: 6, active: true },
  { id: '4', nameAr: 'الحلويات', nameEn: 'Desserts', itemCount: 5, active: true },
  { id: '5', nameAr: 'الساندويتشات', nameEn: 'Sandwiches', itemCount: 4, active: false },
];

const menuItems: MenuItem[] = [
  { id: '1', nameAr: 'سبانش لاتيه', nameEn: 'Spanish Latte', category: 'Hot Drinks', categoryAr: 'مشروبات ساخنة', price: 25, available: true, featured: true },
  { id: '2', nameAr: 'لاتيه', nameEn: 'Latte', category: 'Hot Drinks', categoryAr: 'مشروبات ساخنة', price: 20, available: true, featured: false },
  { id: '3', nameAr: 'كولد برو', nameEn: 'Cold Brew', category: 'Cold Drinks', categoryAr: 'مشروبات باردة', price: 22, available: false, featured: false },
  { id: '4', nameAr: 'كرواسون جبنة', nameEn: 'Cheese Croissant', category: 'Bakery', categoryAr: 'المخبوزات', price: 15, available: true, featured: true },
  { id: '5', nameAr: 'كيكة التمر', nameEn: 'Date Cake', category: 'Desserts', categoryAr: 'الحلويات', price: 18, available: true, featured: false },
];

export default function Menu() {
  const { t, language, direction } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <AdminLayout>
      <AdminHeader 
        title={t('القائمة', 'Menu')} 
      />
      
      <div className="p-6 space-y-6">
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">{t('التصنيفات', 'Categories')}</TabsTrigger>
            <TabsTrigger value="items">{t('الأصناف', 'Items')}</TabsTrigger>
          </TabsList>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-end">
              <Button>
                <Plus className="w-4 h-4" />
                {t('إضافة تصنيف جديد', 'Add New Category')}
              </Button>
            </div>
            
            <div className="bg-card rounded-xl border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-12"></th>
                    <th className="w-20">{t('الصورة', 'Image')}</th>
                    <th>{t('الاسم (عربي)', 'Name (Arabic)')}</th>
                    <th>{t('الاسم (إنجليزي)', 'Name (English)')}</th>
                    <th>{t('الأصناف', 'Items')}</th>
                    <th>{t('الحالة', 'Status')}</th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      </td>
                      <td>
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          🖼️
                        </div>
                      </td>
                      <td className="font-medium">{category.nameAr}</td>
                      <td>{category.nameEn}</td>
                      <td>{category.itemCount}</td>
                      <td>
                        <span className={cn(
                          'status-badge',
                          category.active ? 'status-ready' : 'status-completed'
                        )}>
                          {category.active 
                            ? (language === 'ar' ? '✓ نشط' : '✓ Active')
                            : (language === 'ar' ? '✗ مخفي' : '✗ Hidden')
                          }
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              💡 {t('اسحب وأفلت لإعادة ترتيب التصنيفات', 'Drag and drop to reorder categories')}
            </p>
          </TabsContent>
          
          {/* Items Tab */}
          <TabsContent value="items" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                    direction === 'rtl' ? 'right-3' : 'left-3'
                  )} />
                  <Input
                    placeholder={t('بحث...', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(direction === 'rtl' ? 'pr-10' : 'pl-10')}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('التصنيف', 'Category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {language === 'ar' ? cat.nameAr : cat.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="w-4 h-4" />
                  <span className="hidden md:inline">{t('استيراد CSV', 'Import CSV')}</span>
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline">{t('تصدير', 'Export')}</span>
                </Button>
                <Button>
                  <Plus className="w-4 h-4" />
                  {t('إضافة صنف', 'Add Item')}
                </Button>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-20">{t('الصورة', 'Image')}</th>
                    <th>{t('الاسم', 'Name')}</th>
                    <th>{t('التصنيف', 'Category')}</th>
                    <th>{t('السعر', 'Price')}</th>
                    <th>{t('متوفر', 'Available')}</th>
                    <th>{t('مميز', 'Featured')}</th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          🖼️
                        </div>
                      </td>
                      <td className="font-medium">
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </td>
                      <td>
                        {language === 'ar' ? item.categoryAr : item.category}
                      </td>
                      <td className="font-medium">﷼ {item.price}</td>
                      <td>
                        {item.available 
                          ? <Check className="w-5 h-5 text-success" />
                          : <X className="w-5 h-5 text-destructive" />
                        }
                      </td>
                      <td>
                        {item.featured && <Star className="w-5 h-5 text-warning fill-warning" />}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
