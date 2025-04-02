import React, { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
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
    <div
      style={{
        padding: "2rem",
        fontFamily: "Comic Sans MS, sans-serif",
        textAlign: "center",
        background: "#f5f7fa",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#333" }}>
        🪄 Magischer Dokumenten Cropper
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#666" }}>
        JPGs im .zip-Archiv hochladen und dann das Tool zaubern lassen!
      </p>
  
      <input
        type="file"
        accept=".jpg, .zip"
        multiple
        onChange={handleFileChange}
        style={{
          margin: "1rem auto",
          display: "block",
          fontSize: "1rem",
        }}
      />
  
      {files.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <p>📂 You’re uploading:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {files.map((file, i) => (
              <li key={i}>🖼️ {file.name}</li>
            ))}
          </ul>
        </div>
      )}
  
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
          color: "white",
          border: "none",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        {loading ? "🌀 Dein Zauber wird vorbereitet..." : "🌈 Upload & Crop All"}
      </button>
  
      {/* Floating friend character */}
      <img
        src="/wizard-friend.png"
        alt="Crop Wizard"
        style={{
          position: "fixed",
          bottom: "-13px",
          right: 0,
          width: "30vw", // 3x bigger
          animation: "float 3s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Funny speech bubble */}
      <div
        style={{
          position: "fixed",
          bottom: "330px",
          right: "360px", // next to wizard
          backgroundColor: "#fff",
          padding: "0.75rem 1rem",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          fontSize: "0.95rem",
          maxWidth: "220px",
          transform: "rotate(-2deg)",
          zIndex: 2,
        }}
      >
        {loading
          ? "⚡ Hokus Pokus, ich schneid den Kram zusammen..."
          : "Ich bin der Crop-Wizard. Gib mir was zum Schnippeln!"}
      </div>

  
      <footer style={{ marginTop: "4rem", fontSize: "0.9rem", color: "#aaa" }}>
        Idee und Entwicklung von der KommuneDigitalSolutions GmbH und Co. KG
      </footer>
  
      {/* Floating animation keyframes */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
  
}

export default App;
