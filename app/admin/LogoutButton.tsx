"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "./actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={pending}
      className="text-sm font-bold px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#003b8e] hover:text-[#003b8e] transition flex items-center gap-1.5 disabled:opacity-50"
    >
      <LogOut size={14} />
      로그아웃
    </button>
  );
}
