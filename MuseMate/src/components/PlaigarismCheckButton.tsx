import React, { useState } from "react";

const PlagiarismCheckButton = ({ textToCheck }) => {
  const [plagiarismResult, setPlagiarismResult] = useState(null);
  const [status, setStatus] = useState("idle"); // Track status (idle, loading, complete, error, processing)
  const [scanID, setScanID] = useState(null);

  const handleSubmitButtonClick = async () => {
    if (textToCheck) {
      setStatus("loading");
      const scanId = await submitTextForPlagiarism(textToCheck);
      if (scanId) {
        await checkPlagiarismProcessing(scanId);
      }
    } else {
      alert("Please enter some text first.");
    }
  };

  // Function to submit text to the /check endpoint
  async function submitTextForPlagiarism(textData) {
    try {
      const response = await fetch(
        "http://localhost:3232/check?text=" + textData
      );

      if (response.ok) {
        const result = await response.json();
        const scanId = result.scanID;
        setScanID(scanId);
        console.log(scanID);
        console.log("Text submitted for plagiarism check.");
        setStatus("processing initial submission");
        return scanId;
      } else {
        console.error("Error submitting text for plagiarism.");
        setStatus("error during submission");
        return null;
      }
    } catch (error) {
      console.error("Error during text submission:", error);
      setStatus("error during submission");
      return null;
    }
  }

  async function checkPlagiarismProcessing(scanId) {
    try {
      let attempts = 0;
      while (attempts < 120) {
        const response = await fetch("http://localhost:3232/plagiarism-result");
        const result = await response.json();

        if (response.ok && result.scanID === scanId) {
          if (result.status === "complete") {
            setPlagiarismResult(result.data); // Set the result
            setStatus("complete");
            return;
          }
        }

        console.log("Waiting for plagiarism check to complete...");
        attempts++;
        setStatus("processing");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setStatus("timed out");
      console.error("Error: Plagiarism check timed out.");
    } catch (error) {
      console.error("Error checking plagiarism status:", error);
      setStatus("error during processing");
    }
  }

  return (
    <div
      className="plagiarism-check-button-container"
      style={{ padding: "20px" }}
    >
      <h6 style={{ marginBottom: "10px" }}>Text to Check:</h6>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {textToCheck}
      </div>
      <button
        className="submit-plagiarism-button"
        onClick={handleSubmitButtonClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4a9eba",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Check Plagiarism
      </button>

      <h6 style={{ marginTop: "20px" }}>Status: {status}</h6>

      {status === "complete" && plagiarismResult && (
        <div
          id="plagiarismResult"
          className="plagiarism-result"
          style={{
            border: "1px solid #4a9eba",
            borderRadius: "5px",
            padding: "15px",
            marginTop: "20px",
            backgroundColor: "#F0FFFF",
          }}
        >
          <h3 style={{ marginBottom: "10px", color: "#4a9eba" }}>
            Plagiarism Check Result
          </h3>
          <p>
            <strong>Similarity Score:</strong>{" "}
            {plagiarismResult.aggregratedScore}%
          </p>
          <p>
            <strong>AI Detection:</strong>{" "}
            {plagiarismResult.aiDetection ? "Yes" : "No"}
          </p>
        </div>
      )}

      {/* Handle error state */}
      {status.startsWith("error") && (
        <div
          className="error-message"
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#ffebee",
            border: "1px solid #e57373",
            borderRadius: "5px",
            color: "#d32f2f",
          }}
        >
          <h6>Error: There was an issue with the plagiarism check process.</h6>
        </div>
      )}
    </div>
  );
};

export default PlagiarismCheckButton;
