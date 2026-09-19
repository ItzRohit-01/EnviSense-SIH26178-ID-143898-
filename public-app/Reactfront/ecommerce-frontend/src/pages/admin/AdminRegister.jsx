import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/admin/register`, form);
      setNotice("Admin registered successfully.");
      setTimeout(() => navigate("/admin/Adminlogin"), 600);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setNotice("Admin registration failed.");
    }
  };

  return <AuthShell title="Admin Registration" subtitle="Create a seller/admin account." notice={notice}><form onSubmit={handleSubmit} className="grid gap-sm"><Field name="name" placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} required/><Field name="email" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} required/><Field name="password" type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} required/><button className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">Register</button><button type="button" onClick={()=>navigate('/admin/Adminlogin')} className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-primary">Back to Login</button></form></AuthShell>;
};
const AuthShell = ({ title, subtitle, notice, children }) => <main className="grid min-h-screen place-items-center bg-background px-margin-mobile py-lg"><section className="w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-lg"><span className="font-label-md text-label-md uppercase text-primary">Lumina Admin</span><h1 className="mt-xs font-headline-md text-headline-md text-on-surface">{title}</h1><p className="mt-xs font-body-md text-body-md text-on-surface-variant">{subtitle}</p>{notice && <div className="my-sm rounded-lg bg-primary-fixed px-sm py-xs text-primary">{notice}</div>}<div className="mt-md">{children}</div></section></main>;
const Field = (props) => <input {...props} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />;
export default AdminRegister;
