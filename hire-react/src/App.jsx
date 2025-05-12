import React, { useState } from 'react';
import './App.css';
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import FileUpload from './components/FileUpload';

function App() {
  // Common accepted formats
  const acceptedFormats = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (type, file) => {
    if (type === 'resume') setResumeFile(file);
    if (type === 'jd') {
      setJdFile(file);
      setJdText('');
    }
  };

  const handleJdTextChange = (e) => {
    setJdText(e.target.value);
    setJdFile(null);
  };

  const validateUpload = () => {
    if (!resumeFile) return 'Please upload your resume.';
    if (!jdFile && jdText.trim() === '') return 'Please provide a Job Description.';
    return null;
  };

  const handleSubmit = () => {
    const errorMsg = validateUpload();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setUploadStatus(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    jdFile
      ? formData.append('jobDescriptionFile', jdFile)
      : formData.append('jobDescriptionText', jdText);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://your-api.com/upload', true); // Replace with real URL

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setUploadStatus('success');
        alert('Upload successful!');
      } else {
        setUploadStatus('error');
        alert('Upload failed.');
      }
      resetForm();
    };

    xhr.onerror = () => {
      setUploadStatus('error');
      alert('Network error. Please try again.');
      resetForm();
    };

    setUploadProgress(0);
    xhr.send(formData);
  };

  const resetForm = () => {
    setTimeout(() => {
      setResumeFile(null);
      setJdFile(null);
      setJdText('');
      setUploadStatus(null);
      setUploadProgress(0);
    }, 3000);
  };

  return (
    <div className="app-container">
      <div className="upload-card">
        <h2><FaCloudUploadAlt className="upload-icon" /> Upload Documents</h2>

        <FileUpload
          id="resume-upload"
          label="Upload Resume"
          acceptedFormats={acceptedFormats}
          onFileChange={(file) => handleFileChange('resume', file)}
        />

        <div className="upload-section">
          <label>📝 Job Description (Choose file OR type below)</label>
          <FileUpload
            id="jd-upload"
            label="Upload Job Description"
            acceptedFormats={acceptedFormats}
            onFileChange={(file) => handleFileChange('jd', file)}
          />
          <div className="separator">or</div>
          <textarea
            placeholder="Type or paste the job description here..."
            rows="6"
            value={jdText}
            onChange={handleJdTextChange}
            className="text-area"
          ></textarea>
        </div>

        <div className="upload-section center">
          <button
            className="upload-btn"
            onClick={handleSubmit}
            disabled={uploadStatus === 'success'}
          >
            <FaCloudUploadAlt className="upload-icon-btn" /> {uploadStatus === 'success' ? 'Uploaded!' : 'Submit'}
          </button>

          {uploadStatus === 'success' && <FaCheckCircle className="status-icon success" />}
          {uploadStatus === 'error' && <FaTimesCircle className="status-icon error" />}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
