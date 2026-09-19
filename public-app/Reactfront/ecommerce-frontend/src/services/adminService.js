import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/user`;

export const registerAdmin = (data) => {
  return axios.post(`${BASE_URL}/admin/register`, data);
};
