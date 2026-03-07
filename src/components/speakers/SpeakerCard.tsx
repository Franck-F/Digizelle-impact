"use client";

import Image from "next/image";
import Link from "next/link";
import { Speaker } from "@/lib/types";

interface SpeakerCardProps {
  speaker: Speaker;
  featured?: boolean;
  compact?: boolean;
}

export function SpeakerCard({ speaker, featured = false, compact = false }: SpeakerCardProps) {
  return (
    <Link
      href={`/speakers/${speaker.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-sm bg-surface transition-all duration-300 hover:shadow-xl ${
        compact ? "w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[280px]" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-cream-dark ${
          compact ? "aspect-[4/5]" : "aspect-[3/4]"
        }`}
      >
        {speaker.image !== "/images/speakers/placeholder.jpg" ? (
          <Image
            src={speaker.image}
            alt={speaker.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image
              src="/images/mascotte/mascotte2.png"
              alt="Coming soon"
              width={featured ? 140 : 120}
              height={featured ? 140 : 120}
              className="opacity-50"
            />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Company badge */}
        <div
          className={`absolute right-2 top-2 rounded-sm bg-purple/90 font-medium text-white ${
            compact
              ? "px-2 py-0.5 text-[9px] sm:px-2.5 sm:text-[10px]"
              : "px-2 py-0.5 text-[9px] sm:px-2 sm:text-[10px]"
          }`}
        >
          {speaker.company}
        </div>
      </div>

      {/* Info */}
      <div className={`flex flex-grow flex-col ${compact ? "p-3.5 sm:p-4" : "p-3 sm:p-4"}`}>
        <h3
          className={`font-serif font-semibold text-heading transition-colors group-hover:text-purple ${
            compact ? "text-[17px] sm:text-lg" : "text-base sm:text-lg"
          }`}
        >
          {speaker.name}
        </h3>
        <p className={compact ? "mt-1 text-xs text-body sm:text-sm" : "mt-1 text-[11px] text-body sm:text-xs"}>
          {speaker.title}
        </p>
        {speaker.topic && (
          <p
            className={`font-medium uppercase tracking-wider text-purple ${
              compact ? "mt-2 text-[10px] sm:text-[11px]" : "mt-2 text-[9px] sm:mt-2 sm:text-[10px]"
            }`}
          >
            {speaker.topic}
          </p>
        )}
      </div>
    </Link>
  );
}
