import "../styles/AlphabetLearning.css";
import BackIcon from "../components/BackIcon";
import video from "../assets/alphabet.mp4";

export default function AlphabetLearning({ goBack }) {
  return (
    <div className="elearning-page">
      <div className="top-bar">
        <BackIcon goBack={goBack} />
        <h1 className="title">Learn Alphabets</h1>
      </div>

      <div className="full-video-wrap">
        <video
          className="full-video"
          autoPlay
          muted
          playsInline
          controls={false}
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}