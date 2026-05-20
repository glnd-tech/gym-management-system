import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Dumbbell } from 'lucide-react';
import '../styles/DataTable.css';
import '../styles/Components.css';

interface Workout {
  id: number;
  name: string;
  description: string;
  scheduledAt: string;
  capacity: number;
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Workout | null>(null);
  const [deleteItem, setDeleteItem] = useState<Workout | null>(null);
  const [form, setForm] = useState({ name: '', description: '', scheduledAt: '', capacity: '' });
  const [saving, setSaving] = useState(false);

  const fetchWorkouts = async () => {
    try {
      const res = await apiClient.get('/workouts');
      setWorkouts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '', scheduledAt: '', capacity: '' });
    setModalOpen(true);
  };

  const openEdit = (w: Workout) => {
    setEditItem(w);
    const dt = new Date(w.scheduledAt);
    const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setForm({ name: w.name, description: w.description, scheduledAt: local, capacity: String(w.capacity) });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { name: form.name, description: form.description, scheduledAt: form.scheduledAt, capacity: parseInt(form.capacity) };
      if (editItem) {
        await apiClient.patch(`/workouts/${editItem.id}`, data);
      } else {
        await apiClient.post('/workouts', data);
      }
      setModalOpen(false);
      fetchWorkouts();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await apiClient.delete(`/workouts/${deleteItem.id}`);
      setDeleteItem(null);
      fetchWorkouts();
    } catch (err) { console.error(err); }
  };

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('es-HN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="page-header">
        <h1>Clases</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Nueva Clase
        </button>
      </div>

      <div className="table-container animate-fade-in-up">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha y Hora</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                  <td key={j}><div className="skeleton" style={{ width: '80%', height: 16 }} /></td>
                ))}</tr>
              ))
            ) : workouts.length === 0 ? (
              <tr><td colSpan={5}><div className="table-empty"><Dumbbell size={48} /><p>No hay clases programadas</p></div></td></tr>
            ) : (
              workouts.map(w => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 600 }}>{w.name}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.description}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDateTime(w.scheduledAt)}</td>
                  <td><span className="badge badge-accent">{w.capacity} personas</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => openEdit(w)} title="Editar"><Pencil size={16} /></button>
                      <button className="table-action-btn danger" onClick={() => setDeleteItem(w)} title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title={editItem ? 'Editar Clase' : 'Nueva Clase'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="form-field">
            <label>Nombre</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Zumba Masterclass" required />
          </div>
          <div className="form-field">
            <label>Descripción</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Fecha y Hora</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} required />
            </div>
            <div className="form-field">
              <label>Capacidad</label>
              <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        title="Eliminar Clase"
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteItem(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </>
        }
      >
        <p className="confirm-text">¿Eliminar la clase <strong>{deleteItem?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
