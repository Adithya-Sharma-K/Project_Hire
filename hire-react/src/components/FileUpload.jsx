import React, { useState, useRef } from 'react';
import { FaFileAlt, FaFilePdf, FaFileWord } from 'react-icons/fa';
import './FileUpload.css';

function FileUpload({ id, label, acceptedFormats, onFileChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const dragOverlayRef = useRef(null);
  const MAX_SIZE_MB = 5;

  const resetFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setSelectedFile(null);
    onFileChange(null);
  };

  const handleFile = (file) => {
    if (!file) {
      resetFile();
      return;
    }

    if (!acceptedFormats.includes(file.type)) {
      alert(`Invalid file format. Allowed: ${acceptedFormats.join(', ')}`);
      resetFile();
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds ${MAX_SIZE_MB}MB.`);
      resetFile();
      return;
    }

    setSelectedFile(file);
    onFileChange(file);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dragOverlayRef.current?.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragOverlayRef.current?.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragOverlayRef.current?.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  };

  const renderIcon = () => {
    switch (selectedFile?.type) {
      case 'application/pdf':
        return <FaFilePdf className="file-type-icon pdf" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="file-type-icon docx" />;
      case 'text/plain':
        return <FaFileAlt className="file-type-icon txt" />;
      default:
        return <FaFileAlt className="file-type-icon" />;
    }
  };

  return (
    <div
      className="file-upload-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div ref={dragOverlayRef} className="drag-overlay">
        <p>Drop file here</p>
      </div>

      <label htmlFor={id} className="file-upload-label" onClick={handleClick}>
        <FaFileAlt className="file-icon" /> {label} ({acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')})
      </label>

      <input
        id={id}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
        className="file-input"
        ref={fileInputRef}
      />

      {selectedFile && (
        <div className="file-details">
          {renderIcon()}
          <div className="file-info">
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
