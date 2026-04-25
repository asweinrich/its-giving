import AddOrgForm from "./AddOrgForm";

export default function AddOrgPage() {
  // Access control is enforced by /dashboard/admin/layout.tsx
  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">Add Organization</h1>
        <p className="text-slate-300 mb-6">
          Create a new organization record (admin-only).
        </p>
        <AddOrgForm />
      </div>
    </div>
  );
}