"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/_actions/store/newsletter";
import { toast } from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await subscribeToNewsletter({ email });
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to subscribe to newsletter");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card bg-base-100 px-6 py-16 sm:p-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
              Stay Updated with New Releases
            </h2>

            <p className="mx-auto mt-4 max-w-sm text-base-content/60">
              Subscribe to our newsletter to get updates on new themes,
              features, and web development tips.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>

            <p className="mt-4 text-sm text-base-content/60">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
