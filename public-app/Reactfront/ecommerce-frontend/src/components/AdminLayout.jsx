import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminNavbar />
      <main className="mx-auto max-w-[1440px] px-margin-mobile py-lg pt-28 md:px-margin-desktop">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
