"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("email", { email, callbackUrl });
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full mx-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Logo and Header */}
            <div className="flex flex-col items-center gap-4 mb-4">
              {/* <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="rounded-xl"
              /> */}
              <h1 className="text-2xl font-bold text-center text-black">
                Welcome Back
              </h1>
              <p className="text-center text-base-content/60">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error mb-4 text-black">
                {error === "OAuthSignin" && "Error signing in with OAuth"}
                {error === "OAuthCallback" && "Error during OAuth callback"}
                {error === "OAuthCreateAccount" &&
                  "Error creating OAuth account"}
                {error === "EmailCreateAccount" &&
                  "Error creating email account"}
                {error === "Callback" && "Error during callback"}
                {error === "Default" && "Unable to sign in"}
                {error === "EmailSignin" && "Invalid email or password"}
              </div>
            )}

            {/* Sign In Methods */}
            <div className="flex flex-col gap-4">
              {/* Google Sign In */}
              <button
                onClick={() => signIn("google", { callbackUrl })}
                className="btn btn-outline gap-2 hover:bg-base-200"
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>

              <div className="divider">OR</div>

              {/* Email Sign In */}
              {emailSent ? (
                <div className="alert alert-success">
                  Check your email for a sign in link!
                </div>
              ) : (
                <form
                  onSubmit={handleEmailSignIn}
                  className="flex flex-col gap-4"
                >
                  <div className="form-control">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-outline gap-2 w-full"
                  >
                    <MdEmail className="w-5 h-5" />
                    Continue with Email
                  </button>
                </form>
              )}
            </div>

            {/* Terms and Privacy */}
            <p className="text-center text-sm mt-6 text-base-content/60">
              By continuing, you agree to our{" "}
              <a href="/terms" className="link link-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="link link-primary">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
