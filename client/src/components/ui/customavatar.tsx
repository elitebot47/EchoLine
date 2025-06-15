"use client";
import clsx from "clsx";
import Image from "next/image";
import type { ClassNameValue } from "tailwind-merge";
export default function CustomAvatar({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: ClassNameValue;
}) {
  return (
    <Image
      className={clsx(`${className} rounded-full object-cover aspect-square`)}
      width={width}
      height={height}
      alt={alt}
      loading="lazy"
      src={src}
    />
  );
}
