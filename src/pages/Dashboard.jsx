import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactions as txApi } from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    txApi.summary().then((data) => {
      if (!cancelled) setSummary(data);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="summary-cards">
        <div className="summary-card income">
          <span className="summary-label">Income</span>
          <span className="summary-value">${Number(summary.income).toFixed(2)}</span>
        </div>
        <div className="summary-card expense">
          <span className="summary-label">Expenses</span>
          <span className="summary-value">${Math.abs(Number(summary.expense)).toFixed(2)}</span>
        </div>
        <div className="summary-card balance">
          <span className="summary-label">Balance</span>
          <span className="summary-value">${Number(summary.balance).toFixed(2)}</span>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link to="/transactions" className="btn">Add transaction</Link>
        <Link to="/history" className="btn btn-ghost">View history</Link>
      </div>
    </div>
  );
}
