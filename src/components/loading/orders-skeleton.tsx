"use client";

export function OrdersLoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((j) => (
              <div
                key={j}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
