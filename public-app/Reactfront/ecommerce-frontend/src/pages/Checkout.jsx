import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../services/cartService";
import axios from "axios";
import { API_BASE_URL } from "../config";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [address, setAddress] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [payment, setPayment] = useState("COD");
  const navigate = useNavigate();

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCartItems();
      setCartItems(data || []);
    } catch (err) {
      console.error(err);
      setNotice("Could not load checkout items.");
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleChange = (event) => {
    setAddress((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const placeOrder = async () => {
    if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
      setNotice("Please fill all delivery details.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotice("Please login first.");
        return;
      }

      const orderData = {
        ...address,
        paymentMethod: payment,
        totalAmount: total,
        items: cartItems.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      };

      await axios.post(`${API_BASE_URL}/api/orders/checkout`, orderData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setNotice("Order placed successfully.");
      setTimeout(() => navigate("/orders"), 600);
    } catch (err) {
      console.error("Order error:", err);
      setNotice("Failed to place order.");
    }
  };

  return (
    <main className="min-h-screen bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop">
      {notice && <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">{notice}</div>}

      <section className="mx-auto max-w-[1440px]">
        <div className="mb-md">
          <span className="font-label-md text-label-md uppercase text-primary">Secure Checkout</span>
          <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">Checkout</h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Confirm delivery, payment, and order details.</p>
        </div>

        {loading ? (
          <Panel>Loading checkout...</Panel>
        ) : cartItems.length === 0 ? (
          <Panel>
            <p>Your cart is empty.</p>
            <button type="button" onClick={() => navigate("/products")} className="mt-md rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">Browse Products</button>
          </Panel>
        ) : (
          <div className="grid gap-md lg:grid-cols-[1fr_380px]">
            <div className="space-y-md">
              <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Delivery Address</h2>
                <div className="mt-md grid gap-sm sm:grid-cols-2">
                  <Field name="name" placeholder="Full Name" value={address.name} onChange={handleChange} />
                  <Field name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} />
                  <textarea name="address" placeholder="Address" value={address.address} onChange={handleChange} className="min-h-28 rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm font-body-md text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary sm:col-span-2" />
                  <Field name="city" placeholder="City" value={address.city} onChange={handleChange} />
                  <Field name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} />
                </div>
              </section>

              <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Payment Method</h2>
                <div className="mt-md grid gap-sm sm:grid-cols-2">
                  <PaymentOption label="Cash on Delivery" value="COD" payment={payment} setPayment={setPayment} icon="payments" />
                  <PaymentOption label="UPI / Card / Net Banking" value="ONLINE" payment={payment} setPayment={setPayment} icon="credit_card" />
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Order Summary</h2>
              <div className="mt-md space-y-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-sm border-b border-outline-variant/20 pb-sm font-body-sm text-body-sm text-on-surface-variant">
                    <span className="line-clamp-2">{item.product?.name}</span>
                    <span className="whitespace-nowrap">Rs. {item.product?.price || 0} x {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-md flex justify-between font-headline-sm text-headline-sm text-on-surface"><span>Total</span><span>Rs. {total}</span></div>
              <button type="button" onClick={placeOrder} className="mt-md flex w-full items-center justify-center gap-xs rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105">
                <span className="material-symbols-outlined">check_circle</span>
                Place Order
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

const Field = ({ name, placeholder, value, onChange }) => (
  <input name={name} placeholder={placeholder} value={value} onChange={onChange} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm font-body-md text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary" />
);

const PaymentOption = ({ label, value, payment, setPayment, icon }) => (
  <label className={`flex cursor-pointer items-center gap-sm rounded-lg border p-sm transition ${payment === value ? "border-primary bg-primary-fixed text-primary" : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50"}`}>
    <input type="radio" value={value} checked={payment === value} onChange={(event) => setPayment(event.target.value)} className="text-primary focus:ring-primary" />
    <span className="material-symbols-outlined">{icon}</span>
    <span className="font-label-md text-label-md">{label}</span>
  </label>
);

const Panel = ({ children }) => <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center font-body-lg text-body-lg text-on-surface-variant shadow-sm">{children}</div>;

export default Checkout;
