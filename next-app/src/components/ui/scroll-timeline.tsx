"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface TimelineProps {
  milestones: Milestone[];
}

export default function Component({ milestones }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion: show the fully drawn line and all cards, no animation.
    if (reduced) {
      gsap.set(line, { scaleY: 1 });
      gsap.set(itemRefs.current, { opacity: 1, y: 0 });
      setScrollProgress(1);
      return;
    }

    const ctx = gsap.context(() => {
      // Draw the foreground line as the section scrolls through the viewport.
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setScrollProgress(self.progress),
          },
        }
      );

      // Reveal each card with a smooth staggered slide/fade.
      itemRefs.current.forEach((item) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, [milestones.length]);

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 py-12 font-sans"
      ref={containerRef}
    >
      <div className="relative">
        {/* Background line (faded) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2" />

        {/* Animated foreground line (draws on scroll) */}
        <div
          ref={lineRef}
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-black dark:bg-white -translate-x-1/2 z-0 origin-top will-change-transform"
          style={{ transform: "scaleY(0)" }}
        />

        <div className="flex flex-col gap-16 md:gap-24 relative z-10">
          {milestones.map((milestone, index) => {
            // Determine if the line has reached this item
            const itemThreshold = index / (milestones.length - 1 || 1);
            const isActive = scrollProgress >= itemThreshold - 0.05;
            const isEven = index % 2 === 0;

            const dotClasses = isActive
              ? "border-black bg-white dark:border-white dark:bg-black scale-125"
              : "border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-700 scale-100";

            return (
              <div
                key={milestone.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`relative flex flex-col md:flex-row ${
                  isEven ? "md:flex-row-reverse" : ""
                } items-start w-full group`}
              >
                {/* The Dot */}
                <div
                  className={`absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full border-2 -translate-x-1/2 mt-1.5 transition-all duration-500 z-20 ${dotClasses}`}
                />

                {/* Desktop Empty Space (pushes content to left/right) */}
                <div className="hidden md:block w-1/2" />

                {/* Content Card */}
                <div
                  className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                    isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                  }`}
                >
                  <div className="inline-block px-3 py-1 mb-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono tracking-widest text-neutral-500 dark:text-neutral-400">
                    {milestone.date}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
