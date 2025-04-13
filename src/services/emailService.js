// src/services/emailService.js
import emailjs from "emailjs-com";

export const sendWelcomeEmail = async (email, schNo, token) => {
  console.log("Attempting to send welcome email to:", email);

  if (!email || email.trim() === "") {
    alert("Email is missing. Cannot send email.");
    return;
  }

  // Hardcoded production URL for result link
  const resultLink = `https://examresult-3a22c.web.app/result?token=${token}&schNo=${schNo}`;

  const templateParams = {
    email,          // Recipient email address
    result_link: resultLink, // Dynamic result link for the parent
  };

  try {
    // Send result link email using the EmailJS welcome template
    const response = await emailjs.send(
      "service_ns3a0hs",    // Your EmailJS Service ID
      "template_15e7uio",   // Updated template ID for the welcome email
      templateParams,
      "AxAfrBIg7hUV-6Ivy"   // Your EmailJS Public Key (User ID)
    );
    console.log("✅ Welcome email sent successfully!", response);
    alert(`Welcome email sent to: ${email}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email", error);
    alert("Failed to send welcome email. Please check the console for details.");
  }
};
