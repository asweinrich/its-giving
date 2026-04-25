"use client";

import { useEffect } from "react";

export type ToastVariant = "success" | "error" | "info";

export default function Toast({
  message,
  variant = "success",
  onClose,
  durationMs = 2500,
}: {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [onClose, durationMs]);

  const styles =
    variant === "success"
      ? "bg-green-700/80 border-green-500 text-green-50"
      : variant === "error"
      ? "bg-red-700/80 border-red-500 text-red-50"
      : "bg-slate-700/80 border-slate-500 text-slate-50";

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`backdrop-blur rounded-lg border px-4 py-3 shadow-lg ${styles}`}>
        <div className="flex items-start gap-3">
          <div className="text-sm">{message}</div>
          <button
            onClick={onClose}
            className="text-sm opacity-80 hover:opacity-100"
            aria-label="Close toast"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}