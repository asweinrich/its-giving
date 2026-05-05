import type { Metadata } from "next";
import "./globals.css";
import "./styles/custom-tailwind.css";
import { Inter } from "next/font/google";
import BottomNav from "./components/BottomNav";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

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
      <body className={inter.variable + " font-sans pb-20"}>
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