import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  if (!token) return <Navigate to="/admin/Adminlogin" replace />;
  if (role !== "admin") return <Navigate to="/admin/Adminlogin" replace />;

  return children;
};

export default AdminRoute;
