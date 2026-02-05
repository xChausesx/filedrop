import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileDropZone.css';

type FileDropZoneProps = {
  onDrop: (files: File[]) => void;
};

const FileDropZone: React.FC<FileDropZoneProps> = ({ onDrop }) => {
  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop: onDropCallback });

  return (
    <div {...getRootProps()} className="file-drop-zone">
      <input {...getInputProps()} />
      <p>Drag & drop some files here, or click to select files</p>
    </div>
  );
};

export default FileDropZone;
