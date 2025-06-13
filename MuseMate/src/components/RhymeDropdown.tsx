import React, { useState, useEffect, useRef } from "react";

interface RhymeDropdownProps {
  word: string; // The last word from the lyrics
}

const RhymeDropdown: React.FC<RhymeDropdownProps> = ({ word }) => {
  const [options, setOptions] = useState<string[]>([]); // Ensure options is always an array
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [customOption, setCustomOption] = useState<string>("");

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference for debouncing

  // Fetch options from the backend, ensuring word is URL-encoded
  const fetchOptions = async (currentWord: string) => {
    if (currentWord.trim() === "") {
      setOptions([]); // Clear options if word is empty
      return;
    }

    try {
      // URL encode the word to safely pass it in the query string
      const encodedWord = encodeURIComponent(currentWord);
      const response = await fetch(
        `http://localhost:3232/rhyme?word=${encodedWord}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const data = await response.json();

      // Log the response for debugging
      console.log("Rhyme options fetched:", data);

      // Check if the response contains a 'data' field and it's an array
      if (data && Array.isArray(data.data)) {
        setOptions(data.data); // Set the options from the 'data' field
      } else {
        console.error("Invalid response format:", data);
        setOptions([]); // Set an empty array if data is not in expected format
      }
    } catch (error) {
      console.error("Error fetching rhymes:", error);
      setOptions([]); // Set an empty array in case of error
    }
  };

  // Debounce the API call so it doesn't trigger on every keystroke
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchOptions(word);
    }, 500); // Wait 500ms after the user stops typing

    // Cleanup the timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [word]); // Re-run when the 'word' changes

  // Handle selection of a rhyme word
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    if (event.target.value !== "other") {
      setCustomOption(""); // Clear custom input when not "Other"
    }
  };

  // Handle custom input change
  const handleCustomInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomOption(event.target.value);
  };

  return (
    <div>
      <select
        value={selectedOption}
        onChange={handleSelect}
        style={{ padding: "8px", borderRadius: "4px" }}
      >
        <option value="" disabled>
          {word ? "Select a rhyming word" : "Enter lyrics to get rhymes"}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
        <option value="other">Other</option>
      </select>

      {selectedOption === "other" && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={customOption}
            onChange={handleCustomInputChange}
            placeholder="Enter custom rhyming word"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RhymeDropdown;
