import React from 'react'
import { useNavigate } from "react-router-dom";

export default function BackIcon() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(-1)}
      style={styles.back}
    >
      ⬅
    </div>
  );
}

const styles = {
  back: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "#ffffff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },
};