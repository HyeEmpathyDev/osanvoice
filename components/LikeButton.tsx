"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { likeVoice, unlikeVoice } from "@/app/voices/actions";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "osanvoice_likes";

function getLiked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveLiked(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function LikeButton({
  voiceId,
  initialCount,
}: {
  voiceId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLiked(getLiked().has(voiceId));
  }, [voiceId]);

  const onClick = () => {
    if (pending) return;
    const set = getLiked();

    if (liked) {
      // 취소
      setCount((c) => Math.max(0, c - 1));
      setLiked(false);
      set.delete(voiceId);
      saveLiked(set);

      startTransition(async () => {
        const res = await unlikeVoice(voiceId);
        if (res.ok) {
          setCount(res.count);
        } else {
          // 실패 시 롤백
          setCount((c) => c + 1);
          setLiked(true);
          const s = getLiked();
          s.add(voiceId);
          saveLiked(s);
        }
      });
    } else {
      // 공감
      setCount((c) => c + 1);
      setLiked(true);
      set.add(voiceId);
      saveLiked(set);

      startTransition(async () => {
        const res = await likeVoice(voiceId);
        if (res.ok) {
          setCount(res.count);
        } else {
          setCount((c) => Math.max(0, c - 1));
          setLiked(false);
          const s = getLiked();
          s.delete(voiceId);
          saveLiked(s);
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={liked ? "공감 취소" : "공감하기"}
      aria-pressed={liked}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 border-2 transition disabled:opacity-60",
        liked
          ? "border-[#e4405f] bg-[#e4405f] text-white"
          : "border-gray-200 text-gray-600 hover:border-[#e4405f] hover:text-[#e4405f]"
      )}
    >
      <Heart
        size={13}
        fill={liked ? "currentColor" : "none"}
        className={pending ? "animate-pulse" : ""}
      />
      <span className="tabular">{count}</span>
    </button>
  );
}
