import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Modal from '../components/Modal';
import { Plus, Calendar, Check, Pencil, Trash2 } from 'lucide-react';
import '../styles/Components.css';

interface Plan {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  isActive: boolean;
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [deleteModal, setDeleteModal] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: '', price: '', durationDays: '' });
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await apiClient.get('/plans');
      setPlans(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditPlan(null);
    setForm({ name: '', price: '', durationDays: '' });
    setModalOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditPlan(plan);
    setForm({ name: plan.name, price: String(plan.price), durationDays: String(plan.durationDays) });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { name: form.name, price: parseFloat(form.price), durationDays: parseInt(form.durationDays) };
      if (editPlan) {
        await apiClient.patch(`/plans/${editPlan.id}`, data);
      } else {
        await apiClient.post('/plans', data);
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await apiClient.delete(`/plans/${deleteModal.id}`);
      setDeleteModal(null);
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(val);

  return (
    <div>
      <div className="page-header">
        <h1>Planes</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Nuevo Plan
        </button>
      </div>

      {loading ? (
        <div className="plans-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="plan-card"><div className="skeleton" style={{ width: '100%', height: 200 }} /></div>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="table-empty" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
          <p>No hay planes creados</p>
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map((plan, i) => (
            <div key={plan.id} className={`plan-card animate-fade-in-up delay-${i + 1}`}>
              <div className="plan-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="plan-card-name">{plan.name}</div>
                  <span className={`badge ${plan.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {plan.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="plan-card-price">
                  <span className="amount">{formatCurrency(plan.price)}</span>
                </div>
              </div>
              <div className="plan-card-detail">
                <Calendar size={16} />
                <span>{plan.durationDays} días de duración</span>
              </div>
              <div className="plan-card-detail">
                <Check size={16} />
                <span>Acceso completo al gimnasio</span>
              </div>
              <div className="plan-card-actions">
                <button className="btn btn-secondary" onClick={() => openEdit(plan)}>
                  <Pencil size={14} /> Editar
                </button>
                <button className="btn btn-danger" onClick={() => setDeleteModal(plan)}>
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editPlan ? 'Editar Plan' : 'Nuevo Plan'}
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
            <label>Nombre del Plan</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Plan Estudiante" required />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Precio</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-field">
              <label>Duración (días)</label>
              <input type="number" value={form.durationDays} onChange={e => setForm({ ...form, durationDays: e.target.value })} required />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        title="Eliminar Plan"
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </>
        }
      >
        <p className="confirm-text">¿Estás seguro de eliminar el plan <strong>{deleteModal?.name}</strong>? Esta acción no se puede deshacer.</p>
      </Modal>
    </div>
  );
}
