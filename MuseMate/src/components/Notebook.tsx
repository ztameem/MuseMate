import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import "../style/App.css";
import "../style/Notebook.css";

const Notebook = () => {
  const [songs, setSongs] = useState([]);
  const [activeSongIndex, setActiveSongIndex] = useState(null); // Track which song's details are displayed
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;

  // List of muted colors
  const mutedColors = [
    "rgb(244, 207, 222)", // muted pink
    "rgb(210, 180, 140)", // tan
    "rgb(196, 223, 230)", // light blue
    "rgb(204, 204, 255)", // lavender
    "rgb(255, 239, 213)", // light peach
    "rgb(240, 230, 140)", // khaki
    "rgb(221, 160, 221)", // plum
  ];

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(
          `http://localhost:3232/getsonghistory?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSongs(data);
        } else {
          console.error("Failed to fetch song history");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSongs();
  }, [userId]);

  const handleSongClick = (index) => {
    // Toggle the active song: show details if it's not active, hide if it's active
    setActiveSongIndex((prevActiveSongIndex) =>
      prevActiveSongIndex === index ? null : index
    );
  };

  const handleClearClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3232/clearsongs?uid=${userId}`
      );
      if (response.ok) {
        console.log("Successfully cleared songs");
        setSongs([]); // Clear songs in the state
      } else {
        console.error("Failed to clear songs");
      }
    } catch (error) {
      console.error("Error clearing songs:", error);
    }
  };

  return (
    <div className="notebook-container">
      <div className="notebook-header">
        <h2>Your Songs</h2>
        <button className="clear-songs-button" onClick={handleClearClick}>
          Clear Songs
        </button>
      </div>
      <ul>
        {songs.map((song, index) => {
          const randomColor =
            mutedColors[Math.floor(Math.random() * mutedColors.length)];
          return (
            <li key={index}>
              <button
                style={{ backgroundColor: randomColor }}
                onClick={() => handleSongClick(index)}
              >
                {song.title}
              </button>

              {/* Only display song details for the clicked song */}
              {activeSongIndex === index && (
                <div className="song-details">
                  <h3>Chords</h3>
                  <pre>{song.chords}</pre>
                  <h3>Lyrics</h3>
                  <pre>{song.lyrics}</pre>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Notebook;
