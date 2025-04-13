// src/UploadData.jsx
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const UploadData = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonData(parsed);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!jsonData || jsonData.length === 0) {
      alert("No data found in the file.");
      return;
    }

    try {
      for (const row of jsonData) {
        const [
          examName,
          schoolNumber,
          name,
          studentClass,
          examCode,
          Lang,
          Lit,
          English,
          Hindi,
          Punjabi,
          History,
          Gepgraphy,
          SST,
          Mathematics,
          Physics,
          Chemistry,
          Biology,
          Science,
          Economics,
          Commerce,
          Accounts,
          Computer,
          PE,
          Arts,
          GK,
          Divinity,
          Total,
          Percentage,
          RANK,
          Remarks,
          Year,
        ] = row;

        const studentRef = doc(
          db,
          "results",
          examName,
          "classes",
          studentClass,
          "students",
          String(schoolNumber)
        );

        await setDoc(studentRef, {
          name,
          schoolNumber,
          examCode,
          Lang,
          Lit,
          English,
          Hindi,
          Punjabi,
          History,
          Gepgraphy,
          SST,
          Mathematics,
          Physics,
          Chemistry,
          Biology,
          Science,
          Economics,
          Commerce,
          Accounts,
          Computer,
          PE,
          Arts,
          GK,
          Divinity,
          Total,
          Percentage,
          RANK,
          Remarks,
          Year,
        });
      }

      alert("✅ Exam results uploaded successfully.");
    } catch (error) {
      alert("❌ Failed to upload result data: " + error.message);
    }
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Result</button>
    </div>
  );
};

export default UploadData;
