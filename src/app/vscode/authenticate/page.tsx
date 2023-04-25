"use client";

// import { redirect } from "next/navigation";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { AppJWT, AppSession } from "@/lib/auth";
import React, { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function VSCodeAuthenticate() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // get nonce from querystring
    const nonce = searchParams.get("nonce") || "";
    if (!nonce) {
      setMessage("Invalid authentication code");
      return;
    }

    // save nonce in localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vscode-nonce", nonce);
    }

    // if user is already logged in, redirect to callback page
    if (session) {
      const { accessToken, refreshToken } = session as AppSession;
      if (accessToken && refreshToken) {
        redirect("/vscode/callback");
        return;
      }
    }

    // if user is not logged in, redirect to login page
    signIn("keycloak", {
      callbackUrl: "/vscode/callback",
    });
  }, [searchParams, session]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <Image
          src="/logo.svg"
          alt="Liligpt Logo"
          width={200}
          height={200}
          className="mb-8"
        />
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          Welcome to Liligpt!
        </h1>
        <p className="text-xl font-medium text-gray-600 mb-8">{message}</p>
      </div>
    </div>
  );

  // get tokens from session
  // const { accessToken, refreshToken } = session as AppSession;
  // TODO: send tokens and nonce to backend
}
