import { jwtDecode } from "jwt-decode";

export const AUTH_CHANGE_EVENT = "auth-change";

export const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const isLoggedIn = () => localStorage.getItem("token") !== null;

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("adminId");
  notifyAuthChange();
};

export const getToken = () => localStorage.getItem("token");

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId || decoded.id || null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
