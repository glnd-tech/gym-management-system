import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import '../styles/Layout.css';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user } = useAuth();

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-toggle" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.fullName || 'Usuario'}</span>
            <span className="topbar-user-role">{user?.role || 'USER'}</span>
          </div>
          <div className="topbar-avatar">{initials}</div>
        </div>
      </div>
    </header>
  );
}
