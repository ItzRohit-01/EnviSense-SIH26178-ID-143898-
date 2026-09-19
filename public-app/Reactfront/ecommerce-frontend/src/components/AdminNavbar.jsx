import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
  { label: "Categories", path: "/admin/categories", icon: "category" },
  { label: "Products", path: "/admin/products", icon: "inventory_2" },
  { label: "Orders", path: "/admin/orders", icon: "receipt_long" },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();
  const isAuthPage = location.pathname === "/admin/Adminlogin" || location.pathname === "/admin/register";

  if (!token || role !== "admin" || isAuthPage) return null;

  const handleLogout = () => {
    logout();
    navigate("/admin/Adminlogin", { replace: true });
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-md px-margin-mobile md:px-margin-desktop">
        <Link to="/admin/dashboard" className="font-headline-sm text-headline-sm font-bold text-primary">
          Lumina Admin
        </Link>

        <div className="hidden items-center gap-xs md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`inline-flex items-center gap-xs rounded-lg px-sm py-xs font-label-md text-label-md transition ${active ? "bg-primary-fixed text-primary" : "text-secondary hover:bg-surface-container-low hover:text-primary"}`}>
                <span className={`material-symbols-outlined text-[20px] ${active ? "icon-fill" : ""}`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-xs">
          <button type="button" aria-label="Admin profile" onClick={() => navigate("/admin/AdminProfile")} className="rounded-full p-2 text-secondary transition hover:bg-surface-container-high hover:text-primary">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button type="button" onClick={handleLogout} className="rounded-lg bg-error/10 px-sm py-xs font-label-sm text-label-sm text-error transition hover:bg-error hover:text-white">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex gap-xs overflow-x-auto border-t border-outline-variant/20 px-margin-mobile py-xs md:hidden">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="whitespace-nowrap rounded-lg px-sm py-xs font-label-sm text-label-sm text-secondary hover:bg-surface-container-low hover:text-primary">
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default AdminNavbar;
