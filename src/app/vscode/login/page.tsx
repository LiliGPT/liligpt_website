import Image from "next/image";
import { Inter } from "next/font/google";
import { signIn } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function VSCodeLogin() {
  function onSignIn() {
    signIn("keycloak");
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <p className="text-4xl font-bold">VSCode Login</p>
          <button
            onClick={onSignIn}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login with Keycloak
          </button>
        </div>
      </div>
    </main>
  );
}
