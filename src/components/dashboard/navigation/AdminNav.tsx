"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  Users,
  Box,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: Box },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Pages", href: "/dashboard/pages", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Users", href: "/dashboard/users", icon: Users },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="fixed flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"
        >
          <ShoppingBag className="h-6 w-6" />
          <span>Store Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
