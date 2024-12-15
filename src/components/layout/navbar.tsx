import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

interface NavbarProps {
  isAdminUser?: boolean;
}

const Navbar = ({ isAdminUser }: NavbarProps) => {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md fixed top-0 z-50 border-b border-base-200 text-base-content">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link
                href="/store/categories"
                className="text-base-content/70 hover:text-base-content"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/store/new-arrivals"
                className="text-base-content/70 hover:text-base-content"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/store/sale"
                className="text-base-content/70 hover:text-base-content"
              >
                Sale
              </Link>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="btn btn-ghost text-xl font-bold text-base-content"
        >
          MODERN STORE
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href="/store/categories"
              className="text-base-content/70 hover:text-base-content"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href="/store/new-arrivals"
              className="text-base-content/70 hover:text-base-content"
            >
              New Arrivals
            </Link>
          </li>
          <li>
            <Link
              href="/store/sale"
              className="text-base-content/70 hover:text-base-content"
            >
              Sale
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggle />
        <Link
          href="/login"
          className="btn btn-ghost text-base-content/70 hover:text-base-content"
        >
          Account
        </Link>
        {isAdminUser && (
          <Link href="/admin/dashboard" className="btn btn-primary">
            Admin
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
