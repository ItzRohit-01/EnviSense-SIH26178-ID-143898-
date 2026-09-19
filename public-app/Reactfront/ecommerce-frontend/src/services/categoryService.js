import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/categories`;

// ✅ GET ALL CATEGORIES
export const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
