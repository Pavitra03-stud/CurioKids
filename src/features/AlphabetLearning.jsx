import "../styles/AlphabetLearning.css";
import animalVideo from "../assets/animals-letters.mp4";

export default function AlphabetLearning({ goBack }) {
  return (
    <div className="alphabet-learning-page">
      <button className="alphabet-back-btn" onClick={goBack}>
        ←
      </button>

      <div className="alphabet-top-animals">
        <span>🦒</span>
        <span>🐘</span>
        <span>🐦</span>
      </div>

      <div className="alphabet-learning-header">
        <h1>Animal Letter Learning</h1>
        <p>Learn A to Z with animals and fun video</p>
      </div>

      <div className="alphabet-video-card">
        <h2>Watch and Learn</h2>

        {/* ✅ LOCAL VIDEO PLAYER */}
        <video
  className="alphabet-video"
  controls
  playsInline
  preload="auto"
>
  <source src={animalVideo} type="video/mp4" />
  Your browser does not support the video tag.
</video>

        <p className="alphabet-video-text">
          Learn letters with animals in a fun way.
        </p>
      </div>


      <div className="alphabet-animal-row">
        <span>🦁</span>
        <span>🐯</span>
        <span>🐵</span>
        <span>🦓</span>
      </div>
    </div>
  );
}