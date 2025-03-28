import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from '../Services/api';

const VerifyEmail = () => {
  const { token } = useParams(); // Extract token from URL parameter
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      const response = await api.post(`verifyEmail/${token}`);
      setMessage(response.data); // Show success message
    } catch (error) {
      setMessage(error.response?.data || "Verification failed. Try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: '#734dc4' }}>Verify Email</h2>
      <button 
        onClick={handleVerify} 
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#734dc4",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Verify Now
      </button>
      {message && (
        <p style={{ marginTop: "20px", fontSize: "18px", color: message.includes("failed") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyEmail;
