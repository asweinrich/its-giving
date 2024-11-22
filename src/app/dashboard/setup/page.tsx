"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface PhaseOneProps {
  formData: { name: string; username: string }; // Adjust based on your actual form data structure
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkUsername: (username: string) => Promise<void>; // Assuming it's an async function
  usernameAvailable: boolean;
  setPhase: (phase: number) => void; // Assuming `setPhase` accepts a phase number
}

interface PhaseTwoProps {
  formData: {
    bio?: string;
    phone?: string;
    image?: string; // Add more fields if necessary
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: () => Promise<void>; // Assuming this is an async function
  loading: boolean;
}

// Phase 1: Name and Username Entry with Availability Check
function PhaseOne({
  formData,
  handleChange,
  checkUsername,
  usernameAvailable,
  setPhase,
}: PhaseOneProps) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-2 rounded bg-slate-600 text-slate-100"
        required
      />
      <div className="relative">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={(e) => {
            handleChange(e);
            checkUsername(e.target.value);
          }}
          placeholder="Username"
          className="w-full p-2 rounded bg-slate-600 text-slate-100"
          required
        />
        {usernameAvailable ? (
          <CheckCircleIcon className="stroke-2 w-5 h-5 absolute right-2 top-2 text-green-500" />
        ) : (
          <XCircleIcon className="w-5 h-5 absolute right-2 top-2 text-red-500" />
        )}
      </div>
      <button
        onClick={() => setPhase(2)}
        disabled={!formData.name || !formData.username || !usernameAvailable}
        className="w-full py-2 bg-blue-600 rounded text-white disabled:bg-blue-400"
      >
        Next
      </button>
    </div>
  );
}

// Phase 2: Optional Profile Info (Image, Bio, Phone)
function PhaseTwo({
  formData,
  handleChange,
  handleSubmit,
  loading,
}: PhaseTwoProps) {
  return (
    <div className="space-y-4">
      <input
        type="file"
        name="imageUrl"
        onChange={(e) => handleChange({ target: { name: "imageUrl", value: e.target.files[0] } })}
        className="w-full p-2 bg-slate-600 text-slate-100 rounded"
      />
      <textarea
        name="bio"
        value={formData.bio || ""}
        onChange={handleChange}
        placeholder="Bio"
        className="w-full p-2 rounded bg-slate-600 text-slate-100"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone || ""}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-2 rounded bg-slate-600 text-slate-100"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2 bg-blue-600 rounded text-white disabled:bg-blue-400"
      >
        {loading ? "Submitting..." : "Finish"}
      </button>
    </div>
  );
}

// Main SetupPage Component
export default function SetupPage() {
  const router = useRouter();
  const { user_id } = useParams();
  console.log(user_id)

  // State to track form data and progress
  const [phase, setPhase] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    imageUrl: null,
    bio: "",
    phone: "",
  });
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle input change and update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Check if the username is available (mockup; replace with actual DB check)
  const checkUsername = async (username) => {
    setLoading(true);
    const response = await fetch(`/api/users/check-username?username=${username}`);
    const data = await response.json();
    setUsernameAvailable(data.available);
    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    // Send data to the server to save user details
    await fetch("/api/users/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, user_id }),
    });
    setLoading(false);
    // Redirect to user dashboard after completion
    router.push(`/dashboard/${user_id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 text-slate-100 px-4">
      <div className="w-full max-w-md p-6 bg-slate-700 rounded-lg shadow-lg space-y-6">
        <h1 className="text-xl font-semibold text-center">User Setup</h1>
        {phase === 1 && (
          <PhaseOne
            formData={formData}
            handleChange={handleChange}
            checkUsername={checkUsername}
            usernameAvailable={usernameAvailable}
            setPhase={setPhase}
          />
        )}
        {phase === 2 && (
          <PhaseTwo
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
