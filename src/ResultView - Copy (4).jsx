import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";

const ResultView = () => {
  const [searchParams] = useSearchParams();
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = searchParams.get("token");
  const schNo = searchParams.get("schNo");

  const subjectList = [
    "English", "Lang", "Lit", "Hindi", "Punjabi",
    "SST", "History", "Geography",
    "Science", "Physics", "Chemistry", "Biology",
    "Mathematics", "Economics", "Commerce", "Accounts",
    "PE", "Computer", "Arts", "GK", "Divinity"
  ];

  const nonSubjectFields = ["NAME", "SchoolNumber", "EXAM", "Total", "Percentage", "RANK", "Remarks"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || !schNo) {
          setError("Missing token or school number.");
          setLoading(false);
          return;
        }

        const parentRef = doc(db, "parents", schNo);
        const parentSnap = await getDoc(parentRef);

        if (!parentSnap.exists()) {
          setError("Invalid school number.");
          setLoading(false);
          return;
        }

        const parentData = parentSnap.data();

        if (parentData.token !== token) {
          setError("Invalid or expired token.");
          setLoading(false);
          return;
        }

        const resultRef = doc(db, "results", "VIII", "MR 2", schNo);
        const resultSnap = await getDoc(resultRef);

        if (!resultSnap.exists()) {
          setError("Result not found.");
          setLoading(false);
          return;
        }

        setResultData(resultSnap.data());
      } catch (err) {
        console.error("❌ Error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, schNo]);

  const getGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{
      padding: "2rem",
      fontFamily: "Segoe UI, sans-serif",
      maxWidth: "900px",
      margin: "0 auto",
      backgroundColor: "#fdfdfd",
      boxShadow: "0 0 12px rgba(0,0,0,0.1)",
      borderRadius: "10px"
    }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
  <h1 style={{
    margin: 0,
    fontSize: "2rem",
    color: "#1a237e"
  }}>
    Guru Nanak Fifth Centenary School, Mussoorie
  </h1>
  <h2 style={{
    marginTop: "0.5rem",
    color: "#2c3e50"
  }}>
    Student Result
  </h2>
</div>


      {/* Section 1 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#ecf0f1",
        padding: "1rem",
        borderRadius: "6px",
        marginBottom: "1.5rem"
      }}>
        <div><strong>Name:</strong> {resultData.NAME}</div>
        <div><strong>School Number:</strong> {resultData.SchoolNumber}</div>
        <div><strong>Exam:</strong> {resultData.EXAM}</div>
      </div>

      {/* Section 2 */}
      <h3 style={{ color: "#34495e", marginBottom: "1rem" }}>Subject-wise Marks</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#3498db", color: "#fff" }}>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Max Marks</th>
            <th style={thStyle}>Marks Obtained</th>
            <th style={thStyle}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjectList.map(subject => {
            const marks = resultData[subject];
            if (marks === undefined) return null;

            return (
              <tr key={subject} style={{ backgroundColor: "#f9f9f9" }}>
                <td style={tdStyle}>{subject}</td>
                <td style={tdStyle}>100</td>
                <td style={tdStyle}>{marks}</td>
                <td style={tdStyle}>{getGrade(marks)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Section 3 */}
      <div style={{
        backgroundColor: "#ecf0f1",
        padding: "1rem",
        borderRadius: "6px"
      }}>
        <p><strong>Total:</strong> {resultData.Total}</p>
        <p><strong>Percentage:</strong> {resultData.Percentage}%</p>
        <p><strong>Rank:</strong> {resultData.RANK}</p>
        <p><strong>Remarks:</strong> {resultData.Remarks}</p>
      </div>
    </div>
  );
};

const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

export default ResultView;
