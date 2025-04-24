// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useState } from 'react';
import './App.css';
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import FileUpload from './components/FileUpload'; // Import the FileUpload component

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleResumeChange = (file) => {
    setResumeFile(file);
  };

  const handleJdFileChange = (file) => {
    setJdFile(file);
    setJdText(''); // Clear text if file is selected
  };

  const handleJdTextChange = (e) => {
    setJdText(e.target.value);
    setJdFile(null); // Clear file if text is typed
  };

  const handleSubmit = async () => {
    if (!resumeFile) {
      alert("Please upload your resume.");
      return;
    }

    if (!jdFile && jdText.trim() === '') {
      alert("Please upload a Job Description file or enter the description.");
      return;
    }

    setUploadStatus(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);

    if (jdFile) {
      formData.append('jobDescriptionFile', jdFile);
    } else {
      formData.append('jobDescriptionText', jdText);
    }

    try {
      const response = await fetch('https://your-api.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        setUploadStatus('error');
        alert(`Upload failed: ${errorData.message || 'An unexpected error occurred.'}`);
        return;
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      setUploadStatus('success');
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus('error');
      alert("Upload failed. Please try again later.");
    } finally {
      setTimeout(() => {
        setResumeFile(null);
        setJdFile(null);
        setJdText('');
        setUploadStatus(null);
      }, 3000);
    }
  };

  return (
    <div className="app-container">
      <div className="upload-card">
        <h2><FaCloudUploadAlt className="upload-icon" /> Upload Documents</h2>

        <FileUpload
          id="resume-upload"
          label="Upload Resume"
          acceptedFormats={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']}
          onFileChange={handleResumeChange}
        />

        <div className="upload-section">
          <label>📝 Job Description (Choose file OR type below)</label>
          <FileUpload
            id="jd-upload"
            label="Upload Job Description"
            acceptedFormats={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']}
            onFileChange={handleJdFileChange}
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
          <button className="upload-btn" onClick={handleSubmit} disabled={uploadStatus === 'success'}>
            <FaCloudUploadAlt className="upload-icon-btn" /> {uploadStatus === 'success' ? 'Uploaded!' : 'Submit'}
          </button>
          {uploadStatus === 'success' && <FaCheckCircle className="status-icon success" />}
          {uploadStatus === 'error' && <FaTimesCircle className="status-icon error" />}
        </div>
      </div>
    </div>
  );
}

export default App;