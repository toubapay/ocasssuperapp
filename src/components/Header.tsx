import { Mail, Phone, ShoppingCart } from "lucide-react";
import { CONTACT } from "../lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-2xl font-extrabold text-[#083b0d]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#083b0d]">
              <ShoppingCart size={20} strokeWidth={2.3} className="text-[#eb8c2e]" aria-hidden="true" />
            </span>
            <span>cass</span>
          </div>
          <span className="text-lg font-semibold text-emerald-900">Ocass Super App</span>
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
