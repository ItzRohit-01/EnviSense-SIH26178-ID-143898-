import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;

const getImageUrl = (img) => {
  if (!img) return "/default-avatar.png";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/uploads/${img}`;
};

const emptyProfile = { name: "", email: "", phone: "", role: "", address: "", city: "", country: "", profileImage: "" };

const Profile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const token = localStorage.getItem("token");

  useEffect(() => { fetchProfile(); }, []);

  const showMessage = (text, isError = false) => {
    setMessage(isError ? "" : text);
    setError(isError ? text : "");
    setTimeout(() => { setMessage(""); setError(""); }, 2600);
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ ...emptyProfile, ...res.data });
      setImageUrl(getImageUrl(res.data.profileImage) + "?t=" + Date.now());
    } catch {
      showMessage("Failed to load profile.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setProfile((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const updateProfile = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/api/user/profile`, profile, { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ ...emptyProfile, ...res.data });
      setEditMode(false);
      showMessage("Profile updated.");
    } catch {
      showMessage("Update failed.", true);
    }
  };

  const updatePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      showMessage("Enter both passwords.", true);
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/user/change-password`, passwordData, { headers: { Authorization: `Bearer ${token}` } });
      setPasswordData({ oldPassword: "", newPassword: "" });
      showMessage("Password updated.");
    } catch {
      showMessage("Password update failed.", true);
    }
  };

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    setFile(selected || null);
    if (selected) setImageUrl(URL.createObjectURL(selected));
  };

  const uploadImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${BASE_URL}/api/user/upload-image`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      const img = res.data;
      setProfile((prev) => ({ ...prev, profileImage: img }));
      setImageUrl(getImageUrl(img) + "?t=" + Date.now());
      setFile(null);
      showMessage("Image uploaded.");
    } catch {
      showMessage("Upload failed.", true);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop"><Panel>Loading profile...</Panel></main>;
  }

  return (
    <main className="min-h-screen bg-background px-margin-mobile py-lg pt-28 md:px-margin-desktop">
      {(message || error) && <div className={`fixed right-4 top-24 z-[100] rounded-lg px-4 py-3 font-body-sm text-body-sm shadow-lg ${error ? "bg-error text-on-error" : "bg-inverse-surface text-inverse-on-surface"}`}>{message || error}</div>}

      <section className="mx-auto grid max-w-[1440px] gap-md lg:grid-cols-[360px_1fr]">
        <aside className="h-fit rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md text-center shadow-sm">
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-primary-fixed bg-surface-container-low">
            <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-md font-headline-sm text-headline-sm text-on-surface">{profile.name || "Customer"}</h1>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{profile.email}</p>
          <div className="mt-md flex flex-col gap-sm">
            <label className="flex cursor-pointer items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md text-primary transition hover:bg-surface-container-low">
              <span className="material-symbols-outlined">photo_camera</span>
              Choose Image
              <input type="file" hidden onChange={handleFileChange} />
            </label>
            <button type="button" onClick={uploadImage} disabled={!file} className="rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">Upload Image</button>
          </div>
        </aside>

        <div className="space-y-md">
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-label-md text-label-md uppercase text-primary">Account</span>
                <h2 className="mt-xs font-headline-md text-headline-md text-on-surface">Profile Details</h2>
              </div>
              {!editMode ? (
                <button type="button" onClick={() => setEditMode(true)} className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">Edit Profile</button>
              ) : (
                <div className="flex gap-sm">
                  <button type="button" onClick={updateProfile} className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary">Save</button>
                  <button type="button" onClick={() => setEditMode(false)} className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-secondary">Cancel</button>
                </div>
              )}
            </div>
            <div className="grid gap-sm sm:grid-cols-2">
              <Input label="Name" name="name" value={profile.name} onChange={handleChange} disabled={!editMode} />
              <Input label="Email" value={profile.email} disabled />
              <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} disabled={!editMode} />
              <Input label="City" name="city" value={profile.city} onChange={handleChange} disabled={!editMode} />
              <Input label="Country" name="country" value={profile.country} onChange={handleChange} disabled={!editMode} />
              <Input label="Address" name="address" value={profile.address} onChange={handleChange} disabled={!editMode} />
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Change Password</h2>
            <div className="mt-md grid gap-sm sm:grid-cols-[1fr_1fr_auto]">
              <input type="password" placeholder="Old Password" value={passwordData.oldPassword} onChange={(event) => setPasswordData((prev) => ({ ...prev, oldPassword: event.target.value }))} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm font-body-md text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(event) => setPasswordData((prev) => ({ ...prev, newPassword: event.target.value }))} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm font-body-md text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              <button type="button" onClick={updatePassword} className="rounded-lg bg-gradient-to-b from-primary-container to-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm">Update</button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

const Input = ({ label, value, ...props }) => (
  <label className="grid gap-xs">
    <span className="font-label-sm text-label-sm uppercase text-secondary">{label}</span>
    <input {...props} value={value || ""} className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-sm font-body-md text-body-md text-on-surface outline-none transition disabled:bg-surface-container disabled:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary" />
  </label>
);

const Panel = ({ children }) => <div className="mx-auto max-w-[720px] rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center font-body-lg text-body-lg text-on-surface-variant shadow-sm">{children}</div>;

export default Profile;
