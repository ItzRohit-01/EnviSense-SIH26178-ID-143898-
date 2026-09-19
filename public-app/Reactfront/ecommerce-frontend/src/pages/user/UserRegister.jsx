import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const UserRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/user/register`, form);
      setNotice("User registered successfully.");
      setTimeout(() => navigate("/user/UserLogin"), 600);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setNotice("User registration failed.");
    }
  };

  return <AuthShell title="User Registration" subtitle="Create a customer account." notice={notice}><form onSubmit={handleSubmit} className="grid gap-sm"><Field name="name" placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} required/><Field name="email" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} required/><Field name="password" type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} required/><button className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">Register</button><button type="button" onClick={()=>navigate('/user/Userlogin')} className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-primary">Back to Login</button></form></AuthShell>;
};
const AuthShell = ({ title, subtitle, notice, children }) => <main className="grid min-h-screen place-items-center bg-background px-margin-mobile py-lg"><section className="w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-lg"><span className="font-label-md text-label-md uppercase text-primary">Lumina Commerce</span><h1 className="mt-xs font-headline-md text-headline-md text-on-surface">{title}</h1><p className="mt-xs font-body-md text-body-md text-on-surface-variant">{subtitle}</p>{notice && <div className="my-sm rounded-lg bg-primary-fixed px-sm py-xs text-primary">{notice}</div>}<div className="mt-md">{children}</div></section></main>;
const Field = (props) => <input {...props} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />;
export default UserRegister;
