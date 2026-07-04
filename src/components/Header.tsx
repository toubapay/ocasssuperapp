import { Mail, Phone, ShoppingCart } from "lucide-react";
import { CONTACT } from "../lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center text-2xl font-bold text-emerald-800">
          <ShoppingCart size={28} strokeWidth={2.5} aria-hidden="true" />
          <span>cass</span>
        </div>
        <div className="hidden items-center gap-5 text-sm text-emerald-900/80 md:flex">
          <a href={`tel:${CONTACT.phoneIntl.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-emerald-700">
            <Phone size={16} /> {CONTACT.phoneIntl}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 hover:text-emerald-700">
            <Mail size={16} /> {CONTACT.email}
          </a>
        </div>
      </div>
    </header>
  );
}
