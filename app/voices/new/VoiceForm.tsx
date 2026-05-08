"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LEGAL_DONGS, CATEGORIES, AGE_GROUPS } from "@/lib/constants";
import { submitVoice } from "../actions";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: { sitekey: string; callback?: (token: string) => void; theme?: string }
      ) => string;
      reset: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export default function VoiceForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [formStart] = useState(() => Date.now());
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Turnstile 위젯 렌더 (사이트 키 설정 시만)
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "light",
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("__formStart", String(formStart));
    startTransition(async () => {
      const result = await submitVoice(formData);
      if (result.ok) {
        router.push(`/voices?submitted=1`);
      } else {
        setError(result.error);
        // Turnstile 토큰은 1회용이라 reset
        window.turnstile?.reset();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot — 봇 방어 (사람에겐 안 보임) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0 pointer-events-none"
      />

      {/* 법정동 — 24개 중 본인이 사는 동네 선택. 서버에서 행정동으로 자동 매핑 */}
      <div>
        <label className="block text-sm font-bold text-[#0f1a2e] mb-2">
          어느 동에 사시나요? <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          본인이 사는 법정동(동네 이름)을 선택해주세요.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {LEGAL_DONGS.map((d) => (
            <label
              key={d.name}
              className="cursor-pointer text-center border-2 border-gray-200 rounded-lg py-3 text-sm font-bold has-[:checked]:bg-[#003b8e] has-[:checked]:text-white has-[:checked]:border-[#003b8e] hover:border-[#003b8e] transition"
            >
              <input
                type="radio"
                name="legal_dong"
                value={d.name}
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

      {/* Turnstile 위젯 (키 설정 시만 표시됨) */}
      {TURNSTILE_SITE_KEY && (
        <div ref={turnstileRef} className="flex justify-center" />
      )}

      {/* 안내 */}
      <div className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-4">
        <b className="text-[#003b8e]">운영진 검토 후 공개됩니다.</b> 제출하신 의견은
        익명으로 처리되며, 정책 검토 자료로만 활용됩니다. 부적절한 내용은
        비공개로 유지될 수 있습니다.
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
