import emailjs from "emailjs-com";

// These values come from your EmailJS setup
const SERVICE_ID = "service_ns3a0hs";
const TEMPLATE_ID = "template_7ikrmwg";
const PUBLIC_KEY = "AxAfrBIg7hUV-6Ivy"; // your public key from EmailJS

export const sendResultLink = async (email, schNo, token) => {
  const resultLink = `https://gnfcsresultapp.netlify.app/result?token=${token}&schNo=${schNo}`;

  const templateParams = {
    email: email,
    schNo: schNo,
    token: token,
    result_link: resultLink // Optional: if you want to include this directly in the template
  };

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log("Email sent successfully:", response.status, response.text);
    alert("Result link has been sent to the parent's email.");
  } catch (error) {
    console.error("Failed to send email:", error);
    alert("Failed to send result link. Please try again.");
  }
};
