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

  // Define subject display order
  const subjectOrder = [
    "NAME", "SchoolNumber", "EXAM",
    "English", "Lang", "Lit", "Hindi", "Punjabi",
    "SST", "History", "Geography",
    "Science", "Physics", "Chemistry", "Biology",
    "Mathematics", "Economics", "Commerce", "Accounts",
    "PE", "Computer", "Arts", "GK", "Divinity",
    "Total", "Percentage", "RANK", "Remarks"
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
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "0.5rem" }}>
        Exam Result
      </h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <tbody>
          {subjectOrder.map((key) => {
            const value = resultData[key];

            // Skip undefined fields
            if (value === undefined) return null;

            return (
              <tr key={key}>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f8f8f8",
                    fontWeight: "bold",
                    width: "30%",
                  }}
                >
                  {key}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  {value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultView;
