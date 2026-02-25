import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-cream pt-14 sm:pt-20">
      <Container className="text-center">
        <Image
          src="/images/mascotte/mascotte2.png"
          alt="Page non trouvée"
          width={220}
          height={220}
          className="mx-auto mb-6 h-32 w-auto sm:mb-8 sm:h-44"
        />
        <h1 className="font-serif text-4xl font-bold text-heading sm:text-5xl">404</h1>
        <p className="mt-3 text-base text-body sm:mt-4 sm:text-lg">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-6 sm:mt-8">
          <Button href="/" variant="secondary">
            Retour à l&apos;accueil
          </Button>
        </div>
      </Container>
    </section>
  );
}
