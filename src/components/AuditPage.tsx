import React, { useState, useEffect } from 'react';
import { AuditEntry } from '../types';
import * as api from '../services/api';

const actionColors: Record<string, string> = {
  UPLOAD: '#2ecc71', DELETE: '#e74c3c', RENAME: '#f39c12', MOVE: '#3498db',
  TAG_ADD: '#9b59b6', TAG_REMOVE: '#e67e22', VERSION_CREATE: '#1abc9c',
  FOLDER_CREATE: '#27ae60', FOLDER_DELETE: '#c0392b', DOWNLOAD: '#2980b9', LOGIN: '#34495e',
};

const AuditPage: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => { api.getAuditLog().then(setEntries); }, []);

  const filtered = entries.filter(e => {
    const q = filter.toLowerCase();
    const matchesText = !q || e.username.toLowerCase().includes(q) || e.targetName.toLowerCase().includes(q) || e.details.toLowerCase().includes(q);
    const matchesAction = !actionFilter || e.action === actionFilter;
    return matchesText && matchesAction;
  });

  const actions = Array.from(new Set(entries.map(e => e.action)));

  return (
    <div>
      <h2>📋 Audit Log</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="🔍 Search audit log..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }} />
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">All actions</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #004080', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Time</th>
            <th style={{ padding: 8 }}>User</th>
            <th style={{ padding: 8 }}>Action</th>
            <th style={{ padding: 8 }}>Target</th>
            <th style={{ padding: 8 }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(e => (
            <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{new Date(e.timestamp).toLocaleString()}</td>
              <td style={{ padding: 8 }}>{e.username}</td>
              <td style={{ padding: 8 }}>
                <span style={{ background: actionColors[e.action] || '#999', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{e.action}</span>
              </td>
              <td style={{ padding: 8 }}><span style={{ fontSize: 11, color: '#666' }}>[{e.targetType}]</span> {e.targetName}</td>
              <td style={{ padding: 8, color: '#555' }}>{e.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>Showing {filtered.length} of {entries.length} entries</p>
    </div>
  );
};

export default AuditPage;

