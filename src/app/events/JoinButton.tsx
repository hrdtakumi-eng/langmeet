"use client";

import { useTransition, useState } from "react";
import { joinEvent } from "./actions";

type Props = {
  eventId: string;
  full: boolean;
};

export default function JoinButton({ eventId, full }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  if (full) {
    return (
      <button
        disabled
        className="shrink-0 px-5 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
      >
        満員
      </button>
    );
  }

  if (joined) {
    return (
      <span className="shrink-0 px-5 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-700">
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
        className="shrink-0 px-5 py-2 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "処理中..." : "参加する"}
      </button>
    </div>
  );
}
