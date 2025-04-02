import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCroppedImage(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/crop", formData, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setCroppedImage(imageUrl);
    } catch (err) {
      alert("Document cropping failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Document Cropper</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: "1rem" }}>
        Upload & Crop
      </button>

      {loading && <p>Processing...</p>}

      {croppedImage && (
        <div>
          <h3>Result:</h3>
          <img src={croppedImage} alt="Cropped Document" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default App;
