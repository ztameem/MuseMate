import React, { useState } from "react";

const ChordProgressionGenerator = () => {
  const [key, setKey] = useState("C");
  const [style, setStyle] = useState("pop");
  const [scale, setScale] = useState("major");
  const [progression, setProgression] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = ["pop", "jazz", "rock", "blues"];

  const scales = ["major", "minor"];

  const generateProgression = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3232/progression?key=${key}&style=${style}&scale=${scale}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chord progression.");
      }
      const data = await response.json();
      setProgression(data.progression || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label>
        <div className="Key">
          Key:
          <select value={key} onChange={(e) => setKey(e.target.value)}>
            {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>
      </label>
      <div className="Musical Style">
        <label>
          Style:
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="Scale">
        Key:
        <select value={scale} onChange={(e) => setScale(e.target.value)}>
          {scales.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button onClick={generateProgression} disabled={loading}>
        {loading ? "Generating..." : "Generate Progression"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>{progression.join(" - ")}</p>{" "}
      {/* Chords in one line with ' - ' separator */}
    </div>
  );
};

export default ChordProgressionGenerator;
