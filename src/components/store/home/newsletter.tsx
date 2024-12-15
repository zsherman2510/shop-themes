"use client";

import { useState } from "react";

export default function Newsletter() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white px-6 py-16 sm:p-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Stay Updated with New Releases
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Subscribe to our newsletter to get notified about new themes, UI
              kits, and digital assets.
            </p>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-gray-200 px-6 py-3 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
