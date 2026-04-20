import React, { useState, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import FolderTree from './components/FolderTree';
import FileExplorer from './components/FileExplorer';
import FileDropZone from './components/FileDropZone';
import AuditPage from './components/AuditPage';
import TagsPage from './components/TagsPage';
import UsersPage from './components/UsersPage';
import * as api from './services/api';

function App() {
  const [activePage, setActivePage] = useState('files');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const handleFileDrop = async (droppedFiles: File[]) => {
    for (const f of droppedFiles) {
      await api.uploadFile(f.name, f.size, f.type || 'application/octet-stream', selectedFolderId, [], 'user-1');
    }
    refresh();
  };

  const handleSearchByTag = (tag: string) => {
    setActivePage('files');
    // The FileExplorer will pick up the tag via its own search
  };

  return (
    <div className="App">
      <Header activePage={activePage} onNavigate={setActivePage} />
      <main style={{ padding: '0 2rem', flex: 1 }}>
        {activePage === 'files' && (
          <>
            <FileDropZone onDrop={handleFileDrop} />
            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
              <FolderTree selectedFolderId={selectedFolderId} onSelectFolder={setSelectedFolderId} refreshKey={refreshKey} />
              <FileExplorer selectedFolderId={selectedFolderId} refreshKey={refreshKey} onRefresh={refresh} />
            </div>
          </>
        )}
        {activePage === 'tags' && <TagsPage onSearchByTag={handleSearchByTag} />}
        {activePage === 'audit' && <AuditPage />}
        {activePage === 'users' && <UsersPage />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
