import React, { useState } from "react";
import { db } from "./firebaseConfig"; // ✅ correct way


import emailjs from "emailjs-com";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const ParentLogin = () => {
  const [email, setEmail] = useState("");
  const [schNo, setSchNo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !schNo.trim()) {
      alert("Please enter both Email and School Number.");
      return;
    }

    const token = uuidv4(); // generate a random token
    const resultLink = `http://localhost:5173/result?token=${token}&schNo=${schNo}`;

    try {
      // Store token in Firestore under 'parents' collection
      await setDoc(doc(db, "parents", schNo), {
        email1: email.trim(),
        token,
      });

      // Send email using EmailJS
      await emailjs.send(
        "service_ns3a0hs",           // your EmailJS Service ID
        "template_7ikrmwg",          // your EmailJS Template ID
        {
          email: email.trim(),
          result_link: resultLink,   // assuming your template uses {{result_link}}
        },
        "AxAfrBIg7hUV-6Ivy"          // your EmailJS Public Key
      );

      alert("Result link has been sent to your email.");
      setEmail("");
      setSchNo("");
    } catch (error) {
      console.error("Error sending result link:", error);
      alert("Failed to send result link. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Parent Login</h2>
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
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
          Send Result Link
        </button>
      </form>
    </div>
  );
};

export default ParentLogin;
