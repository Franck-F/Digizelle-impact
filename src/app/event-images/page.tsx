import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Image from 'next/image';

export const metadata = {
  title: "L'événement en images",
  description: "Revivez les meilleurs moments en photos et vidéos."
};

function getEventMedia() {
  // Les images et vidéos sont dans public/images/event
  // On liste les fichiers statiques
  // Next.js ne permet pas de lire le dossier public côté serveur, donc on liste manuellement
  const images = [
    '/images/event/05dd1e93-1e81-43a2-8687-2af74ca9ef0f.jpg',
    '/images/event/50f9ecbe-33b7-4788-bfee-c1b86f0e413e.jpg',
    '/images/event/5106369e-1d28-4bf1-b36b-864508ce4c5c.jpg',
    '/images/event/749e43a5-f53e-423d-8eec-f1f9ad0d9311.jpg',
    '/images/event/871296f0-eafd-40a7-ac5d-45967c3c1258.jpg',
    '/images/event/cd658b80-28de-4c17-88b8-2fe07ca938f4.jpg',
    '/images/event/fae2ef41-3724-4729-bc62-dc26c0c85fac.jpg',
  ];
  const videos = [
    '/images/event/66bda1c2-152e-43f2-a9ab-e9b08287ed0f.mov',
    '/images/event/cfbd8ecf-a601-478d-bf4c-7e246c5bbf3e.mov',
  ];
  return { images, videos };
}

export default function EventImagesPage() {
  const { images, videos } = getEventMedia();

  return (
    <Container className="py-16">
      <SectionTitle
        label="Galerie"
        title="L'événement en images"
        description="Revivez les meilleurs moments en photos et vidéos."
      />
      <div className="mb-8 flex justify-center">
        <a
          href="https://www.swisstransfer.com/d/8a6d6aed-1913-4b80-ae7e-fe3df6114ce4"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-xl bg-purple text-white font-semibold text-lg shadow-md hover:bg-purple/80 transition"
        >
          Accéder à plus de contenu
        </a>
      </div>
      <div className="mt-2 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {images.map((src, idx) => (
          <div key={src} className="rounded-2xl overflow-hidden shadow-lg bg-cream dark:bg-navy/80">
            <Image
              src={src}
              alt={`Photo événement ${idx + 1}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition hover:scale-105 duration-300"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      {videos.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-heading dark:text-cream mb-6">Vidéos</h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {videos.map((src, idx) => (
              <div key={src} className="rounded-2xl overflow-hidden shadow-lg bg-cream dark:bg-navy/80">
                <video
                  src={src}
                  controls
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
