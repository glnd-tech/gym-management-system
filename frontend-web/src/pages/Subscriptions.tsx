import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Modal from '../components/Modal';
import { Plus, ClipboardList } from 'lucide-react';
import '../styles/DataTable.css';
import '../styles/Components.css';

interface Subscription {
  id: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  user: { id: number; fullName: string };
  plan: { id: number; name: string; price: number };
}

interface UserOption { id: number; fullName: string; }
interface PlanOption { id: number; name: string; }

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [form, setForm] = useState({ userId: '', planId: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [subRes, userRes, planRes] = await Promise.all([
        apiClient.get('/subscriptions'),
        apiClient.get('/users'),
        apiClient.get('/plans'),
      ]);
      setSubs(subRes.data);
      setUsers(userRes.data);
      setPlans(planRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/subscriptions', {
        userId: parseInt(form.userId),
        planId: parseInt(form.planId),
      });
      setModalOpen(false);
      setForm({ userId: '', planId: '' });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h1>Suscripciones</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Nueva Suscripción
        </button>
      </div>

      <div className="table-container animate-fade-in-up">
        <table className="data-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Plan</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                  <td key={j}><div className="skeleton" style={{ width: '80%', height: 16 }} /></td>
                ))}</tr>
              ))
            ) : subs.length === 0 ? (
              <tr><td colSpan={5}><div className="table-empty"><ClipboardList size={48} /><p>Sin suscripciones</p></div></td></tr>
            ) : (
              subs.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 600 }}>{sub.user?.fullName ?? '—'}</td>
                  <td>{sub.plan?.name ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(sub.startDate)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(sub.endDate)}</td>
                  <td>
                    <span className={`badge ${sub.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {sub.isActive ? 'Activa' : 'Expirada'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Nueva Suscripción"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
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
            <label>Plan</label>
            <select value={form.planId} onChange={e => setForm({ ...form, planId: e.target.value })} required>
              <option value="">Seleccionar plan...</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
