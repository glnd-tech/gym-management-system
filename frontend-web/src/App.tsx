import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Plans from './pages/Plans';
import Subscriptions from './pages/Subscriptions';
import Attendance from './pages/Attendance';
import Workouts from './pages/Workouts';
import Bookings from './pages/Bookings';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/bookings" element={<Bookings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;