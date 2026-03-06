"use client";

import { Speaker } from "@/lib/types";
import { SpeakerCard } from "./SpeakerCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

interface SpeakerGridProps {
  speakers: Speaker[];
  limit?: number;
}

export function SpeakerGrid({ speakers, limit }: SpeakerGridProps) {
  const displaySpeakers = limit ? speakers.slice(0, limit) : speakers;

  return (
    <StaggerContainer className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-5">
      {displaySpeakers.map((speaker, index) => (
        <StaggerItem key={speaker.id} className="h-full">
          <SpeakerCard speaker={speaker} featured={index === 0} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
