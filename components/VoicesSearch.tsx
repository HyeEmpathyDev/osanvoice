"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function VoicesSearch({
  initial,
  dong,
  cat,
  sort,
}: {
  initial: string;
  dong?: string;
  cat?: string;
  sort: string;
}) {
  const [value, setValue] = useState(initial);
  const router = useRouter();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = value.trim();
    if (dong) params.set("dong", dong);
    if (cat) params.set("cat", cat);
    if (sort) params.set("sort", sort);
    if (trimmed) params.set("q", trimmed);
    const qs = params.toString();
    router.push(qs ? `/voices?${qs}` : "/voices");
  };

  return (
    <form onSubmit={submit} className="relative flex-1">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="의견 키워드 검색…"
        aria-label="의견 키워드 검색"
        className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-[#003b8e] focus:outline-none transition"
      />
    </form>
  );
}
