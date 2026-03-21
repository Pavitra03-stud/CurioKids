import "../styles/AlphabetLearning.css";
import BackIcon from "../components/BackIcon";

export default function AlphabetLearning({ goBack }) {
  return (
    <div className="elearning-page">

      {/* Back Button */}
      <BackIcon goBack={goBack} />

      {/* Title */}
      <h1 className="title">Learn Alphabets</h1>

      {/* Video Section */}
      <div className="video-container">
        <iframe
          src="https://www.youtube.com/embed/75p-N9YKqNo"
          title="Alphabet Learning"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      {/* Description */}
      <p className="description">
        Watch and learn A to Z with fun animations!
      </p>

    </div>
  );
}