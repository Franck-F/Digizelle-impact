import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getSpeakerBySlug, getAllSpeakerSlugs } from "@/lib/data/speakers";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSpeakerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const speaker = getSpeakerBySlug(slug);
  if (!speaker) return {};

  return {
    title: speaker.name,
    description: `${speaker.name} — ${speaker.title} chez ${speaker.company}. Intervenant au Digizelle Impact Event 2026.`,
  };
}

export default async function SpeakerPage({ params }: Props) {
  const { slug } = await params;
  const speaker = getSpeakerBySlug(slug);

  if (!speaker) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        {/* Back link */}
        <Link
          href="/speakers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-heading sm:mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux speakers
        </Link>

        <div className="grid gap-8 sm:gap-12 md:grid-cols-5">
          {/* Image */}
          <div className="md:col-span-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark">
              {speaker.image !== "/images/speakers/placeholder.jpg" ? (
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Image
                    src="/images/mascotte/mascotte2.png"
                    alt="Photo à venir"
                    width={120}
                    height={120}
                    className="opacity-40"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            <span className="mb-2 inline-block rounded-sm bg-gold/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold-dark dark:text-gold">
              {speaker.company}
            </span>
            <h1 className="mt-2 font-serif text-3xl font-bold text-heading sm:text-4xl md:text-5xl">
              {speaker.name}
            </h1>
            <p className="mt-2 text-base text-body sm:text-lg">{speaker.title}</p>

            {speaker.topic && (
              <div className="mt-5 border-l-4 border-gold pl-4 sm:mt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gold sm:text-sm">
                  Thème
                </p>
                <p className="mt-1 font-serif text-lg text-heading sm:text-xl">
                  {speaker.topic}
                </p>
              </div>
            )}

            <div className="mt-6 sm:mt-8">
              <h2 className="mb-3 font-serif text-lg font-semibold text-heading sm:text-xl">
                Biographie
              </h2>
              <p className="text-sm leading-relaxed text-body sm:text-base">{speaker.bio}</p>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-4 sm:mt-8">
              {speaker.linkedin && (
                <a
                  href={speaker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-heading transition-colors hover:text-gold"
                >
                  LinkedIn
                </a>
              )}
              {speaker.twitter && (
                <a
                  href={speaker.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-heading transition-colors hover:text-gold"
                >
                  Twitter
                </a>
              )}
            </div>

            <div className="mt-8 sm:mt-10">
              <Button href="/contact" variant="secondary">
                Réserver ma place
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
