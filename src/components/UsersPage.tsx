import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/api';

const formatBytes = (bytes: number): string => {
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(0) + ' MB';
  return (bytes / 1073741824).toFixed(2) + ' GB';
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => { api.getUsers().then(setUsers); }, []);

  return (
    <div>
      <h2>👥 Users & Quotas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {users.map(user => {
          const pct = Math.round((user.usedBytes / user.quotaBytes) * 100);
          const barColor = pct > 90 ? '#e74c3c' : pct > 70 ? '#f39c12' : '#2ecc71';
          return (
            <div key={user.id} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{user.username}</h3>
                <span style={{ background: user.role === 'admin' ? '#e74c3c' : '#3498db', color: '#fff', padding: '2px 10px', borderRadius: 10, fontSize: 11 }}>{user.role}</span>
              </div>
              <p style={{ color: '#666', fontSize: 13, margin: '4px 0' }}>{user.email}</p>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>{formatBytes(user.usedBytes)} / {formatBytes(user.quotaBytes)}</span>
                  <span style={{ fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ background: '#eee', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                  <div style={{ background: barColor, height: '100%', width: `${pct}%`, borderRadius: 6, transition: 'width 0.3s' }} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#999', marginTop: 8, marginBottom: 0 }}>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsersPage;

