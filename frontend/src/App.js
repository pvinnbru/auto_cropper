import React, { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("http://localhost:5000/api/crop-multiple", formData, {
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
      alert("Cropping failed. Make sure the images have dark backgrounds and light content.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Multi-Document Cropper</h2>
      <input type="file" accept=".jpg, .zip" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: "1rem" }}>
        Upload & Crop All
      </button>
    </div>
  );
}

export default App;
