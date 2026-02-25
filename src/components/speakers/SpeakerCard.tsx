"use client";

import Image from "next/image";
import Link from "next/link";
import { Speaker } from "@/lib/types";

interface SpeakerCardProps {
  speaker: Speaker;
  featured?: boolean;
}

export function SpeakerCard({ speaker, featured = false }: SpeakerCardProps) {
  return (
    <Link
      href={`/speakers/${speaker.slug}`}
      className="group block overflow-hidden rounded-sm bg-surface transition-all duration-300 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
        {speaker.image !== "/images/speakers/placeholder.jpg" ? (
          <Image
            src={speaker.image}
            alt={speaker.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="absolute right-2 top-2 rounded-sm bg-gold/90 px-2 py-0.5 text-[10px] font-medium text-navy-dark sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
          {speaker.company}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <h3 className="font-serif text-lg font-semibold text-heading transition-colors group-hover:text-gold sm:text-xl">
          {speaker.name}
        </h3>
        <p className="mt-1 text-xs text-body sm:text-sm">{speaker.title}</p>
        {speaker.topic && (
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-gold sm:mt-3 sm:text-xs">
            {speaker.topic}
          </p>
        )}
      </div>
    </Link>
  );
}
