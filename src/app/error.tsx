"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-serif text-[#b59a5c] mb-4">Oops!</h1>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-[#1a1a1a] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#b59a5c] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
