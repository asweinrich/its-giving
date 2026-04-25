import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-800 text-slate-100" />}>
      <LoginClient />
    </Suspense>
  );
}