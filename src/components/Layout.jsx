import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteAccount(); // your context should handle account deletion
      logout(); // log the user out after deletion
      navigate('/signup'); // redirect to signup or landing page
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <nav className="layout-nav">
          <NavLink to="/" className="layout-brand" end>Finance</NavLink>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/history">History</NavLink>
        </nav>
        <div className="layout-user">
          <span className="layout-email">{user?.email}</span>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Log out
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
