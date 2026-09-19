import { useNavigate } from "react-router-dom";

const RegisterChoice = () => {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen place-items-center bg-background px-margin-mobile py-lg">
      <section className="w-full max-w-3xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-lg">
        <span className="font-label-md text-label-md uppercase text-primary">Lumina Commerce</span>
        <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">Choose Register Type</h1>
        <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Create a customer account or open the admin tools for catalog management.</p>
        <div className="mt-md grid gap-md sm:grid-cols-2">
          <button onClick={() => navigate("/user/register")} className="rounded-xl border border-outline-variant/30 bg-surface p-md text-left shadow-sm transition hover:border-primary hover:shadow-md">
            <span className="material-symbols-outlined rounded-lg bg-primary-fixed p-2 text-primary">person</span>
            <h2 className="mt-md font-headline-sm text-headline-sm text-on-surface">Register as User</h2>
            <p className="mt-xs text-on-surface-variant">Shop products, manage cart, and track orders.</p>
          </button>
          <button onClick={() => navigate("/admin/register")} className="rounded-xl border border-outline-variant/30 bg-surface p-md text-left shadow-sm transition hover:border-primary hover:shadow-md">
            <span className="material-symbols-outlined rounded-lg bg-primary-fixed p-2 text-primary">admin_panel_settings</span>
            <h2 className="mt-md font-headline-sm text-headline-sm text-on-surface">Register as Admin</h2>
            <p className="mt-xs text-on-surface-variant">Create categories, products, and manage orders.</p>
          </button>
        </div>
      </section>
    </main>
  );
};
export default RegisterChoice;
