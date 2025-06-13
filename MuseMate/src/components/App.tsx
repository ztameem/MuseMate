import React, { useState } from "react";
import RhymeDropdown from "./RhymeSchemeDropdown";
import VoiceMemo from "./VoiceMemo";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import DynamicTextBoxes from "./ChordsAndLyrics";
import SongTitle from "./SongTitle";
import PlagiarismCheckButton from "./PlaigarismCheckButton";

import "../style/App.css";
import ChordProgressionGenerator from "./ChordProgressionGenerator";

function App() {
  const [chords, setChords] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [songTitle, setSongTitle] = useState("Untitled Song");
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const handleSaveSong = async () => {
    try {
      const response = await fetch(
        `http://localhost:3232/addsong?uid=${userEmail}&title=${songTitle}&chords=${chords}&lyrics=${lyrics}`
      );

      if (response.ok) {
        alert("Song saved successfully!");
      } else {
        alert("Failed to save song.");
      }
    } catch (error) {
      console.error("Error saving song:", error);
      alert("An error occurred while saving the song.");
    }
  };

  return (
    <div className="app-container">
      {/* Main Content */}
      <main className="main-content">
        <SignedOut>
          <div className="not-signed-in">
            <h1>MuseMate</h1>
            <p>Sign in to continue!</p>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="header-container">
            {/* Song Title Component - added beside MuseMate */}
            <SongTitle onTitleChange={setSongTitle} />
          </div>

          {/* Rhyme Scheme Dropdown */}
          <div className="rhyme-section">
            <RhymeDropdown />
          </div>

          {/* Dynamic Text Boxes */}
          <div
            className="dynamic-text-boxes-section"
            style={{ marginTop: "20px" }}
          >
            <ChordProgressionGenerator />
            <DynamicTextBoxes
              initialChords={chords}
              initialLyrics={lyrics}
              onSave={(newChords, newLyrics) => {
                setChords(newChords);
                setLyrics(newLyrics);
              }}
            />
          </div>
          <button
            onClick={handleSaveSong}
            style={{
              padding: "0",
              margin: "10px",
              maxWidth: "400px",
              alignSelf: "center",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save Song
          </button>

          {/* Voice Memo Section */}
          <footer className="voice-memo-footer">
            {/* <PlagiarismCheckButton textToCheck={text} /> */}
            {/* New Section for Voice Memo Instructions */}
            <div className="voice-memo-instruction">
              <h4>Record your song!</h4>
            </div>
            <VoiceMemo />
          </footer>
        </SignedIn>
      </main>
    </div>
  );
}

export default App;
