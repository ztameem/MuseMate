// src/RhymeDropdown.tsx
import React, { useState } from "react";

const RhymeDropdown = () => {
  // Define the rhyme schemes
  const rhymeSchemes = ["AABB", "ABAB", "ABCABC", "ABBA", "AAAA"];

  // State to hold the selected rhyme scheme
  const [selectedRhyme, setSelectedRhyme] = useState<string>("AABB");

  // Handler to change the selected rhyme scheme
  const handleRhymeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRhyme(event.target.value);
  };

  return (
    <div>
      <label htmlFor="rhyme-scheme">Select Rhyme Scheme: </label>
      <select
        id="rhyme-scheme"
        value={selectedRhyme}
        onChange={handleRhymeChange}
      >
        {rhymeSchemes.map((rhyme, index) => (
          <option key={index} value={rhyme}>
            {rhyme}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RhymeDropdown;
