"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/store/cart/cart-provider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ThemeProvider>
          <div className="relative z-0">
            <NextTopLoader color={""} showSpinner={false} />
            {children}
            <Toaster
              toastOptions={{
                duration: 3000,
              }}
            />
            <Tooltip
              id="tooltip"
              className="z-[60] !opacity-100 max-w-sm shadow-lg"
            />
          </div>
        </ThemeProvider>
      </CartProvider>
    </SessionProvider>
  );
}
