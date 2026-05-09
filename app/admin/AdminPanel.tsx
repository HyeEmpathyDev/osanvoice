"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { toggleVisibility, deleteVoice, reassignDong } from "./actions";
import { DONGS, CATEGORIES } from "@/lib/constants";

interface Voice {
  id: string;
  created_at: string;
  dong: string;
  legal_dong: string | null;
  category: string;
  content: string;
  age_group: string | null;
  gender: string | null;
  ip: string | null;
  is_visible: boolean;
}

const dongMap = Object.fromEntries(DONGS.map((d) => [d.id, d.name]));
const catMap = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, { name: c.name, emoji: c.emoji }])
);

export function AdminPanel({ voices }: { voices: Voice[] }) {
  const [pending, startTransition] = useTransition();

  // 어뷰즈 검증: IP별, 내용별 카운트 사전 계산
  const ipCounts = new Map<string, number>();
  const contentCounts = new Map<string, number>();
  voices.forEach((v) => {
    if (v.ip) ipCounts.set(v.ip, (ipCounts.get(v.ip) ?? 0) + 1);
    const key = v.content.replace(/\s+/g, "");
    contentCounts.set(key, (contentCounts.get(key) ?? 0) + 1);
  });

  function onToggle(id: string, currentVisible: boolean) {
    const fd = new FormData();
    fd.append("id", id);
    fd.append("next", String(!currentVisible));
    startTransition(async () => {
      await toggleVisibility(fd);
    });
  }

  function onDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    const fd = new FormData();
    fd.append("id", id);
    startTransition(async () => {
      await deleteVoice(fd);
    });
  }

  function onReassign(id: string, newDong: string) {
    const fd = new FormData();
    fd.append("id", id);
    fd.append("dong", newDong);
    startTransition(async () => {
      await reassignDong(fd);
    });
  }

  if (voices.length === 0) {
    return (
      <div className="text-center text-gray-500 py-20 border-2 border-dashed border-gray-200 rounded-xl">
        의견이 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {voices.map((v) => {
        const cat = catMap[v.category];
        const sameIpCount = v.ip ? (ipCounts.get(v.ip) ?? 0) : 0;
        const sameContentCount =
          contentCounts.get(v.content.replace(/\s+/g, "")) ?? 0;
        return (
          <li
            key={v.id}
            className={`border-2 rounded-xl p-5 transition ${
              v.is_visible
                ? "bg-white border-gray-200"
                : "bg-gray-50 border-gray-300 opacity-70"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-bold">
              {v.legal_dong && (
                <span className="bg-gray-800 text-white px-2.5 py-1 rounded-full">
                  📍 {v.legal_dong}
                </span>
              )}
              <span className="bg-[#003b8e] text-white px-2.5 py-1 rounded-full">
                {dongMap[v.dong] ?? v.dong}
              </span>
              <span className="bg-[#ffd54a] text-[#0a0e1a] px-2.5 py-1 rounded-full">
                {cat?.emoji} {cat?.name ?? v.category}
              </span>
              {v.age_group && (
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {v.age_group}
                  {v.gender === "m" ? " 남" : v.gender === "f" ? " 여" : ""}
                </span>
              )}
              {!v.is_visible && (
                <span className="bg-red-500 text-white px-2.5 py-1 rounded-full">
                  비공개
                </span>
              )}
              <span className="ml-auto text-gray-400 font-normal">
                {new Date(v.created_at).toLocaleString("ko-KR")}
              </span>
            </div>
            {/* 어뷰즈 검증 정보 — admin 전용 */}
            {(v.ip || sameContentCount > 1) && (
              <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px]">
                {v.ip && (
                  <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    IP {v.ip}
                  </span>
                )}
                {sameIpCount > 1 && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">
                    🔁 같은 IP {sameIpCount}건
                  </span>
                )}
                {sameContentCount > 1 && (
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                    ⚠️ 같은 내용 {sameContentCount}건
                  </span>
                )}
              </div>
            )}
            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap mb-4">
              {v.content}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => onToggle(v.id, v.is_visible)}
                disabled={pending}
                className="text-xs font-bold px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-[#003b8e] hover:text-[#003b8e] transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {v.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}
                {v.is_visible ? "숨김" : "공개"}
              </button>
              <button
                onClick={() => onDelete(v.id)}
                disabled={pending}
                className="text-xs font-bold px-3 py-2 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 size={14} />
                삭제
              </button>
              <label className="text-xs font-bold flex items-center gap-1.5 ml-auto">
                <span className="text-gray-500">행정동 변경:</span>
                <select
                  value={v.dong}
                  disabled={pending}
                  onChange={(e) => onReassign(v.id, e.target.value)}
                  className="text-xs font-bold border-2 border-gray-200 rounded-lg px-2 py-1.5 hover:border-[#003b8e] focus:border-[#003b8e] outline-none disabled:opacity-50"
                >
                  {DONGS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <code className="text-[10px] text-gray-400">
                {v.id.slice(0, 8)}…
              </code>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
