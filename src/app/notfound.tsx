import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-base-content">404</h1>
          <p className="py-6 text-base-content/70">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
