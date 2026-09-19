import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrdersAPI } from "../services/orderService";

const badgeClass = (status = "") => {
  const normalized = status.toUpperCase();
  if (normalized.includes("DELIVERED")) return "bg-tertiary-fixed text-on-tertiary-fixed";
  if (normalized.includes("SHIPPED") || normalized.includes("CONFIRMED")) return "bg-secondary-container text-on-secondary-container";
  if (normalized.includes("CANCEL")) return "bg-error-container text-on-error-container";
  return "bg-primary-fixed text-on-primary-fixed";
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrdersAPI();
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop">
      <section className="mx-auto max-w-[1440px]">
        <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-label-md text-label-md uppercase text-primary">Purchases</span>
            <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">Order History</h1>
            <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Track every order from placement to delivery.</p>
          </div>
          <button type="button" onClick={() => navigate("/products")} className="rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary transition hover:bg-surface-container-low">Shop More</button>
        </div>

        {loading ? (
          <Panel>Loading orders...</Panel>
        ) : error ? (
          <Panel>{error}</Panel>
        ) : orders.length === 0 ? (
          <Panel>No orders found.</Panel>
        ) : (
          <div className="grid gap-base">
            {orders.map((order, index) => (
              <article key={order.id} className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-md md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-sm">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Order #{index + 1}</h2>
                      <span className={`rounded-full px-sm py-xs font-label-sm text-label-sm ${badgeClass(order.status)}`}>{order.status || "PENDING"}</span>
                    </div>
                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Payment: {order.paymentMethod || order.paymentStatus || "Not available"}</p>
                  </div>
                  <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
                    <span className="font-headline-sm text-headline-sm text-primary">Rs. {order.totalAmount || 0}</span>
                    <button type="button" onClick={() => navigate(`/orders/${order.id}`)} className="inline-flex items-center justify-center gap-xs rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105">
                      Details
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const Panel = ({ children }) => <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center font-body-lg text-body-lg text-on-surface-variant shadow-sm">{children}</div>;
