import { requestJson } from "./client";

export const registerUser = async (email, password) => {
  return requestJson("/user/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const loginUser = async (email, password) => {
  return requestJson("/user/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      longExpiry: false
    }),
  });
};

export const refreshToken = async (refreshToken) => {
  return requestJson("/user/refresh", {
    method: "POST",
    body: JSON.stringify({
      refreshToken,
    }),
  });
};

export const logoutUser = async (refreshToken) => {
  return requestJson("/user/logout", {
    method: "POST",
    body: JSON.stringify({
      refreshToken,
    }),
  });
};
