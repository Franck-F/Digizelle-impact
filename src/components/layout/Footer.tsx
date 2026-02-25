import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS, EVENT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full border border-gold/5" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-[400px] w-[400px] rounded-full border border-gold/5" />

      {/* Top banner — tagline + mascotte */}
      <div className="border-b border-white/5">
        <Container className="flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between sm:py-14">
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {EVENT.displayDate} &middot;{" "}
              <a
                href={EVENT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-gold/30 underline-offset-4 transition-colors hover:text-gold"
              >
                {EVENT.location}
              </a>
            </h3>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-gold">
              {EVENT.motto}
            </p>
          </div>
          <Image
            src="/images/mascotte/mascotte1.png"
            alt="Digizelle"
            width={200}
            height={200}
            className="h-28 w-auto sm:h-32 lg:h-40"
          />
        </Container>
      </div>

      {/* Main footer content */}
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/logo.png"
              alt="Digizelle"
              width={140}
              height={36}
              className="mb-5 h-8 w-auto brightness-0 invert sm:h-9"
            />
            <p className="text-sm leading-relaxed text-white/50">
              {EVENT.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              L&apos;événement
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                {EVENT.displayDate}
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <a
                  href={EVENT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  {EVENT.locationFull}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                50 participants
              </li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Rejoindre
            </h4>
            <p className="mb-5 text-sm text-white/60">
              Places limitées. Réservez dès maintenant pour cet événement exclusif.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-navy-dark transition-colors hover:bg-gold-light"
            >
              S&apos;inscrire
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Digizelle. Tous droits réservés.
          </p>
          <div className="flex items-center gap-3">
            <Image
              src="/images/mascotte/mascotte4.png"
              alt="Digizelle"
              width={40}
              height={40}
              className="h-8 w-auto opacity-50"
            />
            <span className="text-xs text-white/30">
              Made with passion by Digizelle
            </span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
