import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ProductReviews from "../components/ProductReviews";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;

const categoryTiles = [
  {
    label: "Electronics",
    caption: "Latest gadgets and gear",
    className: "md:col-span-2 md:row-span-2",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Fashion",
    caption: "Everyday essentials",
    className: "md:col-span-1 md:row-span-1",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Home & Living",
    caption: "Refined spaces",
    className: "md:col-span-1 md:row-span-1",
    image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Accessories",
    caption: "Up to 40% off",
    className: "md:col-span-2 md:row-span-1",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("search") || "";

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (id, event) => {
    if (event) event.stopPropagation();
    try {
      await axios.post(
        `${BASE_URL}/api/cart/add/${id}?quantity=1`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const product = products.find((item) => item.id === id);
      setToast(`${product?.name || "Product"} added to cart`);
      setTimeout(() => setToast(null), 2200);
    } catch (err) {
      console.log(err);
      setToast("Could not add this product to cart");
      setTimeout(() => setToast(null), 2200);
    }
  };

  const getImage = (product) => {
    const img = product.image || product.imageUrl || product.img || product.imagePath;
    if (!img) return "https://via.placeholder.com/600x600?text=Lumina";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}/${img}`;
  };

  const displayedProducts = searchQuery ? filteredProducts : products;

  return (
    <main className="flex-grow bg-background pt-20">
      {toast && (
        <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">
          {toast}
        </div>
      )}

      {!searchQuery && (
        <section className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-gutter px-margin-mobile py-lg md:grid-cols-12 md:px-margin-desktop md:py-xl">
          <div className="z-10 col-span-1 flex flex-col gap-md md:col-span-5">
            <span className="font-label-md text-label-md uppercase text-primary">New Arrival</span>
            <h1 className="font-display-lg-mobile text-on-surface md:font-display-lg">
              The Future of Sound is Here.
            </h1>
            <p className="max-w-md font-body-lg text-body-lg text-on-surface-variant">
              Experience premium products, live inventory, and a checkout flow tuned for quick decisions.
            </p>
            <div className="mt-sm flex flex-wrap gap-sm">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="rounded-lg border border-primary-container bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105 hover:shadow-md active:scale-95"
              >
                Shop Now
              </button>
              <button
                type="button"
                onClick={() => navigate("/categories")}
                className="rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary shadow-sm transition hover:bg-surface-container-low active:scale-95"
              >
                Browse Categories
              </button>
            </div>
          </div>
          <div className="relative col-span-1 md:col-span-7">
            <div className="absolute inset-0 -z-10 rotate-3 rounded-[2rem] bg-primary/5 scale-105" />
            <img
              alt="Premium wireless headphones"
              className="h-auto w-full rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest object-cover shadow-lg"
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80"
            />
          </div>
        </section>
      )}

      {!searchQuery && (
        <section className="bg-surface-container-lowest px-margin-mobile py-lg md:px-margin-desktop">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-md flex items-end justify-between gap-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Shop by Category</h2>
                <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
                  Curated collections for your lifestyle.
                </p>
              </div>
              <Link to="/categories" className="hidden items-center gap-xs font-label-md text-label-md text-primary transition hover:text-primary-container sm:flex">
                View All Categories
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid auto-rows-[180px] grid-cols-1 gap-base md:grid-cols-4 md:auto-rows-[240px] md:gap-gutter">
              {categoryTiles.map((tile) => (
                <Link key={tile.label} to="/categories" className={`${tile.className} group relative overflow-hidden rounded-xl border border-outline-variant/30 shadow-sm transition hover:shadow-md`}>
                  <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={tile.image} alt={tile.label} />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-md">
                    <h3 className="font-headline-sm text-headline-sm text-white">{tile.label}</h3>
                    <p className="mt-xs font-body-sm text-body-sm text-white/80">{tile.caption}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1440px] px-margin-mobile py-lg md:px-margin-desktop">
        <div className="mb-md flex items-end justify-between gap-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {searchQuery ? `Results for "${searchQuery}"` : "Trending Now"}
          </h2>
          {!searchQuery && (
            <Link to="/products" className="hidden items-center gap-xs font-label-md text-label-md text-primary transition hover:text-primary-container sm:flex">
              View All
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          )}
        </div>

        {displayedProducts.length === 0 ? (
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center shadow-sm">
            <p className="font-body-lg text-body-lg text-on-surface-variant">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-base sm:grid-cols-2 md:grid-cols-4 md:gap-gutter">
            {displayedProducts.map((product) => (
              <article key={product.id} onClick={() => setSelectedProduct(product)} className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-square overflow-hidden bg-surface-container-low p-sm">
                  <img src={getImage(product)} alt={product.name} className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
                  <button type="button" aria-label="Add to cart" onClick={(event) => handleAddToCart(product.id, event)} className="absolute bottom-sm right-sm flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-on-surface opacity-0 shadow-sm backdrop-blur transition hover:bg-primary hover:text-white group-hover:opacity-100">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-sm">
                  <div className="mb-xs font-label-sm text-label-sm uppercase text-secondary">Product</div>
                  <h3 className="mb-sm line-clamp-2 flex-1 font-body-md text-body-md font-medium text-on-surface">{product.name}</h3>
                  <span className="font-headline-sm text-headline-sm text-primary">Rs. {product.price}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <section className="relative max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-xl bg-surface-container-lowest shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-label="Close product details" className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition hover:text-error" onClick={() => setSelectedProduct(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="grid gap-lg p-md md:grid-cols-2 md:p-lg">
              <div className="overflow-hidden rounded-xl bg-surface-container-low">
                <img src={getImage(selectedProduct)} alt={selectedProduct.name} className="h-full min-h-[320px] w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md uppercase text-primary">Product Detail</span>
                <h2 className="mt-xs font-headline-md text-headline-md text-on-surface">{selectedProduct.name}</h2>
                <p className="mt-sm font-display-lg-mobile text-primary">Rs. {selectedProduct.price}</p>
                <p className="mt-md flex-1 font-body-md text-body-md text-on-surface-variant">
                  {selectedProduct.description || "No description available for this product. High quality material and premium design."}
                </p>
                <button
                  type="button"
                  className="mt-md flex w-full items-center justify-center gap-xs rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105"
                  onClick={() => {
                    handleAddToCart(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="border-t border-outline-variant/30 p-md md:p-lg">
              <ProductReviews productId={selectedProduct.id} />
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Home;
