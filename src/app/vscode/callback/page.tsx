"use client";
import "client-only";

import { AppSession } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { liligptBackendClient } from "@/lib/liligptBackendClient";
import { redirect } from "next/navigation";
import { redirectTo } from "@/lib/utils";
import { useEffect, useState } from "react";

function getNonce() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem("vscode-nonce");
}

export default function VSCodeCallback() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // if user is not logged in, show error
    if (!session) {
      setMessage("Invalid authentication session");
      return;
    }
    // get tokens from session
    const { accessToken, refreshToken } = session as AppSession;
    if (!accessToken || !refreshToken) {
      setMessage("Invalid authentication tokens");
      return;
    }
    // get nonce
    const nonce = getNonce();
    if (!nonce) {
      setMessage("Invalid authentication code");
      return;
    }
    // send auth to vscode
    liligptBackendClient
      .sendAuthToVscode({
        nonce,
        accessToken,
        refreshToken,
      })
      .then((res) => {
        setMessage("Success!");
        redirectTo("/vscode/success");
      })
      .catch((err) => {
        setMessage("Error: " + err.message);
      });
  }, [session]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          Welcome to Liligpt!
        </h1>
        <p className="text-xl font-medium text-gray-600 mb-8">{message}</p>
      </div>
    </div>
  );
}
