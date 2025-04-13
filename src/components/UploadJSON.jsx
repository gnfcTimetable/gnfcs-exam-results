// src/components/UploadJSON.jsx
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

function UploadJSON() {
  const [jsonFile, setJsonFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setJsonFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!jsonFile) {
      setMessage("Please select a JSON file first.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        for (const schNo in jsonData) {
          const student = jsonData[schNo];
          const className = student.Class || "Unknown";
          const docRef = doc(db, "results", className, "students", schNo);
          await setDoc(docRef, student);
        }

        setMessage("All records uploaded successfully!");
      } catch (error) {
        console.error("Error uploading data:", error);
        setMessage("Failed to upload. Check your JSON format.");
      }
    };

    reader.readAsText(jsonFile);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload JSON Result File</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
      <p className="mt-4 text-green-600">{message}</p>
    </div>
  );
}

export default UploadJSON;
