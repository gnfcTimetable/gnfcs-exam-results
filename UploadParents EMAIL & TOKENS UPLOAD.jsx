import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const UploadParents = () => {
  const [jsonData, setJsonData] = useState(null);

  // Token generator: 8-character alphanumeric
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonData(parsed);
        console.log("✅ JSON Loaded:", parsed);
      } catch (err) {
        alert("❌ Invalid JSON file.");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!jsonData || jsonData.length === 0) {
      alert("❌ No data found in the file.");
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
        const token = generateToken();

        const parentRef = doc(db, "parents", schoolStr);

        await setDoc(parentRef, {
          email1: email1 || "",
          email2: email2 || "",
          token,
        });

        console.log(`✅ Uploaded for School No: ${schoolStr}`);
      }

      alert("✅ Parent info and tokens uploaded successfully.");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("❌ Failed to upload data: " + error.message);
    }
  };

  return (
    <div>
      <h2>📤 Upload Parent Info + Token</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to Firebase</button>
    </div>
  );
};

export default UploadParents;
