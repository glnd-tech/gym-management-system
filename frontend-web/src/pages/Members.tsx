import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Modal from '../components/Modal';
import { Plus, Search, UserPlus } from 'lucide-react';
import '../styles/DataTable.css';
import '../styles/Components.css';

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function Members() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/users', form);
      setModalOpen(false);
      setForm({ fullName: '', email: '', password: '', phoneNumber: '' });
      fetchUsers();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h1>Miembros</h1>
        <div className="page-header-actions">
          <div className="search-bar">
            <Search size={16} />
            <input
              placeholder="Buscar miembros..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Nuevo Miembro
          </button>
        </div>
      </div>

      <div className="table-container animate-fade-in-up">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ width: '80%', height: 16 }} /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6}><div className="table-empty"><UserPlus size={48} /><p>No hay miembros registrados</p></div></td></tr>
            ) : (
              filtered.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 600 }}>{user.fullName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td>{user.phoneNumber || '—'}</td>
                  <td><span className={`badge ${user.role === 'ADMIN' ? 'badge-accent' : 'badge-info'}`}>{user.role}</span></td>
                  <td><span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>{user.isActive ? 'Activo' : 'Inactivo'}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Nuevo Miembro"
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
            <label>Nombre Completo</label>
            <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-field">
              <label>Teléfono</label>
              <input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
            </div>
          </div>
          <div className="form-field">
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
        </form>
      </Modal>
    </div>
  );
}
