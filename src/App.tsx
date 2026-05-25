import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SuperAdminProvider } from './context/SuperAdminContext';
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import TenantsList from './pages/superadmin/TenantsList';
import AddEditTenant from './pages/superadmin/AddEditTenant';
import TenantDetails from './pages/superadmin/TenantDetails';
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import ProtectedRoute from './pages/superadmin/ProtectedRoute';

function App() {
  return (
    <SuperAdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/superadmin" element={<SuperAdminLayout />}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="tenants" element={<TenantsList />} />
              <Route path="tenants/new" element={<AddEditTenant />} />
              <Route path="tenants/:id" element={<TenantDetails />} />
              <Route path="tenants/:id/edit" element={<AddEditTenant />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/superadmin/login" replace />} />
          <Route path="*" element={<Navigate to="/superadmin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </SuperAdminProvider>
  );
}

export default App;
