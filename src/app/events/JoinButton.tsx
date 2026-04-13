"use client";

import { useTransition, useState } from "react";
import { joinEvent } from "./actions";

type Props = {
  eventId: string;
  full: boolean;
  hasJoined: boolean;
};

export default function JoinButton({ eventId, full, hasJoined }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(hasJoined);

  if (full && !joined) {
    return (
      <button
        disabled
        className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
      >
        満員
      </button>
    );
  }

  if (joined) {
    return (
      <span className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
        参加済み ✓
      </span>
    );
  }

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await joinEvent(eventId);
      if (result?.error) {
        setError(result.error);
      } else {
        setJoined(true);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handleClick}
        disabled={pending}
        className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-700 hover:to-sky-600 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "処理中..." : "参加する"}
      </button>
    </div>
  );
}
