"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview, getProductReviews } from "@/app/_actions/store/reviews";
import { useEffect } from "react";
import { ReviewWithCustomer } from "@/app/_actions/store/reviews";
import { toast } from "react-hot-toast";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getProductReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error("Error loading reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      });

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");

      // Refresh reviews
      const updatedReviews = await getProductReviews(productId);
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
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

      {/* Review Form */}
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium">
              Review (optional)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your review here..."
            />
          </div>

          <Button type="submit" disabled={!session}>
            Submit Review
          </Button>

          {!session && (
            <p className="text-sm text-gray-500">
              Please sign in to leave a review
            </p>
          )}
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        {isLoading ? (
          <div className="animate-pulse">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
