export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content w-full max-w-md">{children}</div>
    </div>
  );
}
