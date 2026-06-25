"use client";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  HiBolt,
  HiChartBar,
  HiCursorArrowRays,
  HiSparkles,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

type OrbitItem = {
  label: string;
  position: string;
  icon: IconType;
  delay: number;
};

type SignalPath = {
  d: string;
  delay: number;
  color: string;
};

const orbitItems: OrbitItem[] = [
  {
    label: "Digital",
    position: "left-[7%] top-[17%] sm:left-[5%] sm:top-[18%]",
    icon: HiSparkles,
    delay: 0,
  },
  {
    label: "Ads",
    position: "right-[6%] top-[23%] sm:right-[4%]",
    icon: HiCursorArrowRays,
    delay: 0.4,
  },
  {
    label: "Leads",
    position: "bottom-[18%] left-[12%] sm:left-[15%]",
    icon: HiChartBar,
    delay: 0.8,
  },
  {
    label: "Fast",
    position: "bottom-[13%] right-[12%] sm:right-[10%]",
    icon: HiBolt,
    delay: 1.2,
  },
];

const signalPaths: SignalPath[] = [
  {
    d: "M74 260 C145 198 225 190 308 245 C410 312 487 235 568 175",
    delay: 0,
    color: "#20C4E8",
  },
  {
    d: "M95 150 C180 118 250 128 315 184 C404 261 489 245 548 290",
    delay: 1.4,
    color: "#7DD3FC",
  },
  {
    d: "M118 352 C190 300 255 318 330 352 C417 390 490 350 562 314",
    delay: 2.6,
    color: "#60A5FA",
  },
];

const orbitTransition = {
  duration: 26,
  ease: "linear" as const,
  repeat: Infinity,
};

export default function HeroDeviceOrbit() {
  const reduceMotion = useSafeReducedMotion();

  return (
    <div className="relative mx-auto h-82 w-full max-w-164 overflow-hidden sm:h-106 sm:overflow-visible lg:h-120">
      <motion.div
        aria-hidden="true"
        className="absolute left-[5%] top-[4%] h-[82%] w-[90%] rounded-full border border-[#20C4E8]/25"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={orbitTransition}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-[13%] top-[13%] h-[65%] w-[72%] rounded-full border border-dashed border-white/18"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ ...orbitTransition, duration: 34 }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        animate={reduceMotion ? undefined : { opacity: [0.68, 1, 0.68] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 640 460"
          fill="none"
          preserveAspectRatio="none"
        >
          {signalPaths.map((path) => (
            <motion.path
              key={path.d}
              d={path.d}
              stroke={path.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 18"
              initial={false}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      pathLength: [0.1, 0.95, 0.1],
                      opacity: [0.1, 0.7, 0.1],
                    }
              }
              transition={{
                duration: 5.8,
                delay: path.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute left-[26%] top-[20%] z-10 h-[54%] w-[54%] rounded-full border border-[#20C4E8]/20"
        animate={
          reduceMotion
            ? undefined
            : { scale: [0.92, 1.08, 0.92], opacity: [0.24, 0.48, 0.24] }
        }
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        aria-hidden="true"
        className="absolute left-[18%] top-[18%] z-10 h-[58%] w-[66%] rounded-full border border-white/10"
      />

      <div className="absolute inset-0 z-40">
        {orbitItems.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              className={`absolute ${item.position}`}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -8, 0],
                      scale: [1, 1.04, 1],
                    }
              }
              transition={{
                duration: 4.4,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center gap-0 rounded-full border border-white/15 bg-[#102447]/90 p-2 text-xs font-extrabold text-white shadow-xl shadow-black/20 backdrop-blur sm:gap-2 sm:px-3 sm:py-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#20C4E8] text-[#06162C]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="hidden sm:inline">{item.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute left-[15%] top-[12%] z-20 h-1.5 w-24 rounded-full bg-linear-to-r from-transparent via-[#20C4E8] to-transparent blur-[1px] sm:w-32"
        animate={
          reduceMotion ? undefined : { x: [0, 168, 0], opacity: [0, 0.75, 0] }
        }
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute bottom-[12%] right-[5%] z-20 h-1.5 w-24 rounded-full bg-linear-to-r from-transparent via-white to-transparent blur-[1px] sm:w-38"
        animate={
          reduceMotion ? undefined : { x: [0, -155, 0], opacity: [0, 0.52, 0] }
        }
        transition={{
          duration: 5.2,
          delay: 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-[-1%] top-[-7%] z-30 w-[78%] max-w-116 sm:left-[4%] sm:top-[-6%] lg:left-[5%] lg:top-[-4%]"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -10, 0], rotate: [-1, 1, -1], scale: [1, 1.015, 1] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/hero-hp.png"
          alt="Preview tampilan mobile Sebisa Project"
          width={500}
          height={400}
          priority
          className="pointer-events-none w-full select-none drop-shadow-[0_26px_38px_rgba(0,0,0,0.38)]"
          sizes="(min-width: 1024px) 30rem, 82vw"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 z-30 w-[91%] max-w-160"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, 8, 0], rotate: [0.8, -0.6, 0.8], scale: [1, 1.01, 1] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/hero-laptop.png"
          alt="Preview tampilan digital Sebisa Project di laptop"
          width={650}
          height={493}
          priority
          className="pointer-events-none w-full select-none drop-shadow-[0_34px_46px_rgba(0,0,0,0.42)]"
          sizes="(min-width: 1024px) 40rem, 91vw"
        />
      </motion.div>
    </div>
  );
}

