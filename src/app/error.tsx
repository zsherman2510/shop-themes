"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-base-content">Oops!</h1>
          <p className="py-6 text-base-content/70">
            Something went wrong! Don&apos;t worry, this is just a temporary
            setback.
          </p>
          <div className="space-x-4">
            <button onClick={() => reset()} className="btn btn-primary">
              Try again
            </button>
            <a href="/" className="btn btn-ghost">
              Return Home
            </a>
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-error/10 rounded-box text-left">
              <p className="text-error font-mono text-sm">{error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
