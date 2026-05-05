"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DONGS, CATEGORIES, AGE_GROUPS } from "@/lib/constants";
import { submitVoice } from "../actions";

export default function VoiceForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitVoice(formData);
      if (result.ok) {
        router.push(`/voices?submitted=1`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 행정동 */}
      <div>
        <label className="block text-sm font-bold text-[#0f1a2e] mb-2">
          어느 동에 사시나요? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DONGS.map((d) => (
            <label
              key={d.id}
              className="cursor-pointer text-center border-2 border-gray-200 rounded-lg py-3 text-sm font-bold has-[:checked]:bg-[#003b8e] has-[:checked]:text-white has-[:checked]:border-[#003b8e] hover:border-[#003b8e] transition"
            >
              <input
                type="radio"
                name="dong"
                value={d.id}
                required
                className="sr-only"
              />
              {d.name}
            </label>
          ))}
        </div>
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-sm font-bold text-[#0f1a2e] mb-2">
          어떤 분야 의견인가요? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.key}
              className="cursor-pointer text-center border-2 border-gray-200 rounded-lg py-3 px-1 text-xs font-bold has-[:checked]:bg-[#003b8e] has-[:checked]:text-white has-[:checked]:border-[#003b8e] hover:border-[#003b8e] transition"
            >
              <input
                type="radio"
                name="category"
                value={c.key}
                required
                className="sr-only"
              />
              <div className="text-xl mb-1">{c.emoji}</div>
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {/* 의견 */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-bold text-[#0f1a2e] mb-2"
        >
          의견 <span className="text-red-500">*</span>
          <span className="ml-2 text-xs font-normal text-gray-500">
            ({content.length}/500자)
          </span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={5}
          maxLength={500}
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="우리 동네에서 느낀 이야기, 정책 제안을 자유롭게 적어주세요. (5자 이상 500자 이내)"
          className="w-full border-2 border-gray-200 rounded-lg p-4 text-base focus:border-[#003b8e] outline-none resize-none"
        />
      </div>

      {/* 인구통계 (선택) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[#0f1a2e] mb-2">
            연령대 <span className="text-xs font-normal text-gray-500">(선택)</span>
          </label>
          <select
            name="age_group"
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-[#003b8e] outline-none bg-white"
          >
            <option value="">선택 안 함</option>
            {AGE_GROUPS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0f1a2e] mb-2">
            성별 <span className="text-xs font-normal text-gray-500">(선택)</span>
          </label>
          <select
            name="gender"
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-[#003b8e] outline-none bg-white"
          >
            <option value="">선택 안 함</option>
            <option value="m">남성</option>
            <option value="f">여성</option>
          </select>
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 안내 */}
      <div className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-4">
        제출하신 의견은 익명으로 처리되며, 정책 검토 자료로만 활용됩니다.
        부적절한 내용은 운영진 검토 후 비공개 처리될 수 있습니다.
      </div>

      {/* 제출 */}
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-lg text-center hover:bg-gray-50 transition"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex-[2] bg-[#003b8e] text-white font-black py-4 rounded-lg hover:bg-[#1a2654] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {pending ? "제출 중..." : "의견 제출하기"}
        </button>
      </div>
    </form>
  );
}
