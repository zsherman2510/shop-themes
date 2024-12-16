/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "lucide-react";

const ButtonSignin = ({
  text = "Sign in",
  extraStyle,
}: {
  text?: string;
  extraStyle?: string;
}) => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className={`btn btn-ghost ${extraStyle ? extraStyle : ""}`}
        >
          {session.user?.image ? (
            <img
              src={session.user?.image}
              alt={session.user?.name || "Account"}
              className="w-6 h-6 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
          <span className="hidden md:inline">
            {session.user?.name?.split(" ")[0] || "Account"}
          </span>
        </div>
        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <Link href="/account">My Account</Link>
          </li>
          <li>
            <Link href="/orders">Orders</Link>
          </li>
          <li>
            <button onClick={() => signOut()}>Sign out</button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <button
      className={`btn btn-ghost ${extraStyle ? extraStyle : ""}`}
      onClick={() => signIn()}
    >
      <User className="w-6 h-6" />
      <span className="hidden md:inline">{text}</span>
    </button>
  );
};

export default ButtonSignin;
