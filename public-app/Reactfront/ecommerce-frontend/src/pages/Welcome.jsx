import { useNavigate } from "react-router-dom";

const heroImage = "https://res.cloudinary.com/uogvrgkk/image/upload/v1782740777/growtika-mlpsHpUUCHY-unsplash_culxwk.jpg?auto=format&fit=crop&w=1400&q=80";
const adminImage = "https://res.cloudinary.com/uogvrgkk/image/upload/v1782740969/deng-xiang--WXQm_NTK0U-unsplash_hj5uoj.jpg?auto=format&fit=crop&w=900&q=80";
const shoppingImage = "https://res.cloudinary.com/uogvrgkk/image/upload/v1782741369/growtika-hQgvtxX_WCE-unsplash_ro9wyp.jpg?auto=format&fit=crop&w=900&q=80";

function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <section className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 items-center gap-lg px-margin-mobile py-lg md:grid-cols-12 md:px-margin-desktop">
        <div className="md:col-span-5">
<span className="uppercase text-primary" style={{ fontSize: "24px", fontWeight: "600" }}> Lumina Commerce </span>
          <h1 className="mt-sm font-display-lg-mobile text-on-surface md:font-display-lg">Premium shopping and store management in one app.</h1>
          <p className="mt-md font-body-lg text-body-lg text-on-surface-variant">Customers can browse, wishlist, checkout, and track orders. Admins can manage categories, products, and received orders from a focused dashboard.</p>
          <p className="mt-md font-body-lg text-body-lg text-on-surface-variant">Happy Shopping !!!</p>
          <div className="mt-md flex flex-wrap gap-sm">
            <button onClick={() => navigate("/user/Userlogin")} className="rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105">Login as User</button>
            <button onClick={() => navigate("/admin/Adminlogin")} className="rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary shadow-sm transition hover:bg-surface-container-low">Login as Admin</button>
            <button onClick={() => navigate("/register")} className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-secondary transition hover:text-primary">Create Account</button>
          </div>
        </div>

        <div className="relative md:col-span-7">
          <img src={heroImage} alt="Lumina Commerce app shopping workspace" className="h-[420px] w-full rounded-xl border border-outline-variant/30 object-cover shadow-lg md:h-[560px]" />
          <div className="absolute bottom-md left-md right-md grid gap-sm sm:grid-cols-2">
            <FeatureCard image={shoppingImage} title="Customer Storefront" text="Cart, checkout, wishlist, profile, and order tracking." />
            <FeatureCard image={adminImage} title="Admin Console" text="Catalog tools, received orders, and status actions." />
          </div>
        </div>
      </section>
    </main>
  );
}

const FeatureCard = ({ image, title, text }) => (
  <div className="overflow-hidden rounded-lg border border-white/30 bg-white/85 shadow-md backdrop-blur">
    <img src={image} alt={title} className="h-24 w-full object-cover" />
    <div className="p-sm">
      <h2 className="font-label-md text-label-md text-on-surface">{title}</h2>
      <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{text}</p>
    </div>
  </div>
);

export default Welcome;
