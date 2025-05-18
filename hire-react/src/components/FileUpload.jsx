import React, { useState, useRef } from 'react';
import { FaFileAlt, FaFilePdf, FaFileWord, FaTrash } from 'react-icons/fa';
import './FileUpload.css';

function FileUpload({ id, label, acceptedFormats, onFileChange, disabled }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const dragOverlayRef = useRef(null);
  const MAX_SIZE_MB = 5;

  const handleClick = () => {
  if (fileInputRef.current && !disabled) {
    fileInputRef.current.click();
  }
};


  const resetFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setSelectedFile(null);
    if (typeof onFileChange === 'function') {
      onFileChange(null);
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!acceptedFormats.includes(file.type)) {
      alert(`Invalid file format.`);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds ${MAX_SIZE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    if (typeof onFileChange === 'function') {
      onFileChange(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = ''; // Reset input so re-uploading same file triggers change
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
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const renderIcon = () => {
    if (!selectedFile) return null;
    switch (selectedFile.type) {
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

      <label className="file-upload-label" onClick = {handleClick}>
        <FaFileAlt className="file-icon" /> {label}
      </label>

      <input
        id={id}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
        className="file-input"
        ref={fileInputRef}
        disabled={disabled}
      />

      {selectedFile && (
        <div className="file-details">
          {renderIcon()}
          <div className="file-info">
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</div>
          </div>
          <FaTrash
            className="trash-icon"
            onClick={resetFile}
            title="Remove file"
            aria-label="Remove uploaded file"
          />
        </div>
      )}
    </div>
  );
}

export default FileUpload;
