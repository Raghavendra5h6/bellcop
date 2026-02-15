import { useState, useEffect } from 'react';
import { transactions as txApi } from '../api';
import './History.css';

export default function History() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    from: '',
    to: '',
    sort: 'date',
    order: 'desc',
  });

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    params.sort = filters.sort;
    params.order = filters.order;
    params.limit = 200;
    setLoading(true);
    txApi.list(params).then(setList).finally(() => setLoading(false));
  }, [filters]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <div className="history-page">
      <h1>History</h1>
      <div className="history-filters">
        <input
          type="search"
          placeholder="Search description or category…"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="filter-search"
        />
        <select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
        />
        <input
          type="date"
          placeholder="From"
          value={filters.from}
          onChange={(e) => updateFilter('from', e.target.value)}
        />
        <input
          type="date"
          placeholder="To"
          value={filters.to}
          onChange={(e) => updateFilter('to', e.target.value)}
        />
        <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
          <option value="date">Sort by date</option>
          <option value="amount">Sort by amount</option>
          <option value="category">Sort by category</option>
        </select>
        <select value={filters.order} onChange={(e) => updateFilter('order', e.target.value)}>
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : list.length === 0 ? (
        <p className="muted">No transactions match your filters.</p>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id} className={t.type}>
                  <td>{t.date}</td>
                  <td><span className="badge">{t.type}</span></td>
                  <td>{t.category}</td>
                  <td>{t.description || '—'}</td>
                  <td className="num amount">{t.type === 'income' ? '+' : ''}${Number(t.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
