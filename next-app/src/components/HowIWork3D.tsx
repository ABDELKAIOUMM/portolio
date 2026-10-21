'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: '01',
    title: 'Discovery & Strategy',
    desc: 'We define the project goals, user personas, and core technical architecture before writing a single line of code.',
    image: '/images/how-i-work/discovery.svg',
    imageAlt: 'Compass, research notes, and connected ideas for discovery and strategy',
    color: 'from-cyan-500/20 to-blue-600/20',
    borderColor: 'border-cyan-500/40',
  },
  {
    num: '02',
    title: 'Design & Wireframing',
    desc: 'Crafting interactive 3D prototypes, sleek UI component systems, and butter-smooth user journeys.',
    image: '/images/how-i-work/design.svg',
    imageAlt: 'Layered interface wireframes and a design pencil',
    color: 'from-blue-500/20 to-indigo-600/20',
    borderColor: 'border-blue-500/40',
  },
  {
    num: '03',
    title: 'Development & Code',
    desc: 'Clean, modular React/Next.js code with WebGL shaders and smooth animations.',
    image: '/images/how-i-work/development.svg',
    imageAlt: 'Code editor with colorful code and development tools',
    color: 'from-indigo-500/20 to-purple-600/20',
    borderColor: 'border-indigo-500/40',
  },
  {
    num: '04',
    title: 'Optimization & SEO',
    desc: 'Fine-tuning frame rates (60/120 FPS), optimizing assets, accessibility WCAG compliance, and Lighthouse 100/100.',
    image: '/images/how-i-work/optimization.svg',
    imageAlt: 'Performance dashboard with rising analytics and speed indicators',
    color: 'from-purple-500/20 to-pink-600/20',
    borderColor: 'border-purple-500/40',
  },
  {
    num: '05',
    title: 'Launch & Handoff',
    desc: 'Seamless deployment to global CDNs, documentation handoff, and post-launch monitoring.',
    image: '/images/how-i-work/launch.svg',
    imageAlt: 'Rocket launching into orbit to represent product delivery',
    color: 'from-pink-500/20 to-emerald-600/20',
    borderColor: 'border-pink-500/40',
  },
];

export default function HowIWork3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const deckOffsetRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { y: 0, z: 0, opacity: 1 });
      });

      if (deckOffsetRef.current) gsap.set(deckOffsetRef.current, { y: 0 });

      textRefs.current.forEach((text) => {
        if (text) gsap.set(text, { opacity: 0.3, x: -16 });
      });

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'none' },
        scrollTrigger: {
          trigger: containerRef.current,
          pin: frameRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (STEPS.length + 1)}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cardsRef.current.forEach((card, index) => {
        const position = index;

        if (card && index < STEPS.length - 1) {
          const lift = STEPS.length - 1 - index;
          tl.to(card, { y: -17 * lift, z: 50 * lift }, position);
        }

        const text = textRefs.current[index];
        if (text) tl.to(text, { opacity: 1, x: 0, duration: 0.6 }, position + 0.15);
      });

      if (deckOffsetRef.current) {
        tl.to(deckOffsetRef.current, { y: 60, duration: STEPS.length }, 0);
      }

      tl.to({}, { duration: 1 }, STEPS.length);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-neutral-950 text-white">
      <div ref={frameRef} className="flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-16 md:h-screen md:py-0">
        <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-12">
          
          {/* Left Side: Dynamic Text Callouts */}
          <div className="z-20 space-y-3 md:col-span-5 md:space-y-3 lg:space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              — MY APPROACH
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-3xl lg:text-5xl">
              How I Build Digital Products
            </h2>
            
            <div className="mt-5 space-y-3 md:mt-4 md:space-y-3 lg:mt-8 lg:space-y-4">
              {STEPS.map((step, idx) => (
                <div
                  key={step.num}
                  ref={(el) => { textRefs.current[idx] = el; }}
                  className="flex min-h-[92px] flex-col justify-center rounded-xl border border-white/5 bg-white/5 p-3.5 backdrop-blur-md md:min-h-[84px] md:p-3 lg:min-h-[96px] lg:p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-sm font-bold leading-snug text-cyan-400">{step.num}</span>
                    <h3 className="text-base font-bold leading-snug md:text-base lg:text-lg">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-neutral-300 md:text-[13px] md:leading-relaxed lg:text-sm lg:leading-normal">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: 3D Isometric Exploded Layer Stack */}
          <div className="relative flex h-[300px] w-full items-center justify-center sm:h-[380px] md:col-span-7 md:h-[500px]">
            
            {/* 3D Perspective Stage */}
            <div
              className="relative h-[220px] w-[260px] sm:h-[280px] sm:w-[340px] md:w-[420px]"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Isometric Rotated Deck */}
              <div ref={deckOffsetRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                <div
                  className="absolute inset-0 h-full w-full"
                  style={{
                    transform: 'rotateX(55deg) rotateZ(-35deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {STEPS.map((step, idx) => (
                    <div
                      key={step.num}
                      ref={(el) => { cardsRef.current[idx] = el; }}
                      className={`absolute inset-0 rounded-2xl border bg-gradient-to-br ${step.color} ${step.borderColor} p-6 shadow-2xl backdrop-blur-xl transition-shadow duration-300`}
                      style={{
                        transformStyle: 'preserve-3d',
                        zIndex: STEPS.length - idx,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      {/* Inner Card Wireframe Graphics */}
                      <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-mono text-xs text-neutral-400">LAYER // {step.num}</span>
                          <div className="flex gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-red-500/60" />
                            <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
                            <div className="h-2 w-2 rounded-full bg-green-500/60" />
                          </div>
                        </div>

                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden py-2">
                          <img
                            src={step.image}
                            alt={step.imageAlt}
                            draggable={false}
                            className="h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                          />
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-2">
                          <span className="text-xs font-bold text-white sm:text-sm">{step.title}</span>
                          <span className="text-xs text-cyan-400">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <div className="h-screen w-full bg-neutral-950" aria-hidden="true" />
    </div>
  );
}
