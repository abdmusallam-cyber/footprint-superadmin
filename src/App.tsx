import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SuperAdminProvider } from './context/SuperAdminContext';
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import TenantsList from './pages/superadmin/TenantsList';
import AddEditTenant from './pages/superadmin/AddEditTenant';
import TenantDetails from './pages/superadmin/TenantDetails';
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';

function App() {
  return (
    <SuperAdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="tenants" element={<TenantsList />} />
            <Route path="tenants/new" element={<AddEditTenant />} />
            <Route path="tenants/:id" element={<TenantDetails />} />
            <Route path="tenants/:id/edit" element={<AddEditTenant />} />
          </Route>
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          {/* Redirect from root to /superadmin */}
          <Route path="/" element={<Navigate to="/superadmin" replace />} />
        </Routes>
      </BrowserRouter>
    </SuperAdminProvider>
  );
}

export default App;
