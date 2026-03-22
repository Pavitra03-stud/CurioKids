const API = "http://localhost:5000/api";

export const registerUser = async (data) => {
  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
// CREATE CHILD
export const createChild = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/child/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

const API_URL = "http://localhost:5000/api";

export const getProgress = async (childId, token) => {
  const res = await fetch(`${API_URL}/progress/${childId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};