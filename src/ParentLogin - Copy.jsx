import React, { useState } from "react";
import { sendResultLink } from "./services/emailService";

const ParentLogin = () => {
  const [email, setEmail] = useState("");
  const [schNo, setSchNo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !schNo.trim()) {
      alert("Please enter both Email and School Number.");
      return;
    }

    sendResultLink(email.trim(), schNo.trim());
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
