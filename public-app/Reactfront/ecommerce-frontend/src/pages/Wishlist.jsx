import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlistAPI, removeWishlistAPI } from "../services/wishlistService";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import noImage from "../assets/no-image.png";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;

const getImage = (img) => {
  if (!img || typeof img !== "string" || img.trim() === "") return noImage;
  const value = img.trim();
  if (value.startsWith("http")) return value;
  return value.startsWith("/") ? `${BASE_URL}${value}` : `${BASE_URL}/${value}`;
};

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wishlistData, productData] = await Promise.all([
        getWishlistAPI(),
        getProducts(),
      ]);
      setWishlist(wishlistData || []);
      setProducts(productData || []);
    } catch (err) {
      console.error(err);
      showToast("Could not load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const productsById = useMemo(() => {
    const map = new Map();
    products.forEach((product) => map.set(String(product.id), product));
    return map;
  }, [products]);

  const productIdOf = (item) => item.productId || item.product?.id || item.id;

  const wishlistItems = wishlist.map((item) => {
    const productId = productIdOf(item);
    const product = item.product || productsById.get(String(productId));
    return { ...item, productId, product };
  });

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  };

  const removeItem = async (productId) => {
    try {
      await removeWishlistAPI(productId);
      setWishlist((prev) => prev.filter((item) => String(productIdOf(item)) !== String(productId)));
      showToast("Removed from wishlist.");
    } catch (err) {
      console.error(err);
      showToast("Could not remove item.");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      const product = productsById.get(String(productId));
      showToast(`${product?.name || "Product"} added to cart.`);
    } catch (err) {
      console.error(err);
      showToast("Could not add to cart.");
    }
  };

  return (
    <main className="min-h-screen bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop">
      {toast && <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">{toast}</div>}

      <section className="mx-auto max-w-[1440px]">
        <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-label-md text-label-md uppercase text-primary">Saved Items</span>
            <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">My Wishlist</h1>
            <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Keep favorites ready for cart and checkout.</p>
          </div>
          <button type="button" onClick={() => navigate("/products")} className="inline-flex items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary shadow-sm transition hover:bg-surface-container-low">
            <span className="material-symbols-outlined">storefront</span>
            Browse Products
          </button>
        </div>

        {loading ? (
          <Panel>Loading wishlist...</Panel>
        ) : wishlistItems.length === 0 ? (
          <Panel>
            <p>Your wishlist is empty.</p>
            <button type="button" onClick={() => navigate("/categories")} className="mt-md rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">Start Shopping</button>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 gap-base sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {wishlistItems.map((item) => {
              const product = item.product;
              const key = item.id || item.productId;
              return (
                <article key={key} className="group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="aspect-square bg-surface-container-low p-sm">
                    <img src={getImage(product?.imageUrl)} alt={product?.name || "Wishlist product"} className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="flex min-h-[172px] flex-col p-sm">
                    <span className="mb-xs font-label-sm text-label-sm uppercase text-secondary">Wishlist</span>
                    <h2 className="line-clamp-2 flex-1 font-body-md text-body-md font-semibold text-on-surface">{product?.name || "Product unavailable"}</h2>
                    <p className="mt-xs font-headline-sm text-headline-sm text-primary">Rs. {product?.price || 0}</p>
                    <div className="mt-sm grid grid-cols-2 gap-xs">
                      <button type="button" disabled={!product} onClick={() => handleAddToCart(item.productId)} className="rounded-lg bg-primary px-sm py-xs font-label-sm text-label-sm text-on-primary transition hover:brightness-105 disabled:opacity-50">Add</button>
                      <button type="button" onClick={() => removeItem(item.productId)} className="rounded-lg bg-error/10 px-sm py-xs font-label-sm text-label-sm text-error transition hover:bg-error hover:text-white">Remove</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

const Panel = ({ children }) => <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center font-body-lg text-body-lg text-on-surface-variant shadow-sm">{children}</div>;

export default WishlistPage;
