import { MODULES } from "../lib/constants";

export default function Modules() {
  return (
    <section id="modules" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-emerald-900 sm:text-3xl">
        Tous les services Ocass, en un seul endroit
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon size={22} />
            </div>
            <h3 className="mt-4 font-semibold text-emerald-900">{title}</h3>
            <p className="mt-1 text-sm text-emerald-900/70">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
