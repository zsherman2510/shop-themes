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
  List,
} from "lucide-react";
import { useState, useEffect } from "react";
import ButtonSignin from "@/components/buttons/ButtonSignin";
import ThemeToggle from "@/components/theme-toggle";

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
      title: "Categories",
      href: "/admin/categories",
      icon: List,
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
      <div className="flex items-center justify-between p-4 border-b border-base-200 text-base-content">
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
            className="p-2 rounded-lg hover:bg-base-200"
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
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="p-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 group ${
                  isActive
                    ? "bg-base-200 text-base-content"
                    : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
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

        {/* Footer with Theme Toggle and Sign In */}
        <div className="p-4 border-t border-base-200 space-y-2">
          <div
            className={`flex items-center justify-center ${!isCollapsed ? "mb-2" : ""}`}
          >
            <ThemeToggle />
          </div>
          <ButtonSignin
            extraStyle={`w-full justify-start ${isCollapsed ? "px-2" : "px-4"}`}
          />
        </div>
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
            className={`flex items-center justify-center w-12 h-24 bg-base-100 shadow-lg rounded-r-xl border border-l-0 border-base-200 transition-all duration-300 hover:w-14 group ${
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
          <nav className="relative w-64 h-full bg-base-100 shadow-xl">
            <NavContent />
          </nav>
        </div>
      </>
    );
  }
  return (
    <nav
      className={`h-screen overflow-y-auto transition-all duration-300 bg-base-100 border-r border-base-200 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <NavContent />
    </nav>
  );
};

export default AdminNav;
