import { useEffect, useState, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts, getProductsByCategory } from "../services/productService";
import { addToCart } from "../services/cartService";
import {
  addToWishlistAPI,
  removeWishlistAPI,
  getWishlistAPI,
} from "../services/wishlistService";
import ProductReviews from "../components/ProductReviews";
import noImage from "../assets/no-image.png";

const getImage = (img) => (!img || typeof img !== "string" ? noImage : img);

const ProductCard = memo(({ product, onAdd, onWishlist, isWished, onView }) => {
  const [wish, setWish] = useState(false);

  useEffect(() => setWish(isWished), [isWished]);

  const toggleWishlist = (event) => {
    event.stopPropagation();
    const next = !wish;
    setWish(next);
    onWishlist(product, next);
  };

  return (
    <article
      onClick={() => onView(product)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-square bg-surface-container-low p-sm">
        <img
          src={getImage(product.imageUrl)}
          alt={product.name}
          className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
          onClick={toggleWishlist}
          className="absolute right-sm top-sm flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm backdrop-blur transition hover:bg-primary hover:text-white"
        >
          <span className={`material-symbols-outlined ${wish ? "icon-fill" : ""}`}>
            favorite
          </span>
        </button>
        <button
          type="button"
          aria-label="Add to cart"
          onClick={(event) => {
            event.stopPropagation();
            onAdd(product.id);
          }}
          className="absolute bottom-sm right-sm flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-on-surface opacity-0 shadow-sm backdrop-blur transition hover:bg-primary hover:text-white group-hover:opacity-100"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
        </button>
      </div>

      <div className="flex min-h-[152px] flex-col p-sm">
        <span className="mb-xs font-label-sm text-label-sm uppercase text-secondary">Lumina Pick</span>
        <h3 className="line-clamp-2 flex-1 font-body-md text-body-md font-semibold text-on-surface">
          {product.name}
        </h3>
        <div className="mt-sm flex items-center justify-between gap-sm">
          <span className="font-headline-sm text-headline-sm text-primary">Rs. {product.price}</span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onView(product);
            }}
            className="rounded-lg border border-outline-variant px-sm py-xs font-label-sm text-label-sm text-secondary transition hover:border-primary hover:text-primary"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
});

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [toast, setToast] = useState(null);

  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getWishlistAPI().then(setWishlist).catch(console.error);
  }, []);

  useEffect(() => {
    const request = categoryId ? getProductsByCategory(categoryId) : getProducts();
    request.then(setProducts).catch(console.error);
  }, [categoryId]);

  const handleWishlist = async (product, state) => {
    try {
      if (state) await addToWishlistAPI(product.id);
      else await removeWishlistAPI(product.id);
      setWishlist(await getWishlistAPI());
    } catch (err) {
      console.error(err);
    }
  };

  const isWished = (id) => wishlist.some((item) => (item.productId || item.id) === id);

  const handleAdd = async (id) => {
    try {
      await addToCart(id, 1);
      const product = products.find((item) => item.id === id);
      setAddedId(id);
      setToast(`${product?.name || "Product"} added to cart`);
      setTimeout(() => setToast(null), 2200);
      setTimeout(() => setAddedId(null), 1500);
    } catch (err) {
      console.error(err);
      setToast("Could not add this product to cart");
      setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <main className="min-h-screen flex-grow bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop">
      {toast && (
        <div className="fixed right-4 top-24 z-[1000] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">
          {toast}
        </div>
      )}

      <section className="mx-auto max-w-[1440px]">
        <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="mb-sm inline-flex items-center gap-xs font-label-md text-label-md text-secondary transition hover:text-primary"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Categories
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              {categoryId ? "Curated Products" : "All Products"}
            </h1>
            <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
              Premium finds, live inventory, and checkout-ready actions from your catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center justify-center gap-xs rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Cart
          </button>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center shadow-sm">
            <p className="font-body-lg text-body-lg text-on-surface-variant">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-base sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAdd}
                onWishlist={handleWishlist}
                isWished={isWished(product.id)}
                onView={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <section
            className="relative max-h-[90vh] w-full max-w-[960px] overflow-y-auto rounded-xl bg-surface-container-lowest shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close product details"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition hover:text-error"
              onClick={() => setSelectedProduct(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="grid gap-lg p-md md:grid-cols-2 md:p-lg">
              <div className="overflow-hidden rounded-xl bg-surface-container-low">
                <img
                  src={getImage(selectedProduct.imageUrl)}
                  alt={selectedProduct.name}
                  className="h-full min-h-[320px] w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md uppercase text-primary">Product Detail</span>
                <h2 className="mt-xs font-headline-md text-headline-md text-on-surface">
                  {selectedProduct.name}
                </h2>
                <p className="mt-sm font-display-lg-mobile text-primary">Rs. {selectedProduct.price}</p>
                <p className="mt-md flex-1 font-body-md text-body-md text-on-surface-variant">
                  {selectedProduct.description || "A premium product selected for the Lumina storefront."}
                </p>
                <button
                  type="button"
                  className="mt-md inline-flex w-full items-center justify-center gap-xs rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105"
                  onClick={() => handleAdd(selectedProduct.id)}
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {addedId === selectedProduct.id ? "Added" : "Add to Cart"}
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
}
