import React, { useState } from "react";

const SongTitle = ({ onTitleChange }) => {
  const [title, setTitle] = useState("Untitled Song"); // Default title
  const [isEditing, setIsEditing] = useState(false); // State to check if editing is enabled
  const [tempTitle, setTempTitle] = useState(title); // Temporary title while editing
  const [titleColor, setTitleColor] = useState("#000000"); // Default color (black)

  // Handle title change
  const handleTitleChange = (event) => {
    setTempTitle(event.target.value);
  };

  // Handle color change
  const handleColorChange = (event) => {
    setTitleColor(event.target.value); // Set the selected color
  };

  // Handle save button click
  const handleSave = () => {
    setTitle(tempTitle);
    setIsEditing(false);
    onTitleChange(tempTitle); // Pass updated title to parent
  };

  // Enable editing on double-click
  const handleDoubleClick = () => {
    setIsEditing(true); // Allow editing
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* Title display or input field based on editing state */}
      {isEditing ? (
        <input
          type="text"
          value={tempTitle}
          onChange={handleTitleChange}
          style={{
            fontSize: "36px", // Large font for title
            padding: "10px",
            width: "80%",
            textAlign: "center",
            border: "2px solid #ccc",
            marginBottom: "10px",
          }}
        />
      ) : (
        <h1
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: "36px", // Large font for title
            cursor: "pointer",
            marginBottom: "10px",
            color: titleColor, // Apply selected color to title
          }}
        >
          {title} {/* Display the solidified title */}
        </h1>
      )}

      {/* Color Picker */}
      {isEditing && (
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            Select Title Color:
          </label>
          <input
            type="color"
            value={titleColor}
            onChange={handleColorChange}
            style={{ width: "50px", height: "30px" }}
          />
        </div>
      )}

      {/* Save Button */}
      {isEditing && (
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      )}
    </div>
  );
};

export default SongTitle;
