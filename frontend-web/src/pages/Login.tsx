import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Activity, Sun, Moon, AlertCircle } from 'lucide-react';
import loginBg from '../assets/login-bg.png';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Credenciales incorrectas o error en el servidor';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left — Image Panel */}
      <div className="login-image-panel">
        <img src={loginBg} alt="Interior de gimnasio moderno" />
        <div className="login-image-overlay" />
        <div className="login-image-content">
          <h1>
            Transforma tu <span>gestión</span>
          </h1>
          <p>
            Panel de administración inteligente para tu gimnasio. Controla miembros, planes, suscripciones y más desde un solo lugar.
          </p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="login-form-panel">
        <button className="login-theme-toggle" onClick={toggleTheme} title="Cambiar tema">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="login-form-container">
          <div className="login-logo">
            <div className="login-logo-icon">
              <Activity size={24} />
            </div>
            <div className="login-logo-text">
              Gym<span>Sys</span>
            </div>
          </div>

          <div className="login-welcome">
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales para acceder al panel</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && (
              <div className="login-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email">Correo Electrónico</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}