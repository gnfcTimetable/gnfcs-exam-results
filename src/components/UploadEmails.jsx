import React, { useState } from "react";
import Papa from "papaparse";
import { db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

const normalize = (text) =>
  text?.toString().trim().toLowerCase().replace(/\s+/g, "");

const UploadEmails = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [successCount, setSuccessCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: "", // auto-detects CSV or TSV
      transformHeader: normalize,
      complete: function (results) {
        const cleaned = results.data.map((row) => {
          const newRow = {};
          for (const key in row) {
            newRow[normalize(key)] = row[key]?.toString().trim() || "";
          }
          return newRow;
        });

        setHeaders(Object.keys(cleaned[0] || {}));
        setCsvData(cleaned);
        setSuccessCount(0);
      },
    });
  };

  const handleUpload = async () => {
    if (!csvData.length) return;
    setUploading(true);
    let success = 0;

    for (const record of csvData) {
      try {
        const schoolNo = record["schoolnumber"];
        const email1 = record["email1"] || "";
        const email2 = record["email2"] || "";

        if (!schoolNo || !email1) {
          console.warn("Skipping row: missing SchoolNumber or Email1");
          continue;
        }

        await setDoc(
          doc(collection(db, "results"), schoolNo),
          {
            email1,
            email2,
          },
          { merge: true }
        );

        success++;
      } catch (err) {
        console.error("❌ Error uploading email:", err);
      }
    }

    setSuccessCount(success);
    setUploading(false);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📧 Upload Student Emails (CSV / TSV)</h2>
      <input type="file" accept=".csv, .tsv, .txt" onChange={handleFileChange} />

      {csvData.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>📘 Preview</h3>
          <div
            style={{
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            <table
              border="1"
              cellPadding={5}
              style={{ width: "100%", fontSize: "0.85rem" }}
            >
              <thead style={{ backgroundColor: "#eee" }}>
                <tr>
                  {headers.map((head, idx) => (
                    <th key={idx}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((head, colIndex) => (
                      <td key={colIndex}>{row[head]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleUpload}
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "✅ Upload Emails"}
          </button>
        </div>
      )}

      {successCount > 0 && (
        <p style={{ color: "green", marginTop: "1rem" }}>
          ✅ <strong>{successCount}</strong> email(s) uploaded successfully.
        </p>
      )}
    </div>
  );
};

export default UploadEmails;
