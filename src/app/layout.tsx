import type { Metadata } from "next";
import "./globals.css";
import "./styles/custom-tailwind.css";
import { Inter } from "next/font/google";
import BottomNav from "./components/BottomNav";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./providers";


export const metadata: Metadata = {
  title: "It's Giving",
  description: "A new way to give. Coming Soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans pb-20">
        <Providers>
          <AuthProvider>
            {children}
            <BottomNav />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}