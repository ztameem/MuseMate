import React, { useEffect, useState } from "react";
import RhymeDropdown from "./RhymeDropdown"; // Import the RhymeDropdown component
import PlagiarismCheckButton from "./PlaigarismCheckButton";

interface Section {
  id: number;
  chords: string;
  lyrics: string;
}

const DynamicTextBoxes: React.FC = ({
  initialChords,
  initialLyrics,
  onSave,
}) => {
  useEffect(() => {
    const chordSections = initialChords.split("\n");
    const lyricSections = initialLyrics.split("\n");
    const initialSections = chordSections.map((chord, index) => ({
      id: Date.now() + index,
      chords: chord || "",
      lyrics: lyricSections[index] || "",
    }));
    setSections(initialSections);
  }, [initialChords, initialLyrics]);

  const [sections, setSections] = useState<Section[]>([
    { id: Date.now(), chords: "", lyrics: "" },
  ]);

  const [textToCheck, setTextToCheck] = useState<string>(""); // Store the combined text to check

  // Function to extract the last word from lyrics
  const getLastWord = (lyrics: string): string => {
    const words = lyrics.trim().split(/\s+/); // Split lyrics into words and remove extra spaces
    return words.length > 0 ? words[words.length - 1] : ""; // Return the last word, or an empty string if no words exist
  };

  const handlePlagiarismCheck = async () => {
    // Collect all the lyrics from all sections
    const text = sections.map((section) => section.lyrics).join("\n");
    setTextToCheck(text); // Update the textToCheck state
  };

  const handleSave = () => {
    const combinedChords = sections.map((section) => section.chords).join("\n");
    const combinedLyrics = sections.map((section) => section.lyrics).join("\n");
    onSave(combinedChords, combinedLyrics);
  };

  // Function to handle input changes
  const handleInputChange = (sectionId, type, event) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, [type]: event.target.value }
        : section
    );
    setSections(updatedSections);
  };

  // Function to add a new section (chords + lyrics)
  const addNewSection = () => {
    const newSection: Section = { id: Date.now(), chords: "", lyrics: "" };
    setSections([...sections, newSection]);
  };

  // Function to remove the last section
  const removeLastSection = () => {
    if (sections.length > 1) {
      setSections(sections.slice(0, -1)); // Remove the last section
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Render text boxes dynamically */}
      {sections.map((section) => {
        const lastWord = getLastWord(section.lyrics); // Get the last word from the lyrics input
        return (
          <div
            key={section.id}
            style={{
              marginBottom: "30px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "20px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              {/* Chords Text Box */}
              <input
                type="text"
                value={section.chords}
                onChange={(event) =>
                  handleInputChange(section.id, "chords", event)
                }
                placeholder="Enter Chords"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9 !important",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Lyrics Text Box */}
              <input
                type="text"
                value={section.lyrics}
                onChange={(event) =>
                  handleInputChange(section.id, "lyrics", event)
                }
                placeholder="Enter Lyrics"
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  outline: "none",
                  marginRight: "10px", // Space between lyrics and dropdown
                  backgroundColor: "#f9f9f9",
                }}
              />
              {/* RhymeDropdown */}
              <RhymeDropdown word={lastWord} />
            </div>
          </div>
        );
      })}

      {/* Add and Remove Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={addNewSection}
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "#77dd77",
            color: "white",
            fontSize: "24px",
            border: "2px solid #66bb66", // Thicker border with a complementary green shade
            borderRadius: "50%", // Circle shape
            cursor: "pointer",
            marginRight: "10px",
            transition: "all 0.3s ease", // Smooth hover effect
          }}
          title="Add Section"
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#66bb66")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#77dd77")
          }
        >
          +
        </button>

        <button
          onClick={removeLastSection}
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "#ff6961",
            color: "white",
            fontSize: "24px",
            border: "2px solid #e64c4c", // Thicker border with a complementary red shade
            borderRadius: "50%", // Circle shape
            cursor: "pointer",
            transition: "all 0.3s ease", // Smooth hover effect
          }}
          title="Remove Section"
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#e64c4c")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#ff6961")
          }
        >
          -
        </button>
      </div>

      {/* Plagiarism Check Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <PlagiarismCheckButton textToCheck={initialLyrics} />
      </div>
      <button
        onClick={handleSave}
        style={{
          marginBottom: "-10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Chords and Lyrics!
      </button>
    </div>
  );
};

export default DynamicTextBoxes;
