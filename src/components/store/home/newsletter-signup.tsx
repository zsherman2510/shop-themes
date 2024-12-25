"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/app/_actions/store/newsletter";
import { toast } from "react-hot-toast";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="bg-muted py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Subscribe to our newsletter
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get the latest updates on new themes, features, and web development
            tips.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 sm:mx-auto sm:max-w-xl">
          <div className="flex gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            By subscribing, you agree to receive marketing emails. You can
            unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
}
