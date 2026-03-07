"use client";

import { Speaker } from "@/lib/types";
import { SpeakerCard } from "./SpeakerCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

interface SpeakerGridProps {
  speakers: Speaker[];
  limit?: number;
  compact?: boolean;
}

export function SpeakerGrid({ speakers, limit, compact = false }: SpeakerGridProps) {
  const displaySpeakers = limit ? speakers.slice(0, limit) : speakers;
  const gridClassName = compact
    ? "grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5"
    : "grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-5";

  return (
    <StaggerContainer className={gridClassName}>
      {displaySpeakers.map((speaker, index) => (
        <StaggerItem key={speaker.id} className={compact ? "flex h-full justify-center" : "h-full"}>
          <SpeakerCard speaker={speaker} featured={index === 0} compact={compact} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
