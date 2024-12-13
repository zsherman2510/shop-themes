import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800 dark:bg-gray-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              MODERN STORE
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-8">
            <Link
              href="/categories"
              className="text-sm hover:text-gray-600 dark:hover:text-gray-300"
            >
              Categories
            </Link>
            <Link
              href="/new-arrivals"
              className="text-sm hover:text-gray-600 dark:hover:text-gray-300"
            >
              New Arrivals
            </Link>
            <Link
              href="/sale"
              className="text-sm hover:text-gray-600 dark:hover:text-gray-300"
            >
              Sale
            </Link>
            <Link
              href="/login"
              className="text-sm hover:text-gray-600 dark:hover:text-gray-300"
            >
              Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
