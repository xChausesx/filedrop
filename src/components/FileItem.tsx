import React from 'react';
import axios from 'axios';

type FileItemProps = {
  fileName: string;
};

const FileItem: React.FC<FileItemProps> = ({ fileName }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/files/${fileName}`); // TODO: Replace with actual backend URL
      alert(`${fileName} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <li>
      {fileName} <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default FileItem;
