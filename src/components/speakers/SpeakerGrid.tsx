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
    <StaggerContainer className="grid gap-6 grid-cols-2 lg:grid-cols-4 sm:gap-8">
      {displaySpeakers.map((speaker, index) => (
        <StaggerItem key={speaker.id}>
          <SpeakerCard speaker={speaker} featured={index === 0} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
