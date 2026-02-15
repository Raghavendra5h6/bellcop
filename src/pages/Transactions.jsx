import { useState, useEffect } from 'react';
import { transactions as txApi } from '../api';
import './Transactions.css';

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Shopping', 'Health', 'Salary', 'Other'];

export default function Transactions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: 'Food',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    txApi.list({ sort: 'date', order: 'desc', limit: 20 }).then(setList).finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (Number.isNaN(amount)) return;
    setSubmitting(true);
    try {
      await txApi.create({
        amount: Math.abs(amount) * (form.type === 'expense' ? -1 : 1),
        type: form.type,
        category: form.category,
        description: form.description.trim(),
        date: form.date,
      });
      setForm({ ...form, amount: '', description: '' });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await txApi.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Amount
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </label>
          <label>
            Type
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
        </div>
        <label>
          Description (optional)
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Groceries"
          />
        </label>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add transaction'}
        </button>
      </form>

      <section className="transaction-list-section">
        <h2>Recent</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : list.length === 0 ? (
          <p className="muted">No transactions yet. Add one above.</p>
        ) : (
          <ul className="transaction-list">
            {list.map((t) => (
              <li key={t.id} className={`transaction-item ${t.type}`}>
                <div className="tx-main">
                  <span className="tx-category">{t.category}</span>
                  {t.description && <span className="tx-desc">{t.description}</span>}
                  <span className="tx-date">{t.date}</span>
                </div>
                <div className="tx-right">
                  <span className="tx-amount">{t.type === 'income' ? '+' : ''}${Number(t.amount).toFixed(2)}</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleDelete(t.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
