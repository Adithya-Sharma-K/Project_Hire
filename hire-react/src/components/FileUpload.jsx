import React, { useState, useRef, useCallback } from 'react';
import { FaFileAlt, FaFilePdf, FaFileWord } from 'react-icons/fa';
import './FileUpload.css'; // Create this CSS file

function FileUpload({ id, label, acceptedFormats, onFileChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const dragOverlayRef = useRef(null);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (dragOverlayRef.current) {
      dragOverlayRef.current.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (dragOverlayRef.current) {
      dragOverlayRef.current.classList.remove('drag-over');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragOverlayRef.current) {
      dragOverlayRef.current.classList.remove('drag-over');
    }
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    const MAX_SIZE_MB = 5;
  
    if (!file) {
      setSelectedFile(null);
      onFileChange(null);
      return;
    }
  
    if (!acceptedFormats.includes(file.type)) {
      alert(`Invalid file format. Please upload a file with one of the following formats: ${acceptedFormats.join(', ')}`);
      resetFileInput();
      return;
    }
  
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds ${MAX_SIZE_MB}MB. Please upload a smaller file.`);
      resetFileInput();
      return;
    }
  
    setSelectedFile(file);
    onFileChange(file);
  };
  
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setSelectedFile(null);
    onFileChange(null);
  };
  

  const handleClick = () => {
    fileInputRef.current.click();
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
        <FaFileAlt className="file-icon" /> {label} ({acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')})
      </label>
      <input
        id={id}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
        className="file-input"
        ref={fileInputRef}
      />
      {/* {selectedFile && (
        <div className="file-details">
          {selectedFile.type === 'application/pdf' && <FaFilePdf className="file-type-icon pdf" />}
          {selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && <FaFileWord className="file-type-icon docx" />}
          {selectedFile.type === 'text/plain' && <FaFileAlt className="file-type-icon txt" />}
          <span>{selectedFile.name}</span>
        </div>
      )} */}
      {selectedFile && (
    <div className="file-details">
        {selectedFile.type === 'application/pdf' && <FaFilePdf className="file-type-icon pdf" />}
        {selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && <FaFileWord className="file-type-icon docx" />}
        {selectedFile.type === 'text/plain' && <FaFileAlt className="file-type-icon txt" />}
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