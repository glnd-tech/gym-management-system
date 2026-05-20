import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Modal from '../components/Modal';
import { Plus, BookOpen } from 'lucide-react';
import '../styles/DataTable.css';
import '../styles/Components.css';

interface Booking {
  id: number;
  bookedAt: string;
  user: { id: number; fullName: string };
  workout: { id: number; name: string; scheduledAt: string };
}

interface UserOption { id: number; fullName: string; }
interface WorkoutOption { id: number; name: string; }

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutOption[]>([]);
  const [form, setForm] = useState({ userId: '', workoutId: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [bRes, uRes, wRes] = await Promise.all([
        apiClient.get('/bookings'),
        apiClient.get('/users'),
        apiClient.get('/workouts'),
      ]);
      setBookings(bRes.data);
      setUsers(uRes.data);
      setWorkouts(wRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/bookings', {
        userId: parseInt(form.userId),
        workoutId: parseInt(form.workoutId),
      });
      setModalOpen(false);
      setForm({ userId: '', workoutId: '' });
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
        <h1>Reservas</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Nueva Reserva
        </button>
      </div>

      <div className="table-container animate-fade-in-up">
        <table className="data-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Clase</th>
              <th>Fecha Reserva</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => (
                  <td key={j}><div className="skeleton" style={{ width: '80%', height: 16 }} /></td>
                ))}</tr>
              ))
            ) : bookings.length === 0 ? (
              <tr><td colSpan={4}><div className="table-empty"><BookOpen size={48} /><p>Sin reservas registradas</p></div></td></tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.user?.fullName ?? '—'}</td>
                  <td>{b.workout?.name ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(b.bookedAt)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatTime(b.bookedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Nueva Reserva"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? 'Guardando...' : 'Reservar'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-field">
            <label>Miembro</label>
            <select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required>
              <option value="">Seleccionar miembro...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Clase</label>
            <select value={form.workoutId} onChange={e => setForm({ ...form, workoutId: e.target.value })} required>
              <option value="">Seleccionar clase...</option>
              {workouts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
