import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/cart`;

// 🔥 GET TOKEN
const getToken = () => localStorage.getItem("token");

// 🔥 AUTH HEADER
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

// =======================
// ✅ ADD TO CART
// =======================
export const addToCart = async (productId, quantity = 1) => {
  if (!getToken()) {
    throw new Error("User not logged in");
  }

  const res = await axios.post(
    `${BASE_URL}/add/${productId}?quantity=${quantity}`,
    {},
    authConfig()
  );

  return res.data;
};

// =======================
// ✅ GET CART
// =======================
export const getCartItems = async () => {
  if (!getToken()) {
    console.error("No token found");
    return [];
  }

  const res = await axios.get(BASE_URL, authConfig());

  return res.data;
};

// =======================
// ✅ UPDATE QTY
// =======================
export const updateCartQty = async (cartId, quantity) => {
  if (!getToken()) {
    throw new Error("User not logged in");
  }

  const res = await axios.put(
    `${BASE_URL}/update/${cartId}?quantity=${quantity}`,
    {},
    authConfig()
  );

  return res.data;
};

// =======================
// ✅ REMOVE ITEM
// =======================
export const removeCartItem = async (cartId) => {
  if (!getToken()) {
    throw new Error("User not logged in");
  }

  const res = await axios.delete(
    `${BASE_URL}/${cartId}`,
    authConfig()
  );

  return res.data;
};
