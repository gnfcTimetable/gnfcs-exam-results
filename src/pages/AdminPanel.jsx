import React, { useState } from "react";
import Papa from "papaparse";
import { db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [emailData, setEmailData] = useState([]);
  const [resultData, setResultData] = useState([]);

  // 1. Handle Emails CSV
  const handleEmailFile = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setEmailData(results.data);
      },
    });
  };

  const uploadEmails = async () => {
    let uploaded = 0;
    for (const row of emailData) {
      if (row["School No"] && row["Email"]) {
        await setDoc(doc(db, "parent_emails", row["School No"]), {
          email: row["Email"],
        });
        uploaded++;
      }
    }
    alert(`${uploaded} parent email(s) uploaded successfully.`);
  };

  // 2. Handle Results CSV
  const handleResultFile = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setResultData(results.data);
      },
    });
  };

  const uploadResults = async () => {
    let uploaded = 0;
    for (const row of resultData) {
      const schoolNo = row["School No"];
      if (schoolNo) {
        await setDoc(doc(db, "results", schoolNo), row);
        uploaded++;
      }
    }
    alert(`${uploaded} result(s) uploaded successfully.`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Panel – Upload Files</h2>

      {/* Upload Emails */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Upload Parent Emails CSV</h3>
        <input type="file" accept=".csv" onChange={handleEmailFile} />
        {emailData.length > 0 && (
          <>
            <table className="w-full my-2 border">
              <thead>
                <tr>
                  {Object.keys(emailData[0]).map((key) => (
                    <th key={key} className="border p-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emailData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="border p-1">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={uploadEmails}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Emails
            </button>
          </>
        )}
      </div>

      {/* Upload Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Upload Student Results (CSV)</h3>
        <input type="file" accept=".csv" onChange={handleResultFile} />
        {resultData.length > 0 && (
          <>
            <table className="w-full my-2 border">
              <thead>
                <tr>
                  {Object.keys(resultData[0]).map((key) => (
                    <th key={key} className="border p-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="border p-1">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={uploadResults}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Upload Results
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
