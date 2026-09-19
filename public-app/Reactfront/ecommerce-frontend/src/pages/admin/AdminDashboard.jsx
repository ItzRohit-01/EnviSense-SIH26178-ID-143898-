import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../config";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId || decoded.sub || decoded.id);
    } catch (err) {
      console.log("JWT error:", err);
    }
  }, [token]);

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    if (!userId) return;
    fetchProducts();
  }, [userId]);

  useEffect(() => {
    if (products.length) fetchOrders();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`, getAuthHeaders());
      const mine = (res.data || []).filter((p) => String(p.userId || p.createdBy?.id || p.createdBy || p.sellerId || p.user?.id || p.adminId) === String(userId));
      setProducts(mine);
      setCategoryCount(new Set(mine.map((p) => p.category?.name || p.category || p.categoryId).filter(Boolean)).size);
    } catch (err) {
      console.log("Products error:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/orders`, getAuthHeaders());
      const ids = products.map((p) => String(p.id));
      const mine = (res.data || []).filter((order) => (order.items || order.orderItems || []).some((item) => ids.includes(String(item.productId || item.product?.id))));
      setOrders(mine);
      setRevenue(mine.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0));
    } catch (err) {
      console.log("Orders error:", err);
    }
  };

  return (
    <div className="space-y-lg">
      <div>
        <span className="font-label-md text-label-md uppercase text-primary">Control Panel</span>
        <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">Admin Dashboard</h1>
        <p className="mt-xs font-body-md text-body-md text-on-surface-variant">Monitor catalog health, orders, and revenue.</p>
      </div>

      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Products" value={products.length} icon="inventory_2" />
        <Stat title="Orders" value={orders.length} icon="receipt_long" />
        <Stat title="Categories" value={categoryCount} icon="category" />
        <Stat title="Revenue" value={`Rs. ${revenue}`} icon="payments" />
      </div>

      <div className="grid gap-md lg:grid-cols-2">
        <DataTable title="Recent Products" headers={["ID", "Name", "Category", "Price"]} rows={products.slice(0, 8).map((p) => [p.id, p.name, p.category?.name || p.category || "-", `Rs. ${p.price || 0}`])} />
        <DataTable title="Recent Orders" headers={["Order", "Customer", "City", "Status", "Total"]} rows={orders.slice(0, 8).map((o) => [o.id, o.name || o.userName || "-", o.city || "-", o.status || "-", `Rs. ${o.totalAmount || 0}`])} />
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon }) => (
  <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
    <div className="flex items-center justify-between">
      <span className="font-label-md text-label-md uppercase text-secondary">{title}</span>
      <span className="material-symbols-outlined rounded-lg bg-primary-fixed p-2 text-primary">{icon}</span>
    </div>
    <p className="mt-md font-display-lg-mobile text-primary">{value}</p>
  </section>
);

const DataTable = ({ title, headers, rows }) => (
  <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
    <div className="border-b border-outline-variant/30 p-md"><h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2></div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low text-secondary"><tr>{headers.map((h) => <th key={h} className="px-sm py-sm font-label-sm text-label-sm uppercase">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
          {rows.length ? rows.map((row, i) => <tr key={i} className="hover:bg-surface-container-low/60">{row.map((cell, j) => <td key={j} className="px-sm py-sm text-on-surface-variant">{cell}</td>)}</tr>) : <tr><td colSpan={headers.length} className="px-sm py-lg text-center text-on-surface-variant">No data found.</td></tr>}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminDashboard;
