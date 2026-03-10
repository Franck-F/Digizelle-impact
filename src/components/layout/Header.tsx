"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { clsx } from "clsx";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-cream/80 backdrop-blur-md">
      <Container>
        <nav className="flex h-14 items-center justify-between sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/logo.png"
              alt="Digizelle"
              width={120}
              height={32}
              className="h-6 w-auto sm:h-8 lg:h-9"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-heading transition-colors hover:text-purple"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
            <Button href="/inscription" variant="secondary" size="sm">
              S&apos;inscrire
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Ouvrir le menu"
            >
              <span
                className={clsx(
                  "h-0.5 w-5 bg-heading transition-all duration-300",
                  isOpen && "translate-y-2 rotate-45"
                )}
              />
              <span
                className={clsx(
                  "h-0.5 w-5 bg-heading transition-all duration-300",
                  isOpen && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "h-0.5 w-5 bg-heading transition-all duration-300",
                  isOpen && "-translate-y-2 -rotate-45"
                )}
              />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300 lg:hidden",
            isOpen ? "max-h-96 pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-sm px-3 py-2 text-base font-medium text-heading transition-colors hover:bg-surface hover:text-purple"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/inscription" variant="secondary" size="sm" className="mt-2 self-start">
              S&apos;inscrire
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
