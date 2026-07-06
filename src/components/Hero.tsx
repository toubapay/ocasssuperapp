import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { APP_LINKS } from "../lib/constants";

const SLIDES = [
  { type: "video", src: "/videos/hero.mp4" },
  { type: "image", src: "/images/promo-banner.jpg" },
] as const;

const SLIDE_DURATION_MS = 7000;

export default function Hero() {
  const clientLink = APP_LINKS.find((a) => a.role === "Client")!.url;
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-emerald-900 text-white">
      <AnimatePresence>
        {SLIDES.map(
          (s, i) =>
            i === slide && (
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                aria-hidden="true"
              >
                {s.type === "video" ? (
                  <video
                    className="h-full w-full object-cover"
                    src={s.src}
                    poster="/images/promo-banner.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <img className="h-full w-full object-cover" src={s.src} alt="" />
                )}
              </motion.div>
            ),
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-900/90" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold sm:text-5xl"
        >
          Tout Touba, livré chez vous
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-emerald-100"
        >
          Boutique, supermarché, pharmacie, restaurant et factures : la plateforme
          multi-services qui réunit clients, marchands et livreurs de Touba, dans
          l'esprit de la Teranga.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={clientLink}
            className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-emerald-950 transition hover:bg-amber-300"
          >
            Télécharger l'app Client
          </a>
          <a
            href="#apps"
            className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Devenir marchand ou livreur
          </a>
        </motion.div>
      </div>
    </section>
  );
}
