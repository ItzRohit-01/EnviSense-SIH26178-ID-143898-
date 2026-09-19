import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notifyAuthChange } from "../../utils/auth";
import { API_BASE_URL } from "../../config";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) return setNotice("Please fill all fields.");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      const token = res.data?.token || res.data;
      if (!token) return setNotice("Login failed: no token received.");
      let role = "admin";
      let adminId = null;
      try { const payload = JSON.parse(atob(token.split(".")[1])); role = payload.role || "admin"; adminId = payload.adminId || payload.id || null; } catch {}
      if (role.toLowerCase() !== "admin") return setNotice("Access denied: only admins allowed here.");
      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");
      if (adminId) localStorage.setItem("adminId", adminId);
      notifyAuthChange();
      navigate("/admin/dashboard", { replace: true });
    } catch (err) { console.log(err); setNotice("Login failed. Check backend or credentials."); }
  };

  return <AuthShell title="Admin Login" subtitle="Sign in to manage the store." notice={notice}><form onSubmit={handleSubmit} className="grid gap-sm"><Field type="email" name="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/><Field type="password" name="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/><button className="rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm">Login</button><button type="button" onClick={()=>navigate('/admin/register')} className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-primary">Register Here</button></form></AuthShell>;
};
const AuthShell = ({ title, subtitle, notice, children }) => <main className="grid min-h-screen place-items-center bg-background px-margin-mobile py-lg"><section className="w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-lg"><span className="font-label-md text-label-md uppercase text-primary">Lumina Admin</span><h1 className="mt-xs font-headline-md text-headline-md text-on-surface">{title}</h1><p className="mt-xs font-body-md text-body-md text-on-surface-variant">{subtitle}</p>{notice && <div className="my-sm rounded-lg bg-error-container px-sm py-xs text-on-error-container">{notice}</div>}<div className="mt-md">{children}</div></section></main>;
const Field = (props) => <input {...props} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />;
export default AdminLogin;
