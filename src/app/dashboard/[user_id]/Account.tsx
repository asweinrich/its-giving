import React, { useState } from "react";

export default function Account() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setProfileImage(e.target.files[0]);
  };

  const handleSave = () => {
    // Logic to save updated user info
    console.log("Save user data:", { name, bio, profileImage });
  };

  return (
    <section className="p-6 bg-slate-700 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-slate-600 text-slate-100"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 rounded bg-slate-600 text-slate-100"
        />
        <input type="file" onChange={handleFileChange} className="w-full text-slate-300" />
        <button onClick={handleSave} className="py-2 px-4 bg-blue-600 rounded-lg text-white">
          Save Changes
        </button>
      </div>
    </section>
  );
}
