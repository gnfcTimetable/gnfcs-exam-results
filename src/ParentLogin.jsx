import React, { useState } from "react";
import { db } from "./firebaseConfig"; // ✅ correct way
import emailjs from "emailjs-com";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const ParentLogin = () => {
  const [email, setEmail] = useState("");
  const [schNo, setSchNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage("");

    if (!email.trim() || !schNo.trim()) {
      setErrorMessage("Please enter both Email and School Number.");
      return;
    }

    const token = uuidv4(); // Generate a random token

    // Hardcoded production URL for result link
    const resultLink = `https://examresult-3a22c.web.app/result?token=${token}&schNo=${schNo}`;

    try {
      setLoading(true); // Set loading to true while performing async actions

      // Store token in Firestore under 'parents' collection
      await setDoc(doc(db, "parents", schNo), {
        email1: email.trim(),
        token,
      });

      // Send email using EmailJS
      const response = await emailjs.send(
        "service_ns3a0hs",           // Your EmailJS Service ID
        "template_15e7uio",          // Updated EmailJS Template ID
        {
          email: email.trim(),
          result_link: resultLink,   // Assuming your template uses {{result_link}}
        },
        "AxAfrBIg7hUV-6Ivy"          // Your EmailJS Public Key
      );

      console.log("✅ Email sent successfully!", response);
      alert("Result link has been sent to your email.");

      // Reset form fields after successful email sending
      setEmail("");
      setSchNo("");
    } catch (error) {
      console.error("❌ Error sending result link:", error);
      setErrorMessage("Failed to send result link. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Parent Login</h2>

      {errorMessage && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
          <strong>{errorMessage}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter parent email"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>School Number (SchNo):</label><br />
          <input
            type="text"
            value={schNo}
            onChange={(e) => setSchNo(e.target.value)}
            placeholder="Enter student's SchNo"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Result Link"}
        </button>
      </form>
    </div>
  );
};

export default ParentLogin;
