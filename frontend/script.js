import React, { useState, useEffect } from "react";
import { Sparkles, Music, Wind } from "lucide-react"; 
import "./App.css";

const affirmations = [
  "You are capable of amazing things 🌟",
  "Every day is a fresh start 🌸",
  "Believe in yourself and all that you are ✨",
  "You are stronger than you think 💪",
  "Good things are coming your way 🌈",
  "Your potential is limitless 🚀",
];

function App() {
  const [quote, setQuote] = useState("");
  const [track, setTrack] = useState("");   
  const [showOptions, setShowOptions] = useState(false);

  // Mood Journal
  const [journalEntry, setJournalEntry] = useState("");
  const [journalHistory, setJournalHistory] = useState([]);
  const [showJournal, setShowJournal] = useState(false);

  // Breathing Exercise
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Ready");
  const [isBreathing, setIsBreathing] = useState(false);

  // Breathing cycle handler (fix: always start with Breathe In & sync phases)
  useEffect(() => {
    let interval;
    if (isBreathing) {
      const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
      let index = 0;
      setBreathingPhase(phases[index]);

      interval = setInterval(() => {
        index = (index + 1) % phases.length;
        setBreathingPhase(phases[index]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const handleAffirmationClick = () => {
    const randomQuote =
      affirmations[Math.floor(Math.random() * affirmations.length)];
    setQuote(randomQuote);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>🌸 CalmSpace 🌸</h1>
        <p>Your pocket companion for stress relief & positivity</p>
      </header>

      {/* Cards */}
      <div className="cards">
        {/* Daily Affirmations */}
        <div className="card" onClick={handleAffirmationClick}>
          <h2>
            <Sparkles className="icon" /> Daily Affirmations
          </h2>
          <p>Click to see an uplifting quote.</p>
          {quote && <div className="quote-box">{quote}</div>}
        </div>

        {/* Guided Relaxation */}
        <div className="card">
          <div 
            className="card-header" 
            onClick={() => setShowOptions(!showOptions)}
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h2>
                <Music className="icon" /> Guided Relaxation
              </h2>
              <p>Click to choose a soothing track.</p>
            </div>
            <span style={{ fontSize: "1.2rem", transition: "transform 0.3s" }}>
              {showOptions ? "▼" : "▶"}
            </span>
          </div>

          {showOptions && (
            <div className="dropdown-options">
              <button onClick={(e) => { e.stopPropagation(); setTrack("/relax.mp3"); }}>
                🌊 Ocean Waves
              </button>
              <button onClick={(e) => { e.stopPropagation(); setTrack("/rain.mp3"); }}>
                ☔ Rain Sounds
              </button>
              <button onClick={(e) => { e.stopPropagation(); setTrack("/bells.mp3"); }}>
                🔔 Meditation Bells
              </button>

              {track && (
                <audio key={track} controls autoPlay className="audio-player">
                  <source src={track} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
        </div>

        {/* Mood Journal */}
        <div className="card">
          <div 
            className="card-header"
            onClick={() => setShowJournal(!showJournal)}
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h2>💭 Mood Journal</h2>
              <p>Tap to open your safe space for thoughts.</p>
            </div>
            <span style={{ fontSize: "1.2rem", transition: "transform 0.3s" }}>
              {showJournal ? "▼" : "▶"}
            </span>
          </div>

          {showJournal && (
            <div className="journal-box" onClick={(e) => e.stopPropagation()}>
              <textarea
                placeholder="Write your thoughts here..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="journal-textarea"
              />

              <div className="emoji-bar">
                {["😊","😢","😡","😴","😇","😍","🤯","😌"].map((emoji, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setJournalEntry(journalEntry + " " + emoji);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button 
                className="save-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (journalEntry.trim() !== "") {
                    setJournalHistory([...journalHistory, journalEntry]);
                    setJournalEntry("");
                  }
                }}
              >
                Save Entry
              </button>

              <div className="entries-list">
                {journalHistory.map((entry, index) => (
                  <div key={index} className="entry">
                    <span>{entry}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setJournalHistory(journalHistory.filter((_, i) => i !== index));
                      }}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Breathing Exercise */}
        <div className="card" onClick={() => setShowBreathing(!showBreathing)}>
          <h2>
            <Wind className="icon" /> Breathing Exercise
          </h2>
          <p>Tap to practice mindful breathing.</p>

          {showBreathing && (
            <div className="breathing-card">
              {/* Circle with synced wording inside */}
              <div
                className={`breathing-circle ${
                  breathingPhase.includes("In") ? "inhale" :
                  breathingPhase.includes("Out") ? "exhale" :
                  breathingPhase.includes("Hold") ? "hold" : ""
                }`}
              >
                <span className="circle-text">{breathingPhase}</span>
              </div>

              <button
                className="breathing-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  setIsBreathing(!isBreathing);
                  if (!isBreathing) setBreathingPhase("Breathe In");
                }}
              >
                {isBreathing ? "Stop" : "Start"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">Made with 💜 for Gen AI Hackathon</footer>
    </div>
  );
}

export default App;
