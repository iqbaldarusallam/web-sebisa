"use client";

import { workflowSteps } from "@/data/workflow";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";

export default function Workflow() {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const stepCount = workflowSteps.length;
  const progress = stepCount > 1 ? (activeStep / (stepCount - 1)) * 100 : 0;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % stepCount);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [reduceMotion, stepCount]);

  return (
    <section className="bg-[#DFF3FF] py-12 text-[#333333] md:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-10">
        <MotionReveal className="text-center">
          <span className="inline-flex rounded-md bg-[#12345A] px-3 py-1.5 text-[0.68rem] font-extrabold uppercase leading-none text-white sm:text-xs">
            Cara Kerja Kami
          </span>

          <h2 className="mt-4 text-[1.35rem] font-extrabold leading-tight text-[#343434] sm:text-[1.6rem] md:text-[1.8rem]">
            Dari konsultasi hingga project digital Anda live
          </h2>
        </MotionReveal>

        <div className="relative mx-auto mt-6 max-w-3xl">
          <div className="absolute left-[12%] right-[12%] top-[1.3rem] h-px bg-[#12345A]/35 sm:top-[1.45rem]" />
          <motion.div
            aria-hidden="true"
            className="absolute left-[12%] top-[1.24rem] h-[3px] rounded-full bg-gradient-to-r from-[#12345A] via-[#06B6D4] to-[#12345A] shadow-[0_0_18px_rgba(6,182,212,0.38)] sm:top-[1.39rem]"
            animate={reduceMotion ? undefined : { width: `${progress}%` }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={reduceMotion ? { width: `${progress}%` } : undefined}
          />
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-0">
            {workflowSteps.map((step, index) => {
              const isActive = index === activeStep;

              return (
                <MotionReveal key={step.title} delay={index * 0.04}>
                  <article
                    className="group relative block text-center transition duration-300"
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    <motion.button
                      type="button"
                      aria-label={`Tahap ${index + 1}: ${step.title}`}
                      onClick={() => setActiveStep(index)}
                      onFocus={() => setActiveStep(index)}
                      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.06 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      className={`relative z-10 mx-auto flex h-[2.45rem] w-[2.45rem] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-extrabold leading-none outline-none transition duration-300 focus-visible:ring-4 focus-visible:ring-[#06B6D4]/30 sm:h-[2.9rem] sm:w-[2.9rem] sm:text-lg ${
                        isActive
                          ? "border-[#12345A] bg-[#12345A] text-white"
                          : "border-[#12345A] bg-[#DFF3FF] text-[#12345A] hover:bg-white"
                      }`}
                    >
                      <motion.span
                        aria-hidden="true"
                        className={`absolute inset-[-0.45rem] rounded-full border ${
                          isActive ? "border-[#06B6D4]/70" : "border-transparent"
                        }`}
                        animate={
                          reduceMotion || !isActive
                            ? undefined
                            : { scale: [1, 1.22, 1], opacity: [0.55, 0.05, 0.55] }
                        }
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.span
                        aria-hidden="true"
                        className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ${
                          isActive ? "bg-[#06B6D4]" : "bg-[#12345A]/35"
                        }`}
                        animate={
                          reduceMotion || !isActive
                            ? undefined
                            : { scale: [1, 1.45, 1], opacity: [0.8, 1, 0.8] }
                        }
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className="relative z-10">{index + 1}</span>
                    </motion.button>
                    <div className="pt-2 sm:pt-3">
                      <h3
                        className={`text-[0.62rem] font-extrabold leading-tight transition duration-300 sm:text-sm ${
                          isActive ? "text-[#12345A]" : "text-[#343434]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`mx-auto mt-1 max-w-24 text-[0.52rem] font-medium leading-tight transition duration-300 sm:max-w-32 sm:text-[0.68rem] ${
                          isActive ? "text-[#4B6078]" : "text-[#6f7780]"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
