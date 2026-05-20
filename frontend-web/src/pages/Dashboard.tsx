import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { Users, Activity, DollarSign } from 'lucide-react';
import '../styles/Dashboard.css';
import '../styles/DataTable.css';

interface KPIs {
  totalUsers: number;
  checkInsToday: number;
  activeRevenue: number;
}

interface Subscription {
  id: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  user: { fullName: string };
  plan: { name: string; price: number };
}

interface AttendanceRecord {
  id: number;
  checkInTime: string;
  user: { fullName: string; email: string };
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, subRes, attRes] = await Promise.all([
          apiClient.get('/analytics/dashboard'),
          apiClient.get('/subscriptions'),
          apiClient.get('/attendance'),
        ]);
        setKpis(kpiRes.data.kpis);
        setSubs(subRes.data.slice(0, 5));
        setAttendance(attRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(val);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="dashboard-header animate-fade-in-up">
        <h1>Dashboard</h1>
        <p>Resumen general de tu gimnasio</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="stat-card animate-fade-in-up delay-1">
          <div className="stat-card-icon">
            <Users />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Total Miembros</div>
            <div className="stat-card-value">
              {loading ? <div className="skeleton" style={{ width: 60, height: 32 }} /> : kpis?.totalUsers ?? 0}
            </div>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up delay-2">
          <div className="stat-card-icon">
            <Activity />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Check-ins Hoy</div>
            <div className="stat-card-value">
              {loading ? <div className="skeleton" style={{ width: 60, height: 32 }} /> : kpis?.checkInsToday ?? 0}
            </div>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up delay-3">
          <div className="stat-card-icon">
            <DollarSign />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Ingresos Activos</div>
            <div className="stat-card-value">
              {loading ? <div className="skeleton" style={{ width: 100, height: 32 }} /> : formatCurrency(kpis?.activeRevenue ?? 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tables */}
      <div className="dashboard-grid">
        {/* Recent Subscriptions */}
        <div className="dashboard-section animate-fade-in-up delay-4">
          <div className="dashboard-section-header">
            <h3>Últimas Suscripciones</h3>
          </div>
          <div className="dashboard-section-body">
            {loading ? (
              <>
                <div className="skeleton skeleton-row" />
                <div className="skeleton skeleton-row" />
                <div className="skeleton skeleton-row" />
              </>
            ) : subs.length === 0 ? (
              <div className="table-empty"><p>Sin suscripciones</p></div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Miembro</th>
                    <th>Plan</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map(sub => (
                    <tr key={sub.id}>
                      <td>{sub.user?.fullName ?? '—'}</td>
                      <td>{sub.plan?.name ?? '—'}</td>
                      <td>
                        <span className={`badge ${sub.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {sub.isActive ? 'Activa' : 'Expirada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="dashboard-section animate-fade-in-up delay-5">
          <div className="dashboard-section-header">
            <h3>Asistencias Recientes</h3>
          </div>
          <div className="dashboard-section-body">
            {loading ? (
              <>
                <div className="skeleton skeleton-row" />
                <div className="skeleton skeleton-row" />
                <div className="skeleton skeleton-row" />
              </>
            ) : attendance.length === 0 ? (
              <div className="table-empty"><p>Sin registros</p></div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Miembro</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map(att => (
                    <tr key={att.id}>
                      <td>{att.user?.fullName ?? '—'}</td>
                      <td>{formatDate(att.checkInTime)}</td>
                      <td>{formatTime(att.checkInTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
