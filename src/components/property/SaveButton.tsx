"use client";

import { useState, useTransition } from "react";

interface SaveButtonProps {
  propertySlug: string;
  initialSaved?: boolean;
  className?: string;
}

export function SaveButton({ propertySlug, initialSaved = false, className = "" }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        const res = await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertySlug }),
        });

        if (res.ok) {
          const data = (await res.json()) as { saved: boolean };
          setSaved(data.saved);
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`group rounded-full p-2 transition ${
        saved
          ? "bg-red-100 text-red-500 hover:bg-red-200"
          : "bg-white/90 text-slate-400 hover:bg-white hover:text-red-500"
      } ${isPending ? "opacity-50" : ""} ${className}`}
      aria-label={saved ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className="h-5 w-5"
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={saved ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
