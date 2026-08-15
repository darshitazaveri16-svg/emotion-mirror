const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getApiBaseUrl = () => API_BASE_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Request failed"
    );
  }

  return data;
};

export const authApi = {
  login: (email, password) =>
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(parseResponse),

  signup: (name, email, password) =>
    fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }).then(parseResponse),
};

export const roomsApi = {
  create: (payload) =>
    fetch(`${API_BASE_URL}/api/rooms`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }).then(parseResponse),

  get: (roomId) =>
    fetch(`${API_BASE_URL}/api/rooms/${roomId}`).then(
      parseResponse
    ),
};

export const conversationsApi = {
  create: (payload) =>
    fetch(`${API_BASE_URL}/api/conversations`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }).then(parseResponse),

  get: (id) =>
    fetch(`${API_BASE_URL}/api/conversations/${id}`, {
      headers: getAuthHeaders(),
    }).then(parseResponse),

  reflection: (id) =>
    fetch(
      `${API_BASE_URL}/api/conversations/${id}/reflection`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    ).then(parseResponse),
};

export const analyzeApi = {
  message: (payload) =>
    fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }).then(parseResponse),
};

export default API_BASE_URL;
