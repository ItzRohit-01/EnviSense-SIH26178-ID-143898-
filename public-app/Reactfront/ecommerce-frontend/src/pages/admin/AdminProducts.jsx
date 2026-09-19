import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../config";

const AdminProducts = () => {
  const [view, setView] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", categoryId: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("token");

  const userId = (() => { try { const decoded = jwtDecode(token); return decoded.userId || decoded.id; } catch { return null; } })();
  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => { try { const res = await axios.get(`${API_BASE_URL}/api/admin/products`, getAuthHeaders()); setProducts(res.data || []); } catch (err) { console.log(err); } };
  const fetchCategories = async () => { try { const res = await axios.get(`${API_BASE_URL}/api/categories`, getAuthHeaders()); setCategories(res.data || []); } catch (err) { console.log(err); } };
  const show = (text) => { setNotice(text); setTimeout(() => setNotice(""), 2200); };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) return show("Only JPG or PNG images are allowed.");
    if (file.size > 1024 * 1024) return show("Image must be below 1MB.");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await axios.post(`${API_BASE_URL}/api/admin/products/upload`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
    return res.data;
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = preview && !imageFile ? preview : "";
      if (imageFile) imageUrl = await uploadImage();
      const payload = { name: form.name, description: form.description, price: parseFloat(form.price), stock: parseInt(form.stock), imageUrl };
      if (editId) await axios.put(`${API_BASE_URL}/api/admin/products/${editId}`, payload, getAuthHeaders());
      else await axios.post(`${API_BASE_URL}/api/admin/products?categoryId=${form.categoryId}`, payload, getAuthHeaders());
      resetForm(); fetchProducts(); setView("list"); show("Product saved.");
    } catch (err) { console.log(err); show("Save failed."); }
  };

  const deleteProduct = async (id) => { await axios.delete(`${API_BASE_URL}/api/admin/products/${id}`, getAuthHeaders()); fetchProducts(); show("Product deleted."); };
  const editProduct = (p) => { setForm({ name: p.name || "", description: p.description || "", price: p.price || "", stock: p.stock || "", categoryId: p.category?.id || "" }); setPreview(p.imageUrl); setImageFile(null); setEditId(p.id); setView("form"); };
  const resetForm = () => { setForm({ name: "", description: "", price: "", stock: "", categoryId: "" }); setImageFile(null); setPreview(null); setEditId(null); };
  const myProducts = products.filter((p) => String(p.createdBy?.id || p.createdBy) === String(userId));

  return (
    <div className="space-y-md">
      {notice && <Toast>{notice}</Toast>}
      <PageHeader title="Product Management" subtitle="Create products, upload imagery, and maintain stock." />
      <Tabs view={view} setView={setView} items={[['dashboard','Dashboard'],['form', editId ? 'Edit Product' : 'Add Product'],['list','View Products']]} />
      {view === "dashboard" && <div className="grid gap-md sm:grid-cols-2"><Metric label="Total Products" value={products.length}/><Metric label="My Products" value={myProducts.length}/></div>}
      {view === "form" && <section className="grid gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:grid-cols-[1fr_260px]"><div><h2 className="font-headline-sm text-headline-sm text-on-surface">{editId ? 'Update Product' : 'Create Product'}</h2><div className="mt-md grid gap-sm"><Input placeholder="Product Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/><textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="min-h-28 rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"/><div className="grid gap-sm sm:grid-cols-2"><Input type="number" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/><Input type="number" placeholder="Stock" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})}/></div><select value={form.categoryId} onChange={(e)=>setForm({...form,categoryId:e.target.value})} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"><option value="">Select Category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><div className="flex gap-sm"><Primary onClick={handleSubmit}>{editId ? 'Update' : 'Save'}</Primary><Secondary onClick={resetForm}>Reset</Secondary></div></div></div><aside><label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md text-center text-secondary hover:border-primary hover:text-primary">{preview ? <img src={preview} alt="Preview" className="h-44 w-full rounded-lg object-cover"/> : <><span className="material-symbols-outlined text-4xl">add_photo_alternate</span><span className="mt-xs font-label-md text-label-md">Upload JPG / PNG</span></>}<input type="file" hidden onChange={handleImageChange}/></label>{preview && <Secondary onClick={()=>{setPreview(null);setImageFile(null);}}>Remove Image</Secondary>}</aside></section>}
      {view === "list" && <div className="space-y-md"><DataTable title="All Products" products={products}/><DataTable title="My Products" products={myProducts} actions={(p)=><div className="flex gap-xs"><Secondary onClick={()=>editProduct(p)}>Edit</Secondary><Danger onClick={()=>deleteProduct(p.id)}>Delete</Danger></div>}/></div>}
    </div>
  );
};

const PageHeader = ({ title, subtitle }) => <div><span className="font-label-md text-label-md uppercase text-primary">Admin</span><h1 className="mt-xs font-headline-md text-headline-md text-on-surface">{title}</h1><p className="mt-xs font-body-md text-body-md text-on-surface-variant">{subtitle}</p></div>;
const Tabs = ({ view, setView, items }) => <div className="flex flex-wrap gap-xs border-b border-outline-variant/30">{items.map(([id,label])=><button key={id} onClick={()=>setView(id)} className={`px-md py-sm font-label-md text-label-md ${view===id?'border-b-2 border-primary text-primary':'text-secondary hover:text-primary'}`}>{label}</button>)}</div>;
const Metric = ({ label, value }) => <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><span className="font-label-md text-label-md uppercase text-secondary">{label}</span><p className="mt-sm font-display-lg-mobile text-primary">{value}</p></section>;
const Input = (props) => <input {...props} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />;
const Primary = ({ children, ...props }) => <button {...props} className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">{children}</button>;
const Secondary = ({ children, ...props }) => <button {...props} className="rounded-lg border border-outline-variant px-sm py-xs font-label-sm text-label-sm text-secondary hover:text-primary">{children}</button>;
const Danger = ({ children, ...props }) => <button {...props} className="rounded-lg bg-error/10 px-sm py-xs font-label-sm text-label-sm text-error hover:bg-error hover:text-white">{children}</button>;
const Toast = ({ children }) => <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 font-body-sm text-body-sm text-inverse-on-surface shadow-lg">{children}</div>;
const DataTable = ({ title, products, actions }) => <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm"><div className="border-b border-outline-variant/30 p-md"><h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-surface-container-low text-secondary"><tr>{["Image","Name","Description","Price","Stock", actions ? "Actions" : null].filter(Boolean).map(h=><th key={h} className="px-sm py-sm font-label-sm text-label-sm uppercase">{h}</th>)}</tr></thead><tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">{products.length ? products.map(p=><tr key={p.id}><td className="px-sm py-sm"><img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-lg object-cover bg-surface-container-low"/></td><td className="px-sm py-sm text-on-surface">{p.name}</td><td className="max-w-xs px-sm py-sm text-on-surface-variant">{p.description}</td><td className="px-sm py-sm text-primary">Rs. {p.price}</td><td className="px-sm py-sm text-on-surface-variant">{p.stock}</td>{actions && <td className="px-sm py-sm">{actions(p)}</td>}</tr>) : <tr><td colSpan={actions ? 6 : 5} className="px-sm py-lg text-center text-on-surface-variant">No products found.</td></tr>}</tbody></table></div></section>;
export default AdminProducts;
