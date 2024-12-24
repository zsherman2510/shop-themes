"use client";

export default function Newsletter() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card bg-base-100 px-6 py-16 sm:p-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
              Stay Updated with New Releases
            </h2>
            <p className="mt-4 text-lg text-base-content/70">
              Subscribe to our newsletter to get notified about new themes, UI
              kits, and digital assets.
            </p>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered flex-1"
                required
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
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
