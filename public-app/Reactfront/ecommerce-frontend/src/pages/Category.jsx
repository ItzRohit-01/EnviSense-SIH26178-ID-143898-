import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import {
  FaLaptop,
  FaTshirt,
  FaBook,
  FaFootballBall,
  FaFemale,
  FaHome,
} from "react-icons/fa";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    }
  };

  const handleClick = (id) => {
    navigate(`/products/${id}`);
  };

  const getIcon = (name = "") => {
    const normalized = name.toLowerCase();
    if (normalized.includes("electronic")) return <FaLaptop />;
    if (normalized.includes("cloth") || normalized.includes("fashion")) return <FaTshirt />;
    if (normalized.includes("book")) return <FaBook />;
    if (normalized.includes("sport")) return <FaFootballBall />;
    if (normalized.includes("beauty")) return <FaFemale />;
    if (normalized.includes("home")) return <FaHome />;
    return <FaLaptop />;
  };

  return (
    <main className="min-h-screen flex-grow bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop">
      <section className="mx-auto max-w-[1440px]">
        <div className="mb-lg grid gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm md:grid-cols-[1.4fr_0.6fr] md:p-lg">
          <div>
            <span className="font-label-md text-label-md uppercase text-primary">Collections</span>
            <h1 className="mt-xs font-display-lg-mobile text-on-surface md:font-display-lg">
              Explore Categories
            </h1>
            <p className="mt-sm max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
              Browse curated departments and jump straight into live products from your store catalog.
            </p>
          </div>
          <div className="flex items-end md:justify-end">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center gap-xs rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105"
            >
              <span className="material-symbols-outlined">storefront</span>
              View All Products
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-md rounded-lg border border-error-container bg-error-container px-md py-sm font-body-md text-body-md text-on-error-container">
            {error}
          </div>
        )}

        {categories.length === 0 && !error ? (
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center shadow-sm">
            <p className="font-body-lg text-body-lg text-on-surface-variant">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-base sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleClick(category.id)}
                className="group flex min-h-[190px] flex-col items-start justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-xl text-primary transition group-hover:bg-primary group-hover:text-on-primary">
                  {getIcon(category.name)}
                </span>
                <span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    {category.name}
                  </h2>
                  <span className="mt-xs inline-flex items-center gap-xs font-label-md text-label-md text-secondary transition group-hover:text-primary">
                    Shop now
                    <span className="material-symbols-outlined text-base transition group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CategoryPage;
