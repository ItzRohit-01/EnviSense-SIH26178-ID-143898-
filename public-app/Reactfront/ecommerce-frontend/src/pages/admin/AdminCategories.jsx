import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../config";

const AdminCategories = () => {
  const [view, setView] = useState("dashboard");
  const [categories, setCategories] = useState([]);
  const [myCategories, setMyCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const token = localStorage.getItem("token");

  const loggedInId = (() => {
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.adminId || decoded.id || decoded.sub;
    } catch {
      return null;
    }
  })();

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const allRes = await axios.get(`${API_BASE_URL}/api/admin/categories`, getAuthHeaders());
      setCategories(allRes.data || []);

      if (loggedInId) {
        const mineRes = await axios.get(`${API_BASE_URL}/api/admin/categories/admin/${loggedInId}`, getAuthHeaders());
        setMyCategories(mineRes.data || []);
      }
    } catch (err) {
      console.log(err);
      show("Could not load categories.");
    }
  };

  const ownerIdOf = (category) => {
    const owner = category.createdBy || category.user || category.admin || category.seller || category.createdById || category.adminId || category.userId;
    return typeof owner === "object" ? owner?.id || owner?.userId || owner?.adminId : owner;
  };

  const handleSubmit = async () => {
    try {
      const payload = { name: form.name, description: form.description };
      if (editId) await axios.put(`${API_BASE_URL}/api/admin/categories/${editId}`, payload, getAuthHeaders());
      else await axios.post(`${API_BASE_URL}/api/admin/categories`, payload, getAuthHeaders());
      resetForm();
      await fetchCategories();
      setView("list");
      show("Category saved for logged-in admin.");
    } catch (err) {
      console.log(err);
      show("Could not save category.");
    }
  };

  const deleteCategory = async (category) => {
    if (!myCategories.some((item) => item.id === category.id)) return show("You can only delete your own categories.");
    await axios.delete(`${API_BASE_URL}/api/admin/categories/${category.id}`, getAuthHeaders());
    fetchCategories();
    show("Category deleted.");
  };

  const editCategory = (category) => {
    if (!myCategories.some((item) => item.id === category.id)) return show("You can only edit your own categories.");
    setForm({ name: category.name || "", description: category.description || "" });
    setEditId(category.id);
    setView("form");
  };

  const resetForm = () => { setForm({ name: "", description: "" }); setEditId(null); };
  const show = (text) => { setNotice(text); setTimeout(() => setNotice(""), 2200); };

  return (
    <div className="space-y-md">
      {notice && <Toast>{notice}</Toast>}
      <PageHeader title="Category Management" subtitle={`Logged-in admin id: ${loggedInId || "not found"}. All categories are read-only; only your categories can be edited or deleted.`} />
      <Tabs view={view} setView={setView} items={[["dashboard", "Dashboard"], ["form", editId ? "Edit Category" : "Add Category"], ["list", "View Categories"]]} />

      {view === "dashboard" && (
        <div className="grid gap-md sm:grid-cols-2">
          <Metric label="All Categories" value={categories.length} />
          <Metric label="My Categories" value={myCategories.length} />
        </div>
      )}

      {view === "form" && (
        <section className="max-w-2xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{editId ? "Update Category" : "Create Category"}</h2>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">The backend assigns this category to the currently logged-in admin.</p>
          <div className="mt-md grid gap-sm">
            <Input placeholder="Category Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            <div className="flex gap-sm">
              <Primary onClick={handleSubmit}>{editId ? "Update" : "Save"}</Primary>
              <Secondary onClick={resetForm}>Reset</Secondary>
            </div>
          </div>
        </section>
      )}

      {view === "list" && (
        <div className="space-y-md">
          <Table title="All Categories" headers={["ID", "Name", "Description", "Owner"]} rows={categories.map((category) => [category.id, category.name, category.description || "-", ownerIdOf(category) || "-"])} empty="No categories found." />
          <Table title="My Categories" headers={["ID", "Name", "Description", "Actions"]} rows={myCategories.map((category) => [category.id, category.name, category.description || "-", <div className="flex gap-xs" key={category.id}><Secondary onClick={() => editCategory(category)}>Edit</Secondary><Danger onClick={() => deleteCategory(category)}>Delete</Danger></div>])} empty="You have not added categories with this logged-in admin yet." />
        </div>
      )}
    </div>
  );
};

const PageHeader = ({ title, subtitle }) => <div><span className="font-label-md text-label-md uppercase text-primary">Admin</span><h1 className="mt-xs font-headline-md text-headline-md text-on-surface">{title}</h1><p className="mt-xs font-body-md text-body-md text-on-surface-variant">{subtitle}</p></div>;
const Tabs = ({ view, setView, items }) => <div className="flex flex-wrap gap-xs border-b border-outline-variant/30">{items.map(([id, label]) => <button key={id} onClick={() => setView(id)} className={`px-md py-sm font-label-md text-label-md ${view === id ? "border-b-2 border-primary text-primary" : "text-secondary hover:text-primary"}`}>{label}</button>)}</div>;
const Metric = ({ label, value }) => <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><span className="font-label-md text-label-md uppercase text-secondary">{label}</span><p className="mt-sm font-display-lg-mobile text-primary">{value}</p></section>;
const Input = (props) => <input {...props} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />;
const Primary = ({ children, ...props }) => <button {...props} className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">{children}</button>;
const Secondary = ({ children, ...props }) => <button {...props} className="rounded-lg border border-outline-variant px-sm py-xs font-label-sm text-label-sm text-secondary hover:text-primary">{children}</button>;
const Danger = ({ children, ...props }) => <button {...props} className="rounded-lg bg-error/10 px-sm py-xs font-label-sm text-label-sm text-error hover:bg-error hover:text-white">{children}</button>;
const Toast = ({ children }) => <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">{children}</div>;
const Table = ({ title, headers, rows, empty }) => <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm"><div className="border-b border-outline-variant/30 p-md"><h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-surface-container-low text-secondary"><tr>{headers.map((header) => <th key={header} className="px-sm py-sm font-label-sm text-label-sm uppercase">{header}</th>)}</tr></thead><tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">{rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="px-sm py-sm text-on-surface-variant">{cell}</td>)}</tr>) : <tr><td colSpan={headers.length} className="px-sm py-lg text-center text-on-surface-variant">{empty}</td></tr>}</tbody></table></div></section>;
export default AdminCategories;
