import React, { useState, useEffect } from 'react';
import { FileMetadata, Folder } from '../types';
import * as api from '../services/api';

interface FileExplorerProps {
  selectedFolderId: string | null;
  refreshKey?: number;
  onRefresh: () => void;
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1073741824).toFixed(2) + ' GB';
};

const FileExplorer: React.FC<FileExplorerProps> = ({ selectedFolderId, refreshKey, onRefresh }) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [versionComment, setVersionComment] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    loadFiles();
    api.getFolders().then(setFolders);
  }, [selectedFolderId, refreshKey]);

  const loadFiles = async () => {
    if (search || tagFilter) {
      const results = await api.searchFiles(search, tagFilter || undefined);
      setFiles(selectedFolderId ? results.filter(f => f.folderId === selectedFolderId) : results);
    } else {
      const result = await api.getFiles(selectedFolderId === null ? undefined : selectedFolderId);
      setFiles(result);
    }
  };

  useEffect(() => {
    const t = setTimeout(loadFiles, 300);
    return () => clearTimeout(t);
  }, [search, tagFilter]);

  const getFolderName = (folderId: string | null) => {
    if (!folderId) return 'Root';
    return folders.find(f => f.id === folderId)?.name || 'Unknown';
  };

  const handleDelete = async (file: FileMetadata) => {
    if (window.confirm(`Delete "${file.name}"?`)) {
      await api.deleteFile(file.id, 'user-1');
      if (selectedFile?.id === file.id) setSelectedFile(null);
      onRefresh();
      loadFiles();
    }
  };

  const handleRename = async (id: string) => {
    if (renameValue.trim()) {
      await api.renameFile(id, renameValue.trim(), 'user-1');
      setRenameId(null);
      onRefresh();
      loadFiles();
    }
  };

  const handleMove = async (fileId: string, newFolderId: string | null) => {
    await api.moveFile(fileId, newFolderId, 'user-1');
    onRefresh();
    loadFiles();
  };

  const handleAddTag = async () => {
    if (selectedFile && newTag.trim()) {
      const updated = await api.addTagToFile(selectedFile.id, newTag.trim().toLowerCase(), 'user-1');
      if (updated) setSelectedFile(updated);
      setNewTag('');
      loadFiles();
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (selectedFile) {
      const updated = await api.removeTagFromFile(selectedFile.id, tag, 'user-1');
      if (updated) setSelectedFile(updated);
      loadFiles();
    }
  };

  const handleNewVersion = async () => {
    if (selectedFile && versionComment.trim()) {
      const newSize = selectedFile.size + Math.floor(Math.random() * 50000);
      const updated = await api.createFileVersion(selectedFile.id, newSize, versionComment.trim(), 'user-1');
      if (updated) setSelectedFile(updated);
      setVersionComment('');
      loadFiles();
    }
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search files by name or tag..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
        />
        <input
          value={tagFilter} onChange={e => setTagFilter(e.target.value)}
          placeholder="Filter by tag..."
          style={{ width: 160, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
        />
      </div>

      {/* File list */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #004080', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Size</th>
            <th style={{ padding: 8 }}>Folder</th>
            <th style={{ padding: 8 }}>Tags</th>
            <th style={{ padding: 8 }}>Version</th>
            <th style={{ padding: 8 }}>Updated</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id} style={{ borderBottom: '1px solid #eee', background: selectedFile?.id === file.id ? '#e3f2fd' : undefined, cursor: 'pointer' }}
              onClick={() => setSelectedFile(file)}>
              <td style={{ padding: 8 }}>
                {renameId === file.id ? (
                  <span style={{ display: 'flex', gap: 4 }}>
                    <input value={renameValue} onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRename(file.id)}
                      style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc' }} autoFocus />
                    <button onClick={(e) => { e.stopPropagation(); handleRename(file.id); }} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4 }}>✓</button>
                  </span>
                ) : (
                  <span>📄 {file.name}</span>
                )}
              </td>
              <td style={{ padding: 8 }}>{formatSize(file.size)}</td>
              <td style={{ padding: 8 }}>{getFolderName(file.folderId)}</td>
              <td style={{ padding: 8 }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {file.tags.map(t => (
                    <span key={t} style={{ background: '#e8f4fd', color: '#004080', padding: '1px 6px', borderRadius: 10, fontSize: 11 }}>{t}</span>
                  ))}
                </div>
              </td>
              <td style={{ padding: 8 }}>v{file.currentVersion}</td>
              <td style={{ padding: 8 }}>{new Date(file.updatedAt).toLocaleDateString()}</td>
              <td style={{ padding: 8 }}>
                <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setRenameId(file.id); setRenameValue(file.name); }} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>✏️</button>
                  <button onClick={() => handleDelete(file)} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#e74c3c' }}>🗑</button>
                  <select onChange={(e) => { if (e.target.value !== '') handleMove(file.id, e.target.value === 'null' ? null : e.target.value); e.target.value = ''; }}
                    style={{ fontSize: 11, padding: '2px 4px', borderRadius: 4 }} defaultValue="">
                    <option value="" disabled>Move to...</option>
                    <option value="null">Root</option>
                    {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </td>
            </tr>
          ))}
          {files.length === 0 && (
            <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#999' }}>No files found</td></tr>
          )}
        </tbody>
      </table>

      {/* Detail panel */}
      {selectedFile && (
        <div style={{ marginTop: 20, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>📄 {selectedFile.name}</h3>
            <button onClick={() => setSelectedFile(null)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 4, background: '#999' }}>Close</button>
          </div>
          <p style={{ color: '#666', fontSize: 13, margin: '4px 0' }}>
            {formatSize(selectedFile.size)} • {selectedFile.mimeType} • Created by {selectedFile.createdBy} • {new Date(selectedFile.createdAt).toLocaleString()}
          </p>

          {/* Tags management */}
          <div style={{ marginTop: 12 }}>
            <strong>Tags:</strong>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, alignItems: 'center' }}>
              {selectedFile.tags.map(t => (
                <span key={t} style={{ background: '#004080', color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {t}
                  <span onClick={() => handleRemoveTag(t)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</span>
                </span>
              ))}
              <span style={{ display: 'flex', gap: 4 }}>
                <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag"
                  style={{ width: 80, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', fontSize: 12 }}
                  onKeyDown={e => e.key === 'Enter' && handleAddTag()} />
                <button onClick={handleAddTag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>+</button>
              </span>
            </div>
          </div>

          {/* Versions */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>Versions ({selectedFile.versions.length}):</strong>
              <button onClick={() => setShowVersions(!showVersions)} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>
                {showVersions ? 'Hide' : 'Show'}
              </button>
            </div>
            {showVersions && (
              <div style={{ marginTop: 8 }}>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                      <th style={{ padding: 4 }}>Ver</th>
                      <th style={{ padding: 4 }}>Size</th>
                      <th style={{ padding: 4 }}>Date</th>
                      <th style={{ padding: 4 }}>By</th>
                      <th style={{ padding: 4 }}>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFile.versions.map(v => (
                      <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 4 }}>v{v.versionNumber}</td>
                        <td style={{ padding: 4 }}>{formatSize(v.size)}</td>
                        <td style={{ padding: 4 }}>{new Date(v.uploadedAt).toLocaleString()}</td>
                        <td style={{ padding: 4 }}>{v.uploadedBy}</td>
                        <td style={{ padding: 4 }}>{v.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  <input value={versionComment} onChange={e => setVersionComment(e.target.value)} placeholder="Version comment"
                    style={{ flex: 1, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 12 }}
                    onKeyDown={e => e.key === 'Enter' && handleNewVersion()} />
                  <button onClick={handleNewVersion} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 4 }}>+ New Version</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;

