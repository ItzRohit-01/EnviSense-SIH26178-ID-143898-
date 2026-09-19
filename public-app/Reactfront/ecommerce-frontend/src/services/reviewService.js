import axios from "axios";
import { getToken, getUserIdFromToken } from "../utils/auth";
import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/reviews`;

/* ================= AUTH HEADER ================= */
const authHeader = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* ================= GET REVIEWS ================= */
export const getReviewsByProductAPI = async (productId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/product/${productId}`,
      authHeader()
    );
    return res.data;
  } catch (err) {
    console.error("GET REVIEWS ERROR:", err.response || err);
    throw err;
  }
};

/* ================= ADD REVIEW ================= */
export const addReviewAPI = async (review) => {
  try {
    // ✅ GET USER ID FROM JWT (BEST METHOD)
    const userId = getUserIdFromToken();

    if (!userId) {
      throw new Error("User not logged in or token invalid");
    }

    const res = await axios.post(
      `${BASE_URL}/${userId}`, // ✅ FIXED ENDPOINT
      review,
      authHeader()
    );

    return res.data;
  } catch (err) {
    console.error("ADD REVIEW ERROR:", err.response || err);
    throw err;
  }
};

/* ================= DELETE REVIEW ================= */
export const deleteReviewAPI = async (id) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/${id}`,
      authHeader()
    );
    return res.data;
  } catch (err) {
    console.error("DELETE REVIEW ERROR:", err.response || err);
    throw err;
  }
};
