import type { Metadata } from "next";
import "./globals.css";
import './styles/custom-tailwind.css'; /* Import custom utilities */
import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider




// Import multiple font weights here
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Add only the weights you want
  variable: '--font-inter',
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

      <body
        className={inter.variable+' font-sans'}
      >
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
