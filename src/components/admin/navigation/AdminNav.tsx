"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";

const AdminNav = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsCollapsed(window.innerWidth < 1280);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      title: "Pages",
      href: "/admin/pages",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <Link
          href="/admin"
          className={`font-bold transition-all duration-300 ${
            isCollapsed ? "text-xl" : "text-xl"
          }`}
        >
          {isCollapsed ? "SA" : "Store Admin"}
        </Link>
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight
              size={20}
              className={`transform transition-transform duration-300 ${
                isCollapsed ? "" : "rotate-180"
              }`}
            />
          </button>
        )}
      </div>
      <div className="p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 group ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive ? "shrink-0" : "shrink-0 group-hover:scale-110"
                }
              />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Navigation Button */}
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center w-12 h-24 bg-white dark:bg-gray-900 shadow-lg rounded-r-xl border border-l-0 border-gray-200 dark:border-gray-800 transition-all duration-300 hover:w-14 group ${
              isOpen ? "translate-x-64" : "translate-x-0"
            }`}
          >
            {isOpen ? (
              <X
                size={24}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <Menu
                size={24}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 z-40 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsOpen(false)}
          />

          {/* Navigation Content */}
          <nav className="relative w-64 h-full bg-white dark:bg-gray-900 shadow-xl">
            <NavContent />
          </nav>
        </div>
      </>
    );
  }
  return (
    <nav
      className={`sticky top-0 h-screen transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <NavContent />
    </nav>
  );
};

export default AdminNav;
