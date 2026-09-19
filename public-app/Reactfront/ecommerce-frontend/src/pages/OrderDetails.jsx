import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderByIdAPI } from "../services/orderService";

const steps = ["ORDER_PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { loadOrder(); }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderByIdAPI(id);
      setOrder(data);
      setError("");
    } catch (err) {
      console.error("Error fetching order", err);
      setError(err.response?.status === 403 ? "You are not allowed to view this order." : "Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Shell><Panel>Loading order...</Panel></Shell>;
  if (error) return <Shell><Panel>{error}</Panel></Shell>;
  if (!order) return <Shell><Panel>No order found.</Panel></Shell>;

  const currentIndex = Math.max(steps.indexOf(order.status), 0);
  const items = order.items || order.orderItems || [];

  return (
    <Shell>
      <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button type="button" onClick={() => navigate("/orders")} className="mb-sm inline-flex items-center gap-xs font-label-md text-label-md text-secondary transition hover:text-primary">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Order History
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">Order Details</h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Status: {order.status}</p>
        </div>
        <span className="font-headline-sm text-headline-sm text-primary">Rs. {order.totalAmount || 0}</span>
      </div>

      <div className="grid gap-md lg:grid-cols-[1fr_360px]">
        <div className="space-y-md">
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Items</h2>
            <div className="mt-md space-y-sm">
              {items.length === 0 ? <p className="text-on-surface-variant">No items listed.</p> : items.map((item, index) => (
                <div key={item.id || index} className="flex justify-between gap-sm border-b border-outline-variant/20 pb-sm font-body-md text-body-md">
                  <div>
                    <p className="font-medium text-on-surface">{item.productName || item.product?.name || "Product"}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-primary">Rs. {item.price || item.product?.price || 0}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Tracking</h2>
            <div className="mt-md grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => {
                const done = index <= currentIndex;
                return (
                  <div key={step} className={`rounded-lg border p-sm ${done ? "border-primary bg-primary-fixed text-primary" : "border-outline-variant bg-surface text-on-surface-variant"}`}>
                    <span className="font-label-sm text-label-sm">{step.replaceAll("_", " ")}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-md">
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Delivery</h2>
            <div className="mt-sm font-body-md text-body-md text-on-surface-variant">
              <p className="font-medium text-on-surface">{order.name || "Customer"}</p>
              <p>{order.address}</p>
              <p>{order.city} - {order.pincode}</p>
            </div>
          </section>
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Payment</h2>
            <div className="mt-sm space-y-xs font-body-md text-body-md text-on-surface-variant">
              <p>Status: {order.paymentStatus || "Not available"}</p>
              <p>Method: {order.paymentMethod || "Not available"}</p>
            </div>
          </section>
        </aside>
      </div>
    </Shell>
  );
}

const Shell = ({ children }) => <main className="min-h-screen bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop"><section className="mx-auto max-w-[1440px]">{children}</section></main>;
const Panel = ({ children }) => <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center font-body-lg text-body-lg text-on-surface-variant shadow-sm">{children}</div>;
