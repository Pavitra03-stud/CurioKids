import "../styles/GamesPlayHome.css";
import BackIcon from "../components/BackIcon";

export default function GamesPlayHome({ navigate, goBack }) {
  return (
    <div className="games-play-page">

      {/* Back */}
      <div className="top-bar">
        <BackIcon goBack={goBack} />
      </div>

      {/* Title */}
      <h1 className="title">Games Zone</h1>

      {/* Game List */}
      <div className="game-list">

        <div
          className="game-item"
          onClick={() => navigate("sound-tap")}
        >
          <div>
            <h2>🎧 Sound Tap</h2>
            <p>Tap the number of sounds</p>
          </div>
        </div>

                <div
        className="game-item"
        onClick={() => navigate("find-friend")}
        >
        <div>
            <h2>🐾 Find the Friend</h2>
            <p>Find the different one</p>
        </div>
        </div>

                <div
        className="game-item"
        onClick={() => navigate("pattern-copy")}
        >
        <div>
            <h2>🎯 Pattern Game</h2>
            <p>Follow the pattern</p>
        </div>
        </div>
        
                <div
        className="game-item"
        onClick={() => navigate("memory-match")}
        >
        <div>
            <h2>🧠 Memory Match</h2>
            <p>Match the pairs</p>
        </div>
        </div>

        <div
  className="game-item"
  onClick={() => navigate("catch-word")}
>
  <div>
    <h2>🎯 Catch the Word</h2>
    <p>Catch the correct word</p>
  </div>
</div>

<div
  className="game-item"
  onClick={() => navigate("fill-bucket")}
>
  <div>
    <h2>🧺 Fill the Bucket</h2>
    <p>Put the right number of items</p>
  </div>
</div>

<div
  className="game-item"
  onClick={() => navigate("letter-blast")}
>
  <div>
    <h2>💥 Letter Blast</h2>
    <p>Tap the correct letter</p>
  </div>
</div>

<div
  className="game-item"
  onClick={() => navigate("number-ninja")}
>
  <div>
    <h2>🔢 Number Ninja</h2>
    <p>Slice the correct number</p>
  </div>
</div>

      </div>
    </div>
  );
}