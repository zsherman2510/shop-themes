"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  getProductReviews,
  ReviewWithCustomer,
} from "@/app/_actions/store/reviews";

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Listen for new reviews
    const handleReviewSubmitted = () => {
      fetchReviews();
    };
    window.addEventListener("reviewSubmitted", handleReviewSubmitted);
    return () => {
      window.removeEventListener("reviewSubmitted", handleReviewSubmitted);
    };
  }, [productId]);

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet</p>;
  }

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-5 w-5 ${
                value <= averageRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-medium">
          {averageRating.toFixed(1)} out of 5
        </span>
        <span className="text-gray-500">
          ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
        </span>
      </div>

      <div className="divide-y">
        {reviews.map((review) => (
          <div key={review.id} className="py-4">
            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-4 w-4 ${
                      value <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {review.customer
                  ? `${review.customer.firstName} ${review.customer.lastName}`
                  : "Anonymous"}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            {review.comment && (
              <p className="mt-2 text-gray-700">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
