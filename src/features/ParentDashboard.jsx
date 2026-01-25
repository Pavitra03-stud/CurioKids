import { useEffect, useState } from "react";

export default function ParentDashboard() {
  const [parent, setParent] = useState(null);
  const [child, setChild] = useState(null);

  useEffect(() => {
    const savedParent = localStorage.getItem("parentProfile");
    const savedChild = localStorage.getItem("childProfile");

    if (savedParent) setParent(JSON.parse(savedParent));
    if (savedChild) setChild(JSON.parse(savedChild));
  }, []);

  if (!parent || !child) {
    return <h2 style={{ padding: "40px" }}>Loading dashboard...</h2>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>📊 Parent Dashboard</h1>

      <div style={styles.card}>
        <h2>👧 Child Profile</h2>
        <p><b>Name:</b> {child.name}</p>
        <p><b>Age:</b> {child.age}</p>
      </div>

      <div style={styles.card}>
        <h2>👨‍👩‍👧 Parent Profile</h2>
        <p><b>Name:</b> {parent.parentName}</p>
        <p><b>Email:</b> {parent.email}</p>
        <p><b>Daily Play Limit:</b> {parent.timeLimit}</p>
      </div>

      <div style={styles.card}>
        <h2>📈 Learning Progress</h2>
        <p>⏱️ Time Spent: Coming soon</p>
        <p>🧠 Skill Progress: AI based</p>
      </div>

      <p style={styles.note}>
        Growth-focused learning 🌱 No pressure.
      </p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f8e9",
    padding: "40px",
  },
  heading: {
    marginBottom: "30px",
    color: "#2e7d32",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  note: {
    marginTop: "20px",
    fontStyle: "italic",
  },
};
