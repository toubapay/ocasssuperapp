import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 bg-emerald-950 text-emerald-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <div className="text-lg font-semibold text-white">Ocass Super App</div>
            <p className="mt-2 text-sm text-emerald-200/70">
              La plateforme multi-services de Touba, Sénégal.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <a
              href={CONTACT.mapsUrl}
              className="flex items-start gap-2 hover:text-white"
            >
              <MapPin size={16} className="mt-0.5 shrink-0" /> {CONTACT.address}
            </a>
            <a href={`tel:${CONTACT.phoneIntl.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
              <Phone size={16} /> {CONTACT.phoneIntl}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail size={16} /> {CONTACT.email}
            </a>
          </div>
          <div className="text-sm text-emerald-200/70">
            <a href={CONTACT.website} className="hover:text-white">
              {CONTACT.website}
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-emerald-800/60 pt-6 text-xs text-emerald-300/60">
          © {new Date().getFullYear()} Ocass. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
