"use client";

import Link from "next/link";
import Image from "next/image";

interface BannerProps {
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  overlayColor?: string;
  textColor?: string;
  height?: string;
}

export default function Banner({
  title,
  description,
  image,
  ctaText,
  ctaLink,
  overlayColor = "rgba(0,0,0,0.4)",
  textColor = "#ffffff",
  height = "400px",
}: BannerProps) {
  const content = (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height }}
    >
      <div className="absolute inset-0">
        <Image src={image} alt={title} fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      </div>

      <div
        className="relative text-center px-4 max-w-3xl"
        style={{ color: textColor }}
      >
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-8">{description}</p>
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );

  if (ctaLink && !ctaText) {
    return (
      <Link href={ctaLink} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
