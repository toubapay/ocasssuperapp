import { Download } from "lucide-react";
import { APP_LINKS } from "../lib/constants";

export default function AppLinks() {
  return (
    <section id="apps" className="bg-emerald-50/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-bold text-emerald-900 sm:text-3xl">
          Choisissez votre rôle
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {APP_LINKS.map(({ role, title, description, url }) => (
            <div
              key={role}
              className="flex flex-col rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                {role}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-emerald-900">{title}</h3>
              <p className="mt-2 flex-1 text-sm text-emerald-900/70">{description}</p>
              <a
                href={url}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Download size={16} /> Télécharger
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
