import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "./firebaseConfig";

const db = getFirestore(app);

const ResultView = () => {
  const { studentClass, examName, schNo } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const subjectOrder = [
    "English", "Lang", "Lit", "Hindi", "Punjabi", "SST",
    "History", "Gepgraphy", "Science", "Physics", "Chemistry", "Biology",
    "Mathematics", "Commerce", "Economics", "Accounts", "PE",
    "Computer", "Arts", "GK", "Divinity"
  ];

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const docRef = doc(db, "results", studentClass, examName, schNo);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResult(docSnap.data());
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching result:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [studentClass, examName, schNo]);

  if (loading) return <p>Loading result...</p>;
  if (notFound) return (
    <p>No result found for School Number: {schNo} in Class: {studentClass}, Exam: {examName}</p>
  );

  const subjectData = subjectOrder.map(subject => ({
    subject,
    marks: result[subject] !== undefined && result[subject] !== "" ? Number(result[subject]) : "-"
  }));

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "900px",
      margin: "0 auto",
      backgroundColor: "#eef4f8",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <h2 style={{ color: "#003366", borderBottom: "2px solid #ccc", paddingBottom: "0.5rem" }}>
        Exam Result - {result.EXAM}
      </h2>
      <p><strong>Name:</strong> {result.NAME}</p>
      <p><strong>School Number:</strong> {result.SchoolNumber}</p>
      <p><strong>Class:</strong> {result.CLASS}</p>
      <p><strong>Rank:</strong> {result.RANK || "Not Available"}</p>
      <p><strong>Total Marks:</strong> {result.Total}</p>
      <p><strong>Percentage:</strong> {result.Percentage}%</p>

      <hr style={{ margin: "1.5rem 0" }} />

      <h3 style={{ color: "#004466" }}>Subject-wise Marks</h3>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#f4f7fa",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "1rem"
      }}>
        <thead style={{ backgroundColor: "#004466", color: "white" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left", width: "35%" }}>Subject</th>
            <th style={{ padding: "12px", textAlign: "center", width: "20%" }}>Max Marks</th>
            <th style={{ padding: "12px", textAlign: "center", width: "25%" }}>Marks Obtained</th>
            <th style={{ padding: "12px", textAlign: "center", width: "20%" }}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjectData.map(({ subject, marks }) => {
            const isFail = typeof marks === "number" && marks < 40;
            const grade = typeof marks !== "number" ? "-" :
              marks >= 90 ? "A+" :
              marks >= 80 ? "A" :
              marks >= 70 ? "B" :
              marks >= 60 ? "C" :
              marks >= 50 ? "D" :
              marks >= 40 ? "E" : "F";

            return (
              <tr key={subject} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px 12px" }}>{subject}</td>
                <td style={{ textAlign: "center" }}>100</td>
                <td style={{
                  textAlign: "center",
                  fontWeight: isFail ? "bold" : "normal",
                  color: isFail ? "#d90429" : "#000"
                }}>
                  {marks}
                </td>
                <td style={{ textAlign: "center" }}>{grade}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultView;
