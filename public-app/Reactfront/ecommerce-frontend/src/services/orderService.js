import axios from "axios";
import { getToken } from "../utils/auth";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/orders`;

const authHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// 🛒 PLACE ORDER (FIXED URL ALSO)
export const placeOrderAPI = async (orderData) => {
  const res = await axios.post(`${API}/checkout`, orderData, authHeader());
  return res.data;
};

// 🧾 GET MY ORDERS
export const getMyOrdersAPI = async () => {
  const res = await axios.get(`${API}/my`, authHeader());
  return res.data;
};

// 📦 GET ORDER DETAILS
export const getOrderByIdAPI = async (orderId) => {
  const res = await axios.get(`${API}/${orderId}`, authHeader());
  return res.data;
};
