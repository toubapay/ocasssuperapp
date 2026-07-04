import { motion } from "motion/react";
import { APP_LINKS } from "../lib/constants";

export default function Hero() {
  const clientLink = APP_LINKS.find((a) => a.role === "Client")!.url;

  return (
    <section className="relative overflow-hidden bg-emerald-900 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
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
