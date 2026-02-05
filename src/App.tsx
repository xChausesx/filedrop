import React from 'react';
import logo from './logo.svg';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Header from './components/Header';
import Footer from './components/Footer';
import FileDropZone from './components/FileDropZone';

function App() {
  const handleFileSelect = (file: string) => {
    console.log(`Selected file: ${file}`);
  };

  const handleFileDrop = (files: File[]) => {
    console.log('Dropped files:', files);
  };

  return (
    <div className="App">
      <Header />
      <main>
        <h1>Cloud File Manager</h1>
        <FileDropZone onDrop={handleFileDrop} />
        <FileUpload />
        <FileList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
