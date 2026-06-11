export const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const authHeader = (token) => (
  token ? { Authorization: `Bearer ${token}` } : {}
);

export const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    return {
      ...data,
      error: true,
      status: response.status,
      message: data.message || response.statusText || "Request failed",
    };
  }

  return data;
};
