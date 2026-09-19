import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, updateCartQty, removeCartItem } from "../services/cartService";
import noImage from "../assets/no-image.png";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) loadCart();
  }, [token]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCartItems();
      setCartItems(data || []);
    } catch (err) {
      console.error("Cart error:", err);
      setNotice("Could not load your cart.");
    } finally {
      setLoading(false);
    }
  };

  const getImage = (img) => (!img || img.trim() === "" ? noImage : img);

  const changeQty = async (item, nextQty) => {
    if (nextQty < 1) return;
    try {
      await updateCartQty(item.id, nextQty);
      setCartItems((prev) => prev.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: nextQty } : cartItem));
    } catch (err) {
      console.error(err);
      setNotice("Could not update quantity.");
    }
  };

  const removeItem = async (id) => {
    try {
      await removeCartItem(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setNotice("Item removed from cart.");
      setTimeout(() => setNotice(""), 2000);
    } catch (err) {
      console.error(err);
      setNotice("Could not remove item.");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <main className="min-h-screen bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop">
      {notice && <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">{notice}</div>}

      <section className="mx-auto max-w-[1440px]">
        <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-label-md text-label-md uppercase text-primary">Shopping Bag</span>
            <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">Your Cart</h1>
            <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Review quantities before checkout.</p>
          </div>
          <button type="button" onClick={() => navigate("/products")} className="inline-flex items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary shadow-sm transition hover:bg-surface-container-low">
            <span className="material-symbols-outlined">storefront</span>
            Continue Shopping
          </button>
        </div>

        {loading ? (
          <EmptyState text="Loading cart..." />
        ) : !token ? (
          <EmptyState text="Please login to view your cart." />
        ) : cartItems.length === 0 ? (
          <EmptyState text="Your cart is empty." action="Browse Products" onAction={() => navigate("/products")} />
        ) : (
          <div className="grid gap-md lg:grid-cols-[1fr_360px]">
            <div className="space-y-base">
              {cartItems.map((item) => {
                const price = item.product?.price || 0;
                return (
                  <article key={item.id} className="grid gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-sm shadow-sm md:grid-cols-[120px_1fr_auto] md:items-center">
                    <img src={getImage(item.product?.imageUrl)} alt={item.product?.name || "Product"} className="h-32 w-full rounded-lg bg-surface-container-low object-cover md:h-28 md:w-28" />
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">{item.product?.name || "Product"}</h2>
                      <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Price: Rs. {price}</p>
                      <p className="mt-xs font-label-md text-label-md text-primary">Line total: Rs. {price * item.quantity}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-sm md:justify-end">
                      <div className="flex h-10 items-center rounded-lg border border-outline-variant bg-surface">
                        <button type="button" aria-label="Decrease quantity" onClick={() => changeQty(item, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center text-secondary hover:text-primary">-</button>
                        <span className="w-10 text-center font-label-md text-label-md text-on-surface">{item.quantity}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => changeQty(item, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center text-secondary hover:text-primary">+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="inline-flex items-center gap-xs rounded-lg bg-error/10 px-sm py-xs font-label-sm text-label-sm text-error transition hover:bg-error hover:text-white">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Order Summary</h2>
              <div className="mt-md space-y-sm border-b border-outline-variant/30 pb-md font-body-md text-body-md text-on-surface-variant">
                <div className="flex justify-between"><span>Items</span><span>{cartItems.length}</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span>Rs. {total}</span></div>
              </div>
              <div className="mt-md flex justify-between font-headline-sm text-headline-sm text-on-surface"><span>Total</span><span>Rs. {total}</span></div>
              <button type="button" onClick={() => navigate("/checkout")} className="mt-md flex w-full items-center justify-center gap-xs rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105">
                <span className="material-symbols-outlined">payments</span>
                Proceed to Checkout
              </button>
              <button type="button" onClick={() => navigate("/orders")} className="mt-sm flex w-full items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary transition hover:bg-surface-container-low">
                <span className="material-symbols-outlined">receipt_long</span>
                Order History
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

const EmptyState = ({ text, action, onAction }) => (
  <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center shadow-sm">
    <p className="font-body-lg text-body-lg text-on-surface-variant">{text}</p>
    {action && <button type="button" onClick={onAction} className="mt-md rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">{action}</button>}
  </div>
);

export default Cart;
