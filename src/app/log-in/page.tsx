"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, don't stay on /log-in (prevents loops)
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (!res) return setError("Login failed.");

    if (res.error) {
      console.log("NextAuth signIn error:", res.error);
      return setError(res.error); // e.g. "CredentialsSignin"
    }

    setLoading(false);
   
    router.push(callbackUrl);
  };

  const handleGoogleLogin = async () => {
    // let NextAuth handle redirect for OAuth
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 text-slate-100">
      <div className="w-full max-w-md p-6 bg-slate-700 rounded-lg shadow-lg space-y-4">
        <h1 className="text-xl font-semibold text-center">Login</h1>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-white text-black rounded"
        >
          Continue with Google
        </button>

        <div className="text-center text-sm text-slate-300">or</div>

        <form onSubmit={handleCredentialsLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-600 text-slate-100"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-600 text-slate-100"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 rounded text-white disabled:bg-blue-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}