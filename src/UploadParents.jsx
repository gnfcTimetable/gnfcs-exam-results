// src/UploadParents.jsx
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const UploadParents = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonData(parsed);
        console.log("✅ JSON Loaded for Parents:", parsed);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!jsonData || jsonData.length === 0) {
      alert("No parent data found in the file.");
      return;
    }

    try {
      for (const row of jsonData) {
        const [schoolNumber, email1, email2] = row;

        if (!schoolNumber) {
          console.warn("❌ Skipping row with missing School Number:", row);
          continue;
        }

        const schoolStr = String(schoolNumber);

        const parentRef = doc(db, "parents", schoolStr);

        await setDoc(parentRef, {
          email1: email1 || "",
          email2: email2 || "",
        });

        console.log(`✅ Uploaded parent info for School No: ${schoolStr}`);
      }

      alert("✅ Parent info uploaded successfully.");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("❌ Failed to upload parent data: " + error.message);
    }
  };

  return (
    <div>
      <h2>👨‍👩‍👧 Upload Parent Info (JSON)</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Parents</button>
    </div>
  );
};

export default UploadParents;
