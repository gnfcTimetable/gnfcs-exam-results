import React, { useEffect, useRef, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ResultView = () => {
  const [searchParams] = useSearchParams();
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const resultRef = useRef();

  const token = searchParams.get("token");
  const schNo = searchParams.get("schNo");
  const exam = searchParams.get("exam") || "MR 2";
  const className = searchParams.get("class") || "VIII";

  const subjectOrder = [
    "English", "Lang", "Lit", "Hindi", "Punjabi", "SST",
    "History", "Geography", "Science", "Physics", "Chemistry",
    "Biology", "Mathematics", "Economics", "Commerce", "Accounts",
    "PE", "Computer", "Arts", "GK", "Divinity"
  ];

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

        const resultDocRef = doc(db, "results", className, exam, schNo);
        const resultSnap = await getDoc(resultDocRef);

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
  }, [token, schNo, exam, className]);

  const handleDownloadPDF = async () => {
    const element = resultRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${resultData?.NAME || "result"}.pdf`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: "1rem" }}>{error}</div>;

  return (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <button
        onClick={handleDownloadPDF}
        style={{
          backgroundColor: "#05386B",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          marginBottom: "1rem",
        }}
      >
        Download PDF
      </button>

      <div ref={resultRef} style={styles.container}>
        <h1 style={styles.mainHeading}>Guru Nanak Fifth Centenary School, Mussoorie</h1>
        <h2 style={styles.subHeading}><strong>Academic Performance:</strong> {resultData.EXAM || exam}</h2>

        <div style={{ ...styles.section, textAlign: "left" }}>
          <p><strong>Name:</strong> {resultData.NAME}</p>
          <p><strong>School Number:</strong> {resultData.SchoolNumber}</p>
          <p><strong>Class:</strong> {resultData.CLASS || className}</p>
          </div>
        <div style={styles.section}>
          <h2>Statement of Marks</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Max Marks</th>
                  <th style={styles.th}>Marks Obtained</th>
                  <th style={styles.th}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjectOrder.map((subject) => {
                  const marks = resultData[subject];
                  if (marks !== undefined && marks !== "") {
                    const grade =
                      marks >= 90 ? "A+" :
                      marks >= 75 ? "A" :
                      marks >= 60 ? "B" :
                      marks >= 45 ? "C" :
                      marks >= 33 ? "D" : "E";

                    return (
                      <tr key={subject}>
                        <td style={styles.td}>{subject}</td>
                        <td style={styles.td}>100</td>
                        <td style={styles.td}>{marks}</td>
                        <td style={styles.td}>{grade}</td>
                      </tr>
                    );
                  } else if (marks !== undefined) {
                    return (
                      <tr key={subject}>
                        <td style={styles.td}>{subject}</td>
                        <td style={styles.td}>100</td>
                        <td style={styles.td}>-</td>
                        <td style={styles.td}>-</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...styles.section, textAlign: "left" }}>
          <p><strong>Total:</strong> {resultData.Total}</p>
          <p><strong>Percentage:</strong> {resultData.Percentage}%</p>

          <p><strong>Rank:</strong> {resultData.RANK}</p>
          <p><strong>Remarks:</strong> {resultData.Remarks || "N/A"}</p>
          
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "1rem", // Reduced padding for compactness
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(to bottom right, #fada5e, #ffe680)",
    color: "#222",
    maxWidth: "794px",
    margin: "1rem auto", // Reduced margin to save space
    borderRadius: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    lineHeight: "0.9", // ✅ Add this line
  },
  mainHeading: {
    textAlign: "center",
    fontSize: "2.0rem", // Reduced font size
    fontWeight: "bold",
    color: "#05386B",
    marginBottom: "0.25rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  subHeading: {
    textAlign: "center",
    fontSize: "1.4rem", // Reduced font size
    color: "#379683",
    marginBottom: "1rem", // Reduced margin
  },
  section: {
    backgroundColor: "#daa520",
    padding: "0.8rem", // Reduced padding
    borderRadius: "12px",
    marginBottom: "1rem", // Reduced margin
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "600px",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#800000",
    color: "#f8f8ff",
    padding: "0.5rem", // Reduced padding
    textAlign: "left",
    borderBottom: "2px solid #800000",
  },
  td: {
  padding: "0.4rem",
  borderBottom: "1px solid #ccc",
  textAlign: "left", // ✅ Force left alignment
},

};



export default ResultView;
