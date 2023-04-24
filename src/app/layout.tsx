import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Inter } from "next/font/google";
import AuthContext from "./auth/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
