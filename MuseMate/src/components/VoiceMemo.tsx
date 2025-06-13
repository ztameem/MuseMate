import React, { useState, useEffect } from "react";

function MemoRecorder() {
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => {
    const getMicrophoneAccess = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    getMicrophoneAccess();
  }, []);

  const startRecording = () => {
    if (stream) {
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  // Function to handle downloading the audio
  const handleDownload = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "voiceMemo.webm"; // Default file name
      link.click();
      URL.revokeObjectURL(url); // Clean up the URL object
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={!stream}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!mediaRecorder}>
        Stop Recording
      </button>

      {audioBlob && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <audio src={URL.createObjectURL(audioBlob)} controls />
          <button
            onClick={handleDownload}
            style={{
              padding: "5px",
              fontSize: "11px", // Smaller font size
              backgroundColor: "#CCCCFF", // Background color
              color: "black", // Text color
              border: "none", // No border
              borderRadius: "5px", // Rounded corners
              cursor: "pointer", // Pointer cursor on hover
              marginTop: "10px", // Space between audio and button
            }}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoRecorder;
