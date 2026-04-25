import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/utils/authOptions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email?.toLowerCase();
  if (!session || email !== "asweinrich@gmail.com") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}