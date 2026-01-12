import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { queryClient } from '@/lib/queryClient';

// Pages
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/auth/RoleGuard';

// Cashier Pages
import CashierDashboard from '@/pages/cashier/CashierDashboard';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
// Uncomment these when you're ready to use them:
// import MenuPage from '@/pages/admin/Menu';
// import OrdersPage from '@/pages/admin/Orders';
// import CustomersPage from '@/pages/admin/Customers';
// import StaffPage from '@/pages/admin/Staff';
// import SettingsPage from '@/pages/admin/Settings';

// Temporary placeholder for pages not yet imported
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">This page is ready - uncomment the import in App.tsx</p>
        <div className="text-sm text-muted-foreground mt-4 p-4 bg-muted rounded-lg max-w-md">
          <p className="font-semibold mb-2">To activate this page:</p>
          <ol className="text-left space-y-1 list-decimal list-inside">
            <li>Uncomment the import at the top of App.tsx</li>
            <li>Replace ComingSoon with the actual component below</li>
            <li>Save and the page will work!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Cashier Routes - Accessible by both cashier and admin */}
              <Route
                path="/cashier"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['cashier', 'admin']}>
                      <CashierDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes - Admin only */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <AdminDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Orders Management" />
                      {/* Uncomment when ready: <OrdersPage /> */}
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/menu"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Menu Management" />
                      {/* Uncomment when ready: <MenuPage /> */}
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Customers" />
                      {/* Uncomment when ready: <CustomersPage /> */}
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* NEW ROUTES - Previously missing! */}
              <Route
                path="/admin/loyalty"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Loyalty Program" />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/promotions"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Promotions" />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/tickets"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Support Tickets" />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Reports & Analytics" />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Staff Management" />
                      {/* Uncomment when ready: <StaffPage /> */}
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Settings" />
                      {/* Uncomment when ready: <SettingsPage /> */}
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/branches"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['admin']}>
                      <ComingSoon title="Branches Management" />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster position="top-right" />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;