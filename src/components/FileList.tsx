import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileItem from './FileItem';

const FileList: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    // Mocked backend URL
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files'); // TODO: Replace with actual backend URL
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file, index) => (
          <FileItem key={index} fileName={file} />
        ))}
      </ul>
    </div>
  );
};

export default FileList;
