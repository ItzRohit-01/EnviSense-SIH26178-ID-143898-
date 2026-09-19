import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const BASE_URL = API_BASE_URL;
const emptyProfile = { name: "", email: "", phone: "", role: "", address: "", city: "", country: "", profileImage: "" };
const getImageUrl = (img) => !img ? "/default-avatar.png" : img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`;

const AdminProfile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const token = localStorage.getItem("token");

  useEffect(() => { fetchProfile(); }, []);
  const show = (text) => { setNotice(text); setTimeout(() => setNotice(""), 2500); };
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProfile = async () => { try { const res = await axios.get(`${BASE_URL}/api/admin/profile`, auth); setProfile({ ...emptyProfile, ...res.data }); setImageUrl(getImageUrl(res.data.profileImage) + "?t=" + Date.now()); } catch { show("Failed to load admin profile."); } finally { setLoading(false); } };
  const updateProfile = async () => { try { const res = await axios.put(`${BASE_URL}/api/admin/profile`, profile, auth); setProfile({ ...emptyProfile, ...res.data }); setEditMode(false); show("Profile updated."); } catch { show("Update failed."); } };
  const updatePassword = async () => { if (!passwordData.oldPassword || !passwordData.newPassword) return show("Enter both passwords."); try { await axios.put(`${BASE_URL}/api/admin/change-password`, passwordData, auth); setPasswordData({ oldPassword: "", newPassword: "" }); show("Password updated."); } catch { show("Password update failed."); } };
  const handleFileChange = (e) => { const selected = e.target.files[0]; setFile(selected || null); if (selected) setImageUrl(URL.createObjectURL(selected)); };
  const uploadImage = async () => { if (!file) return; const formData = new FormData(); formData.append("file", file); try { const res = await axios.post(`${BASE_URL}/api/admin/upload-image`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }); setProfile((prev) => ({ ...prev, profileImage: res.data })); setImageUrl(getImageUrl(res.data) + "?t=" + Date.now()); setFile(null); show("Image uploaded."); } catch { show("Upload failed."); } };

  if (loading) return <Panel>Loading admin profile...</Panel>;
  return <div className="space-y-md">{notice && <Toast>{notice}</Toast>}<div><span className="font-label-md text-label-md uppercase text-primary">Admin</span><h1 className="mt-xs font-headline-md text-headline-md text-on-surface">Admin Profile</h1><p className="mt-xs font-body-md text-body-md text-on-surface-variant">Manage admin identity, image, and password.</p></div><section className="grid gap-md lg:grid-cols-[360px_1fr]"><aside className="h-fit rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md text-center shadow-sm"><img src={imageUrl} alt="Admin" className="mx-auto h-32 w-32 rounded-full border-4 border-primary-fixed object-cover"/><h2 className="mt-md font-headline-sm text-headline-sm text-on-surface">{profile.name || 'Admin'}</h2><p className="mt-xs text-on-surface-variant">{profile.email}</p><label className="mt-md flex cursor-pointer items-center justify-center gap-xs rounded-lg border border-outline-variant px-md py-sm text-primary"><span className="material-symbols-outlined">photo_camera</span>Choose Image<input type="file" hidden onChange={handleFileChange}/></label><button onClick={uploadImage} disabled={!file} className="mt-sm w-full rounded-lg bg-primary px-md py-sm text-on-primary disabled:opacity-50">Upload Image</button></aside><div className="space-y-md"><section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><div className="mb-md flex justify-between gap-sm"><h2 className="font-headline-sm text-headline-sm">Profile Details</h2>{!editMode ? <button onClick={()=>setEditMode(true)} className="rounded-lg bg-primary px-md py-sm text-on-primary">Edit</button> : <div className="flex gap-sm"><button onClick={updateProfile} className="rounded-lg bg-primary px-md py-sm text-on-primary">Save</button><button onClick={()=>setEditMode(false)} className="rounded-lg border border-outline-variant px-md py-sm text-secondary">Cancel</button></div>}</div><div className="grid gap-sm sm:grid-cols-2">{['name','email','phone','role','address','city','country'].map((key)=><label key={key} className="grid gap-xs"><span className="font-label-sm text-label-sm uppercase text-secondary">{key}</span><input name={key} value={profile[key] || ''} disabled={!editMode || key==='email' || key==='role'} onChange={(e)=>setProfile({...profile,[key]:e.target.value})} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm disabled:text-on-surface-variant"/></label>)}</div></section><section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><h2 className="font-headline-sm text-headline-sm">Change Password</h2><div className="mt-md grid gap-sm sm:grid-cols-[1fr_1fr_auto]"><input type="password" placeholder="Old Password" value={passwordData.oldPassword} onChange={(e)=>setPasswordData({...passwordData,oldPassword:e.target.value})} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm"/><input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(e)=>setPasswordData({...passwordData,newPassword:e.target.value})} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm"/><button onClick={updatePassword} className="rounded-lg bg-primary px-md py-sm text-on-primary">Update</button></div></section></div></section></div>;
};
const Toast = ({children}) => <div className="fixed right-4 top-24 z-[100] rounded-lg bg-inverse-surface px-4 py-3 text-inverse-on-surface shadow-lg">{children}</div>;
const Panel = ({children}) => <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center text-on-surface-variant shadow-sm">{children}</div>;
export default AdminProfile;
