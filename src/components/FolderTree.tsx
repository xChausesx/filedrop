import React, { useState, useEffect } from 'react';
import { Folder } from '../types';
import * as api from '../services/api';

interface FolderTreeProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  refreshKey?: number;
}

const FolderTree: React.FC<FolderTreeProps> = ({ selectedFolderId, onSelectFolder, refreshKey }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingIn, setCreatingIn] = useState<string | null | undefined>(undefined); // undefined = not creating

  useEffect(() => {
    api.getFolders().then(setFolders);
  }, [refreshKey]);

  const buildTree = (parentId: string | null): Folder[] => {
    return folders.filter(f => f.parentId === parentId);
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    await api.createFolder(newFolderName.trim(), creatingIn ?? null, 'user-1');
    setNewFolderName('');
    setCreatingIn(undefined);
    api.getFolders().then(setFolders);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this folder? Files will be moved to root.')) {
      await api.deleteFolder(id, 'user-1');
      if (selectedFolderId === id) onSelectFolder(null);
      api.getFolders().then(setFolders);
    }
  };

  const renderFolder = (folder: Folder, depth: number): React.ReactNode => {
    const children = buildTree(folder.id);
    const isExpanded = expanded.has(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id} style={{ marginLeft: depth * 16 }}>
        <div
          onClick={() => { onSelectFolder(folder.id); toggleExpand(folder.id); }}
          style={{
            padding: '6px 10px', cursor: 'pointer', borderRadius: 6,
            background: isSelected ? '#e3f2fd' : 'transparent',
            display: 'flex', alignItems: 'center', gap: 6,
            fontWeight: isSelected ? 600 : 400,
          }}
        >
          <span style={{ fontSize: 12 }}>{children.length > 0 ? (isExpanded ? '▼' : '▶') : '  '}</span>
          <span>📁</span>
          <span style={{ flex: 1 }}>{folder.name}</span>
          <button onClick={(e) => { e.stopPropagation(); setCreatingIn(folder.id); }} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4 }} title="New subfolder">+</button>
          <button onClick={(e) => handleDelete(folder.id, e)} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: '#e74c3c' }} title="Delete">×</button>
        </div>
        {isExpanded && children.map(c => renderFolder(c, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 12, minWidth: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong>📂 Folders</strong>
        <button onClick={() => setCreatingIn(null)} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4 }}>+ Root</button>
      </div>

      <div
        onClick={() => onSelectFolder(null)}
        style={{
          padding: '6px 10px', cursor: 'pointer', borderRadius: 6,
          background: selectedFolderId === null ? '#e3f2fd' : 'transparent',
          fontWeight: selectedFolderId === null ? 600 : 400, marginBottom: 4,
        }}
      >
        🏠 All Files
      </div>

      {buildTree(null).map(f => renderFolder(f, 0))}

      {creatingIn !== undefined && (
        <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
          <input
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            style={{ flex: 1, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <button onClick={handleCreate} style={{ padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>OK</button>
          <button onClick={() => { setCreatingIn(undefined); setNewFolderName(''); }} style={{ padding: '4px 8px', borderRadius: 4, fontSize: 12, background: '#999' }}>✕</button>
        </div>
      )}
    </div>
  );
};

export default FolderTree;

