"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  type: "confetti" | "star" | "circle";
}

interface FloatingMascot {
  id: number;
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  delay: number;
  rotation: number;
}

const PURPLE_COLORS = ["#7301FF", "#A34BF5", "#9333EA", "#7E22CE", "#C084FC", "#F3E8FF"];
const PARTY_COLORS = [...PURPLE_COLORS, "#FFFFFF", "#24325F", "#EDE9FE"];

const MASCOTS = [
  "/images/mascotte/mascotte.png",
  "/images/mascotte/mascotte1.png",
  "/images/mascotte/mascotte2.png",
  "/images/mascotte/mascotte3.png",
  "/images/mascotte/mascotte4.png",
];

let nextParticleId = 0;

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    id: nextParticleId++,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    size: 4 + Math.random() * 8,
    color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)],
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
    type: (["confetti", "star", "circle"] as const)[Math.floor(Math.random() * 3)],
  }));
}

function createFloatingMascots(): FloatingMascot[] {
  return MASCOTS.map((src, i) => ({
    id: i,
    src,
    startX: 10 + Math.random() * 80,
    startY: 110,
    endX: 10 + Math.random() * 80,
    endY: 10 + Math.random() * 30,
    size: 50 + Math.random() * 40,
    delay: 0.3 + i * 0.25,
    rotation: -15 + Math.random() * 30,
  }));
}

export function CelebrationAnimation({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mascots, setMascots] = useState<FloatingMascot[]>([]);
  const [burstPhase, setBurstPhase] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!show) return;

    // Clear any pending timeouts from a previous run (React Strict Mode)
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setParticles(createParticles(60));
    setMascots(createFloatingMascots());
    setBurstPhase(1);

    // Second burst
    const t1 = setTimeout(() => {
      setParticles((prev) => [...prev, ...createParticles(40).map((p) => ({ ...p, delay: p.delay + 0.5 }))]);
      setBurstPhase(2);
    }, 800);

    // Third burst
    const t2 = setTimeout(() => {
      setParticles((prev) => [...prev, ...createParticles(30).map((p) => ({ ...p, delay: p.delay + 1 }))]);
      setBurstPhase(3);
    }, 1600);

    timeoutsRef.current = [t1, t2];

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-sm bg-surface p-6 shadow-lg sm:p-10 md:p-14"
        >
          {/* Confetti layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={`p-${p.id}`}
                initial={{
                  x: `${p.x}vw`,
                  y: "-20px",
                  rotate: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  y: "110vh",
                  rotate: p.rotation + 720,
                  opacity: [0, 1, 1, 0.5, 0],
                  scale: [0, 1.2, 1, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: p.delay,
                  ease: "easeOut",
                }}
                className="absolute"
                style={{ left: `${p.x}%` }}
              >
                {p.type === "confetti" && (
                  <div
                    style={{
                      width: p.size,
                      height: p.size * 0.4,
                      backgroundColor: p.color,
                      borderRadius: 1,
                    }}
                  />
                )}
                {p.type === "star" && (
                  <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                {p.type === "circle" && (
                  <div
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      borderRadius: "50%",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Floating mascots */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {mascots.map((m) => (
              <motion.div
                key={`m-${m.id}`}
                initial={{
                  x: `${m.startX}vw`,
                  y: "110vh",
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [`${m.startX}vw`, `${m.endX}vw`, `${m.startX + 5}vw`],
                  y: ["110vh", `${m.endY}vh`, `-${m.endY + 20}vh`],
                  rotate: [0, m.rotation, -m.rotation / 2],
                  scale: [0, 1.3, 1],
                  opacity: [0, 0.7, 0.5],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  delay: m.delay,
                  ease: "easeOut",
                }}
                className="absolute"
              >
                <Image
                  src={m.src}
                  alt=""
                  width={m.size}
                  height={m.size}
                  className="h-auto"
                  style={{ width: m.size }}
                />
              </motion.div>
            ))}
          </div>

          {/* Radial glow pulse */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0, 0.15, 0],
            }}
            transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, #7301FF 0%, transparent 70%)",
            }}
          />

          {/* Purple ring burst */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 2, delay: 0.3 + i * 0.4, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple"
            />
          ))}

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Checkmark animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3,
              }}
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple sm:mb-6 sm:h-24 sm:w-24"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="h-10 w-10 text-white sm:h-12 sm:w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>

            {/* Main mascot — bounces in */}
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.3 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: 0.6,
              }}
              className="mb-4 sm:mb-6"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/mascotte/mascotte1.png"
                  alt="Félicitations!"
                  width={200}
                  height={200}
                  className="h-28 w-auto sm:h-36 lg:h-44"
                />
              </motion.div>
            </motion.div>

            {/* Title with letter animation */}
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="font-serif text-2xl font-bold text-heading sm:text-3xl md:text-4xl"
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-r from-purple via-purple-light to-purple bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                Inscription confirmée !
              </motion.span>
            </motion.h3>

            {/* Message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-3 max-w-md text-base text-body sm:mt-4 sm:text-lg"
            >
              {message}
            </motion.p>

            {/* Confirmation notice */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-4 text-sm text-body sm:mt-6"
            >
              Une confirmation vous sera envoyée par email.
            </motion.p>

            {/* Side mascots that peek in */}
            <div className="pointer-events-none absolute -left-4 bottom-0 sm:-left-8">
              <motion.div
                initial={{ x: -80, opacity: 0, rotate: -20 }}
                animate={{ x: 0, opacity: 0.6, rotate: 0 }}
                transition={{ delay: 1.6, duration: 0.8, ease: "backOut" }}
              >
                <Image
                  src="/images/mascotte/mascotte3.png"
                  alt=""
                  width={80}
                  height={80}
                  className="h-14 w-auto sm:h-20"
                />
              </motion.div>
            </div>
            <div className="pointer-events-none absolute -right-4 bottom-0 sm:-right-8">
              <motion.div
                initial={{ x: 80, opacity: 0, rotate: 20 }}
                animate={{ x: 0, opacity: 0.6, rotate: 0 }}
                transition={{ delay: 1.8, duration: 0.8, ease: "backOut" }}
              >
                <Image
                  src="/images/mascotte/mascotte4.png"
                  alt=""
                  width={80}
                  height={80}
                  className="h-14 w-auto sm:h-20"
                />
              </motion.div>
            </div>

            {/* Sparkles around text */}
            {burstPhase >= 2 && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 1 + i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="pointer-events-none absolute"
                    style={{
                      left: `${15 + i * 10}%`,
                      top: `${20 + (i % 3) * 25}%`,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#A34BF5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </motion.div>
                ))}
              </>
            )}

            {/* Date reminder */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-6 rounded-sm border border-purple/20 bg-purple/5 px-6 py-4 sm:mt-8"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-purple sm:text-sm">
                Rendez-vous le 13 Mars 2026
              </p>
              <p className="mt-1 text-xs text-body sm:text-sm">
                Epitech Paris — 24 Rue Pasteur, 94270 Le Kremlin-Bicêtre
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
