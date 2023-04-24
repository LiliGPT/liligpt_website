import { getCurrentUser, getSession } from "@/lib/session";
import { useSession } from "next-auth/react";
import Link from "next/link";
// "use client";

export default async function PrivatePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div>
        <h1>This is a private page</h1>
        <p>
          Please <Link href="/api/auth/signin">sign in</Link>.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>User: {JSON.stringify(user)}</p>
    </div>
  );
}
