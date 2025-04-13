// src/services/emailService.js
import emailjs from "emailjs-com";

export const sendResultLink = (email, schNo) => {
  // Log to ensure the email is not empty
  console.log("Attempting to send email to:", email);

  if (!email || email.trim() === "") {
    alert("Email is missing. Cannot send email.");
    return;
  }

  const templateParams = {
    email,  // Must match your EmailJS variable for To Email
    name: "Parent",  // Optional: used in subject if your template includes {{name}}
    result_link: `http://yourwebsite.com/results/${schNo}`, // Replace with actual result URL
  };

  emailjs.send(
    "service_ns3a0hs",        // Your EmailJS Service ID
    "template_d22bl36",       // Your EmailJS Template ID
    templateParams,
    "AxAfrBIg7hUV-6Ivy"       // Your EmailJS Public Key (User ID)
  ).then(
    (response) => {
      console.log("✅ Email sent successfully!", response);
      alert(`Result link sent to: ${email}`);
    },
    (error) => {
      console.error("❌ Failed to send email", error);
      alert("Failed to send email. Please check the console for details.");
    }
  );
};
