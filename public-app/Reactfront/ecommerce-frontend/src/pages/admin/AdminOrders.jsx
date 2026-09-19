import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../config";

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const userId = useMemo(() => {
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.adminId || decoded.id || decoded.sub;
    } catch {
      return null;
    }
  }, [token]);

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/orders`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/admin/products`, getAuthHeaders()),
      ]);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      console.log(err);
      show("Could not load received orders.");
    } finally {
      setLoading(false);
    }
  };

  const show = (text) => { setNotice(text); setTimeout(() => setNotice(""), 2400); };

  const ownerIdOfProduct = (product) => {
    const owner = product.createdBy || product.user || product.admin || product.seller || product.createdById || product.adminId || product.userId || product.sellerId;
    return typeof owner === "object" ? owner?.id || owner?.userId || owner?.adminId : owner;
  };

  const productIdFromItem = (item) => item.productId || item.product?.id || item.product?.productId || item.id;

  const myProductIds = useMemo(() => {
    return products
      .filter((product) => String(ownerIdOfProduct(product)) === String(userId))
      .map((product) => String(product.id));
  }, [products, userId]);

  const orderItems = (order) => order.items || order.orderItems || order.cartItems || order.products || [];

  const receivedOrders = useMemo(() => {
    if (!orders.length || !myProductIds.length) return [];
    return orders.filter((order) => {
      if (order.productIds?.some((id) => myProductIds.includes(String(id)))) return true;
      return orderItems(order).some((item) => myProductIds.includes(String(productIdFromItem(item))));
    });
  }, [orders, myProductIds]);

  const updateStatus = async (orderId, nextStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/orders/status/${orderId}?status=${nextStatus}`, {}, getAuthHeaders());
      setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: nextStatus } : order));
      setSelectedOrder((prev) => prev?.id === orderId ? { ...prev, status: nextStatus } : prev);
      show("Order status updated.");
    } catch (err) {
      console.error(err);
      show("Could not update order status.");
    }
  };

  const countBy = (status) => receivedOrders.filter((order) => normalizeStatus(order.status) === status).length;

  return (
    <div className="space-y-md">
      {notice && <Toast>{notice}</Toast>}
      <div className="flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-label-md text-label-md uppercase text-primary">Admin</span>
          <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">Orders Received</h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Only orders containing products created by your admin account are shown here.</p>
        </div>
        <button type="button" onClick={loadData} className="rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary hover:bg-surface-container-low">Refresh</button>
      </div>

      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Received" value={receivedOrders.length} />
        <Metric label="Pending" value={countBy("PENDING")} />
        <Metric label="Confirmed" value={countBy("CONFIRMED")} />
        <Metric label="Shipped" value={countBy("SHIPPED")} />
        <Metric label="Delivered" value={countBy("DELIVERED")} />
      </div>

      {loading ? (
        <Panel>Loading orders...</Panel>
      ) : receivedOrders.length === 0 ? (
        <Panel>No received orders found for your products.</Panel>
      ) : (
        <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-secondary">
                <tr>
                  <th className="px-sm py-sm font-label-sm text-label-sm uppercase">Order</th>
                  <th className="px-sm py-sm font-label-sm text-label-sm uppercase">Customer</th>
                  <th className="px-sm py-sm font-label-sm text-label-sm uppercase">Payment</th>
                  <th className="px-sm py-sm font-label-sm text-label-sm uppercase">Status Action</th>
                  <th className="px-sm py-sm font-label-sm text-label-sm uppercase text-right">Total</th>
                  <th className="px-sm py-sm font-label-sm text-label-sm uppercase text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
                {receivedOrders.map((order) => {
                  const customer = order.name || order.userName || order.user?.name || "Customer";
                  const status = normalizeStatus(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-low/60">
                      <td className="px-sm py-sm font-label-md text-label-md text-primary">#{order.id}</td>
                      <td className="px-sm py-sm text-on-surface">{customer}</td>
                      <td className="px-sm py-sm text-on-surface-variant">{order.paymentStatus || order.paymentMethod || "Not available"}</td>
                      <td className="px-sm py-sm">
                        <select value={status} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-xs font-label-sm text-label-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
                          {statuses.map((item) => <option key={item} value={item}>{labelStatus(item)}</option>)}
                        </select>
                      </td>
                      <td className="px-sm py-sm text-right font-medium text-on-surface">Rs. {order.totalAmount || 0}</td>
                      <td className="px-sm py-sm text-center"><button type="button" onClick={() => setSelectedOrder(order)} className="font-label-sm text-label-sm text-primary hover:underline">View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-on-background/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <aside className="h-full w-full max-w-md overflow-y-auto border-l border-outline-variant/30 bg-surface-container-lowest shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-outline-variant/30 p-md">
              <div><h2 className="font-headline-sm text-headline-sm text-on-surface">Order #{selectedOrder.id}</h2><p className="text-on-surface-variant">{normalizeStatus(selectedOrder.status)}</p></div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-full p-2 text-secondary hover:bg-surface-container-high"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-md p-md">
              <Info title="Customer" lines={[selectedOrder.name || selectedOrder.userName || "Customer", selectedOrder.phone, selectedOrder.address, `${selectedOrder.city || ""} ${selectedOrder.pincode || ""}`]} />
              <Info title="Payment" lines={[`Method: ${selectedOrder.paymentMethod || "Not available"}`, `Status: ${selectedOrder.paymentStatus || "Not available"}`, `Total: Rs. ${selectedOrder.totalAmount || 0}`]} />
              <section className="rounded-xl border border-outline-variant/30 bg-surface p-md">
                <h3 className="font-label-md text-label-md uppercase text-secondary">Order Items</h3>
                <div className="mt-sm space-y-xs">
                  {orderItems(selectedOrder).length ? orderItems(selectedOrder).map((item, index) => <div key={item.id || index} className="flex justify-between gap-sm text-on-surface-variant"><span>{item.productName || item.product?.name || `Product ${productIdFromItem(item) || ""}`}</span><span>Qty {item.quantity || 1}</span></div>) : <p className="text-on-surface-variant">No item details available.</p>}
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

const normalizeStatus = (status = "PENDING") => status === "ORDER_PLACED" ? "PENDING" : status;
const labelStatus = (status) => status.replaceAll("_", " ");
const Metric = ({ label, value }) => <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><span className="font-label-md text-label-md uppercase text-secondary">{label}</span><p className="mt-sm font-display-lg-mobile text-primary">{value}</p></section>;
const Panel = ({ children }) => <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center font-body-lg text-body-lg text-on-surface-variant shadow-sm">{children}</div>;
const Toast = ({ children }) => <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">{children}</div>;
const Info = ({ title, lines }) => <section className="rounded-xl border border-outline-variant/30 bg-surface p-md"><h3 className="font-label-md text-label-md uppercase text-secondary">{title}</h3><div className="mt-sm space-y-xs font-body-sm text-body-sm text-on-surface-variant">{lines.filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}</div></section>;
export default AdminOrders;
