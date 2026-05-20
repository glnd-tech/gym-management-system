import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Modal from '../components/Modal';
import { Plus, CalendarCheck } from 'lucide-react';
import '../styles/DataTable.css';
import '../styles/Components.css';

interface AttendanceRecord {
  id: number;
  checkInTime: string;
  user: { id: number; fullName: string; email: string };
}

interface UserOption { id: number; fullName: string; }

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [attRes, usrRes] = await Promise.all([
        apiClient.get('/attendance'),
        apiClient.get('/users'),
      ]);
      setRecords(attRes.data);
      setUsers(usrRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/attendance/check-in', { userId: parseInt(selectedUser) });
      setModalOpen(false);
      setSelectedUser('');
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="page-header">
        <h1>Asistencia</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Registrar Check-in
        </button>
      </div>

      <div className="table-container animate-fade-in-up">
        <table className="data-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => (
                  <td key={j}><div className="skeleton" style={{ width: '80%', height: 16 }} /></td>
                ))}</tr>
              ))
            ) : records.length === 0 ? (
              <tr><td colSpan={4}><div className="table-empty"><CalendarCheck size={48} /><p>Sin registros de asistencia</p></div></td></tr>
            ) : (
              records.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.user?.fullName ?? '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.user?.email ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(r.checkInTime)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatTime(r.checkInTime)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Registrar Check-in"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleCheckIn} disabled={saving}>
              {saving ? 'Registrando...' : 'Registrar'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCheckIn}>
          <div className="form-field">
            <label>Miembro</label>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
              <option value="">Seleccionar miembro...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
