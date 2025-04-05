import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import Wizard from "./components/Wizard";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(`${API_URL}/api/crop-multiple`, formData, {
        responseType: "blob"
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "cropped_documents.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("🧨 Cropping failed! Did you feed me darkness and light properly?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="title">
        🪄 Magischer Dokumenten Cropper
      </h1>
      <p className="subtitle">
        JPGs im .zip-Archiv hochladen und dann das Tool zaubern lassen!
      </p>
  
      <div className="file-input-container">
        <label 
          className={`file-input-label ${isDragging ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="file-input-icon">📁</div>
          <div className="file-input-text">
            {files.length > 0 
              ? `${files.length} Datei${files.length > 1 ? 'en' : ''} ausgewählt`
              : 'Dateien hierher ziehen oder klicken zum Auswählen'}
          </div>
          <div className="file-input-hint">
            Unterstützte Formate: JPG, ZIP
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg, .zip"
            multiple
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
      </div>
  
      {files.length > 0 && (
        <div className="file-list">
          <p>📂 Ausgewählte Dateien:</p>
          <ul>
            {files.map((file, i) => (
              <li key={i}>🖼️ {file.name}</li>
            ))}
          </ul>
        </div>
      )}
  
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={loading || !files.length}
      >
        {loading ? "🌀 Dein Zauber wird vorbereitet..." : "🌈 Upload & Crop All"}
      </button>
  
      <Wizard loading={loading} />
  
      <footer className="footer">
        Idee und Entwicklung von der KommuneDigitalSolutions GmbH und Co. KG
      </footer>
    </div>
  );
}

export default App;
