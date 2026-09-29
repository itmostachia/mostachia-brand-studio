# Project Scaffold — Estructura y Dependencias

## Comando de inicializacion
```bash
npx create-next-app@latest [nombre] --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

## Dependencias a instalar
```bash
# Core — siempre instalar
npm install gsap @gsap/react lenis motion lucide-react

# UI base
npm install shadcn tw-animate-css @number-flow/react

# Dev
npm install -D culori playwright

# shadcn init
npx shadcn@latest init

# shadcn components base
npx shadcn@latest add button sheet card badge accordion input textarea label separator
```

## Dependencias opcionales (segun plan de Fase 1)
```bash
# Si se eligio tsParticles como background
npm install @tsparticles/react @tsparticles/slim

# Si se eligio Lottie para micro-animations
npm install @lottiefiles/dotlottie-react

# Si se eligio 3D accent (usar con precaucion — bundle pesado)
npm install @react-three/fiber @react-three/drei three

# Si se eligio Scrollytelling
npm install @bsmnt/scrollytelling
```

**NOTA:** Las librerias copy-paste (Magic UI, Aceternity, React Bits, Motion Primitives,
Launch UI, Cult UI) NO se instalan via npm — se copian los componentes directamente.
Solo instalar sus dependencias peer si no estan ya (motion, gsap, tailwind).

## Estructura de carpetas
```
src/
  app/
    layout.tsx          # Root layout (fonts, SmoothScroll, Header, Footer)
    page.tsx            # Landing (imports + Schema.org JSON-LD)
    globals.css         # Tailwind v4 + brand OKLCH + keyframes
  components/
    ui/                 # shadcn + section-wrapper, scroll-progress, back-to-top
    sections/           # hero-section.tsx, pain-section.tsx, etc.
    layout/             # header.tsx, footer.tsx
    animations/         # smooth-scroll-provider.tsx, reveal.tsx, floating-cards.tsx
    icons/              # fluxo-logo.tsx (logo SVG component)
  hooks/                # use-active-section.ts, use-scroll-progress.ts
  lib/                  # utils.ts (cn helper)
  config/               # site.ts, metadata.ts
docs/
  brand/                # Logo, imagenes, README con brand summary
  content/              # Docs de producto procesados
  references/           # Design brief, component research, screenshots
public/
  favicon.svg
  apple-touch-icon.png
  og-image.png
```

## Componentes base a crear

### smooth-scroll-provider.tsx
```tsx
"use client";
import { ReactLenis } from "lenis/react";

const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => (
  <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
    {children}
  </ReactLenis>
);

export { SmoothScrollProvider };
```

### section-wrapper.tsx
```tsx
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "light" | "dark" | "gradient" | "navy";
}

const bgVariants: Record<string, string> = {
  white: "bg-background",
  light: "bg-muted/50",
  dark: "bg-brand-dark text-white",
  gradient: "bg-gradient-to-br from-brand-secondary to-brand-accent text-white",
  navy: "bg-brand-primary text-white",
};

const SectionWrapper = ({ children, className, id, background = "white" }: SectionWrapperProps) => (
  <section id={id} className={cn("relative py-16 md:py-24 lg:py-32 overflow-hidden", bgVariants[background], className)}>
    <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
  </section>
);

export { SectionWrapper };
```

### reveal.tsx
```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

const Reveal = ({ children, className, direction = "up", delay = 0, duration = 0.7 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const directions = { up: { y: 40 }, down: { y: -40 }, left: { x: 40 }, right: { x: -40 } };

  useGSAP(() => {
    gsap.fromTo(ref.current, { opacity: 0, ...directions[direction] }, {
      opacity: 1, x: 0, y: 0, duration, delay, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
    });
  }, { scope: ref });

  return <div ref={ref} className={cn("opacity-0", className)}>{children}</div>;
};

export { Reveal };
```
