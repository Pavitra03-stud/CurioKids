const API = `${import.meta.env.VITE_API_URL}/api`;

export const registerUser = async (data) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
// CREATE CHILD
export const createChild = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/child/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const getProgress = async (childId, token) => {
  const res = await fetch(`${API_URL}/progress/${childId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};