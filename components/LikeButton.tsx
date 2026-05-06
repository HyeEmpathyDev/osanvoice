"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { likeVoice } from "@/app/voices/actions";
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

function setLiked(set: Set<string>) {
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
  const [liked, setLikedState] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLikedState(getLiked().has(voiceId));
  }, [voiceId]);

  const onClick = () => {
    if (liked || pending) return;
    const set = getLiked();
    if (set.has(voiceId)) {
      setLikedState(true);
      return;
    }
    // Optimistic
    setCount((c) => c + 1);
    setLikedState(true);
    set.add(voiceId);
    setLiked(set);

    startTransition(async () => {
      const res = await likeVoice(voiceId);
      if (res.ok) {
        setCount(res.count);
      } else {
        // Revert on failure
        setCount((c) => Math.max(0, c - 1));
        setLikedState(false);
        const s = getLiked();
        s.delete(voiceId);
        setLiked(s);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={liked || pending}
      aria-label={liked ? "공감함" : "공감하기"}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 border-2 transition",
        liked
          ? "border-[#e4405f] bg-[#e4405f] text-white"
          : "border-gray-200 text-gray-600 hover:border-[#e4405f] hover:text-[#e4405f]"
      )}
    >
      <Heart size={13} fill={liked ? "currentColor" : "none"} />
      <span className="tabular">{count}</span>
    </button>
  );
}
