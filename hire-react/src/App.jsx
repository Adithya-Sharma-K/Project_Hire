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

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleJdChange = (e) => {
    setJdFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!resumeFile || !jdFile) {
      alert("Please upload both files.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jdFile);

    // Replace this with your actual API endpoint
    fetch('https://your-backend-api.com/upload', {
      method: 'POST',
      body: formData,
    })
    .then(res => res.json())
    .then(data => alert("Upload successful!"))
    .catch(err => alert("Upload failed."));
  };

  return (
    <div className="App">
      <h2>Upload Resume & Job Description</h2>

      <div className="upload-section">
        <label>Resume (PDF, DOCX, TXT):</label>
        <input type="file" accept=".pdf,.docx,.txt" onChange={handleResumeChange} />
        {resumeFile && <p>Selected: {resumeFile.name}</p>}
      </div>

      <div className="upload-section">
        <label>Job Description (PDF, DOCX, TXT):</label>
        <input type="file" accept=".pdf,.docx,.txt" onChange={handleJdChange} />
        {jdFile && <p>Selected: {jdFile.name}</p>}
      </div>

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;
