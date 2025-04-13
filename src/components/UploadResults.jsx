// UploadResults.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { db } from './firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

const UploadResults = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row) => {
          // Normalize and clean all keys
          const cleanedRow = {};
          for (let key in row) {
            if (key) {
              const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, '');
              cleanedRow[normalizedKey] = row[key]?.trim() || '';
            }
          }
          return cleanedRow;
        });
        setCsvData(parsedData);
      },
    });
  };

  const handleUploadToFirebase = async () => {
    setUploadStatus('Uploading...');

    try {
      for (const entry of csvData) {
        const schNo = entry.schoolnumber;
        const className = entry.class;
        const year = entry.year;
        const exam = entry.exam;

        if (!schNo || !className || !year || !exam) continue;

        const path = `results/${year}/${className}/${exam}/${schNo}`;
        const ref = doc(db, path);

        await setDoc(ref, entry, { merge: true });
      }

      setUploadStatus('✅ Upload complete!');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('❌ Upload failed. See console for errors.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📤 Upload Exam Results</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <br /><br />
      {csvData.length > 0 && (
        <button onClick={handleUploadToFirebase}>Upload to Firebase</button>
      )}
      <p>{uploadStatus}</p>
    </div>
  );
};

export default UploadResults;
