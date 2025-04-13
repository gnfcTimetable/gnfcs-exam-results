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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: "1rem" }}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>Guru Nanak Fifth Centenary School, Mussoorie</h1>
      <h2 style={styles.subHeading}>Student Result</h2>

      {/* Section 1 */}
      <div style={styles.section}>
        <p><strong>Name:</strong> {resultData.NAME}</p>
        <p><strong>School Number:</strong> {resultData.SchoolNumber}</p>
        <p><strong>Exam:</strong> {resultData.EXAM}</p>
      </div>

      {/* Section 2 */}
      <div style={styles.section}>
        <h3>Subject-wise Marks</h3>
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
                if (marks !== undefined) {
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
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3 */}
      <div style={styles.section}>
        <p><strong>Total:</strong> {resultData.Total}</p>
        <p><strong>Percentage:</strong> {resultData.Percentage}%</p>
        <p><strong>Rank:</strong> {resultData.RANK}</p>
        <p><strong>Remarks:</strong> {resultData.Remarks || "N/A"}</p>
      </div>
    </div>
  );
};

// ✅ Fully applied styles
const styles = {
  container: {
    padding: "1rem",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#fada5e ",
    color: "#222",
    maxWidth: "900px",
    margin: "auto"
  },
  mainHeading: {
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#05386B",
    marginBottom: "0.25rem",
  },
  subHeading: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#379683",
    marginBottom: "1.5rem",
  },
  section: {
    backgroundColor: "#318ce7",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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
    backgroundColor: "#002e63",
    color: "#f8f8ff ",
    padding: "0.75rem",
    textAlign: "left",
    borderBottom: "2px solid #379683",
  },
  td: {
    padding: "0.65rem",
    borderBottom: "1px solid #ccc",
  },
};

export default ResultView;
