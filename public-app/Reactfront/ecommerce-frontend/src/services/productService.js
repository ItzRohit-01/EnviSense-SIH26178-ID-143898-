import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/products`;

// ✅ Get all products
export const getProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ✅ Get products by category
export const getProductsByCategory = async (categoryId) => {
  const res = await axios.get(`${API_URL}/category/${categoryId}`);
  return res.data;
};
