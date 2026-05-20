import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/members': 'Miembros',
  '/plans': 'Planes',
  '/subscriptions': 'Suscripciones',
  '/attendance': 'Asistencia',
  '/workouts': 'Clases',
  '/bookings': 'Reservas',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'GymSys';

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="app-main">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
