import { useEffect, useState } from "react";
import { getProgress } from "../api";

export default function Progress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const childId = localStorage.getItem("childId");

      const result = await getProgress(childId, token);
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>📊 Progress</h1>

      {data.map((item, index) => (
        <div key={index}>
          <p>Game: {item.game}</p>
          <p>Score: {item.score}</p>
          <p>Status: {item.completed ? "✅ Completed" : "❌"}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}