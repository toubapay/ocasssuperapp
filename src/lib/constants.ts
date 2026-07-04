import { Pill, ShoppingBag, ShoppingCart, Smartphone, Truck, UtensilsCrossed } from "lucide-react";

// Mirrors the business facts baked into SOKHNA_SYSTEM_INSTRUCTION in server.ts.
// Keep both in sync if any of this changes.

export const CONTACT = {
  address: "Touba 28 sur la route nationale, Touba, Sénégal",
  mapsUrl: "https://www.google.com/maps?q=14.858876100644377,-15.87640320167859",
  phone: "759091919",
  phoneIntl: "+221 759091919",
  email: "infos@ocass.net",
  website: "https://ocass.net",
};

export const APP_LINKS = [
  {
    role: "Client",
    title: "Ocass",
    description: "Commandez, faites vos courses et payez vos factures.",
    url: "https://play.google.com/store/apps/details?id=com.Ocass.order",
  },
  {
    role: "Marchand",
    title: "Ocass Marchand",
    description: "Gérez votre boutique et recevez des commandes.",
    url: "https://play.google.com/store/apps/details?id=com.Ocass.marchand",
  },
  {
    role: "Livreur",
    title: "Ocass Express",
    description: "Acceptez des courses et livrez dans Touba.",
    url: "https://play.google.com/store/apps/details?id=com.Ocass.express",
  },
];

export const MODULES = [
  {
    icon: ShoppingBag,
    title: "Boutique",
    description: "Mode, beauté et électronique en ligne.",
  },
  {
    icon: ShoppingCart,
    title: "Supermarché",
    description: "Courses et alimentation livrées en 20 minutes.",
  },
  {
    icon: Pill,
    title: "Pharmacie",
    description: "Commandes pharmaceutiques et consultations santé & beauté.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurant",
    description: "Thiébou Dieun, Yassa, Mafé et fast-food livrés chez vous.",
  },
  {
    icon: Truck,
    title: "Livraison",
    description: "Envoi de colis et livraison express dans Touba.",
  },
  {
    icon: Smartphone,
    title: "AirTime & Factures",
    description: "Crédit mobile (Orange, Free, Expresso) et factures Senelec, Sen'eau, Canal+.",
  },
];
