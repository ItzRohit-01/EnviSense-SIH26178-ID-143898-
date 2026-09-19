import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { logout } from "../utils/auth";

const navItems = [
  { label: "Shop", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Orders", to: "/orders" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = [
    "/",
    "/user/Userlogin",
    "/user/register",
    "/admin/Adminlogin",
    "/admin/register",
    "/register",
  ].includes(location.pathname);

  if (!token || role === "admin" || isAdminRoute || isAuthRoute) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const submitSearch = () => {
    const value = search.trim();
    navigate(value ? `/Home?search=${encodeURIComponent(value)}` : "/Home");
    setMenuOpen(false);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") submitSearch();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-md px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-gutter">
          <Link to="/Home" className="font-headline-sm text-headline-sm font-bold text-primary">
            Lumina Commerce
          </Link>
          <div className="hidden gap-base md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-sm py-xs font-label-md text-label-md transition-colors ${
                  isActive(item.to)
                    ? "border-b-2 border-primary text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-md sm:flex">
          <div className="relative max-w-xs flex-1 md:flex-none">
            <input
              className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2 pl-4 pr-10 font-body-sm text-body-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:w-64"
              placeholder="Search products..."
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearch}
            />
            <button
              type="button"
              aria-label="Search"
              onClick={submitSearch}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </div>

          <div className="flex items-center gap-xs">
            <button type="button" aria-label="Wishlist" onClick={() => navigate("/wishlist")} className="rounded-full p-2 text-secondary transition hover:bg-surface-container-high hover:text-primary">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button type="button" aria-label="Cart" onClick={() => navigate("/cart")} className="rounded-full p-2 text-secondary transition hover:bg-surface-container-high hover:text-primary">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
            <button type="button" aria-label="Profile" onClick={() => navigate("/profile")} className="rounded-full p-2 text-secondary transition hover:bg-surface-container-high hover:text-primary">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            <button type="button" onClick={handleLogout} className="rounded-lg bg-error/10 px-sm py-xs font-label-sm text-label-sm text-error transition hover:bg-error hover:text-white">
              Logout
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex rounded-full p-2 text-secondary transition hover:bg-surface-container-high hover:text-primary sm:hidden"
        >
          <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-outline-variant/30 bg-surface-container-lowest px-margin-mobile py-md shadow-lg sm:hidden">
          <div className="mb-sm flex gap-xs">
            <input
              className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm font-body-sm text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearch}
            />
            <button type="button" onClick={submitSearch} className="rounded-lg bg-primary px-sm text-on-primary">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
          <div className="grid gap-xs">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="rounded-lg px-sm py-sm font-label-md text-label-md text-secondary hover:bg-surface-container-low hover:text-primary">
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-3 gap-xs pt-xs">
              <button type="button" onClick={() => navigate("/wishlist")} className="rounded-lg border border-outline-variant py-sm text-secondary">Wishlist</button>
              <button type="button" onClick={() => navigate("/cart")} className="rounded-lg border border-outline-variant py-sm text-secondary">Cart</button>
              <button type="button" onClick={() => navigate("/profile")} className="rounded-lg border border-outline-variant py-sm text-secondary">Profile</button>
            </div>
            <button type="button" onClick={handleLogout} className="mt-xs rounded-lg bg-error/10 px-sm py-sm font-label-md text-label-md text-error">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
