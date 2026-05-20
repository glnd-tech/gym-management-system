import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, CreditCard, CalendarCheck,
  ClipboardList, Dumbbell, BookOpen, LogOut, Sun, Moon, X, Activity
} from 'lucide-react';
import '../styles/Layout.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Miembros' },
  { to: '/plans', icon: CreditCard, label: 'Planes' },
  { to: '/subscriptions', icon: ClipboardList, label: 'Suscripciones' },
  { to: '/attendance', icon: CalendarCheck, label: 'Asistencia' },
  { to: '/workouts', icon: Dumbbell, label: 'Clases' },
  { to: '/bookings', icon: BookOpen, label: 'Reservas' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();


  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Activity size={20} />
            </div>
            <div className="sidebar-logo-text">
              Gym<span>Sys</span>
            </div>
          </div>
          <button className="mobile-toggle" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Principal</span>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
          <button className="sidebar-link" onClick={logout} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}>
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
