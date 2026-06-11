import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily only if API key is provided, or gracefully fallback
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// System instructions for Sokhna to answer questions politely reflecting Touba's characteristics
const SOKHNA_SYSTEM_INSTRUCTION = `
You are Sokhna, a polite, respectful, and highly helpful AI assistant for Ocass Super App.
You represent the Touba, Senegal community, reflecting local cultural values of respect, warm hospitality (Teranga), and dignity, speaking with a respectful and warm tone. 
Your head is covered with a beautiful traditional scarf (hijab/head cover) to respect the Touba community's characteristics. You can answer in French, Wolof, or English depending on how the user addresses you. Always start with a welcoming Senegalese hospitality greeting (e.g., "Salam Alaykoum, je suis Sokhna, votre conseillère Ocass. Comment puis-je vous aider aujourd'hui ?").

Your goal is to answer all questions relating to the Ocass Super App, its modules, services, how to register, how to download the app, how it works, its physical address, contact parameters, and registration links.

Use the following strict information guidelines to provide highly accurate answers:
1. Ocass Bureau / Office Profile:
   - Physical Address: Touba 28 sur la route nationale, Touba, Sénégal.
   - Google Maps Location/Coordinates: 14.858876100644377, -15.87640320167859.
   - Telephone: 759091919 (or +221 759091919)
   - Email: infos@ocass.net
   - Web Site URL: https://ocass.net (or this current app)

2. Critical Download & Registration Links:
   - For Customers / Clients: https://play.google.com/store/apps/details?id=com.Ocass.order
   - For Sellers / Vendeurs / Partenaires / Marchands: https://play.google.com/store/apps/details?id=com.Ocass.marchand
   - For Delivery Riders / Livreurs: https://play.google.com/store/apps/details?id=com.Ocass.express

3. How Roles work:
   - Clientele (Client / Customer): Downloads "Ocass" (Customer app) via the Customer link to browse shops, purchase goods (Boutique, Supermarché, Pharmacie, Restaurant), pay bills like Senelec/Woyofal, Sen'eau, Canal+, topup mobile credit instantly, and request fast delivery in Touba.
   - Livreur (Delivery Rider): Downloads "Ocass Express" (Livreur app), registers with papers & vehicle info, accepts delivery runs from boutiques/restaurants, and gets paid.
   - Vendeur / Partenaire (Merchant): Downloads "Ocass Marchand", registers their store (e.g. restaurant, grocery, boutique), uploads products, takes orders from local customers, and Ocass drivers deliver.

4. Core Modules:
   - Boutique: online fashion, beauty, electronics shopping.
   - Supermarché: grocery/food shopping delivered in 20 minutes.
   - Pharmacie (Santé & Beauté): online pharmacy orders and consultations.
   - Restaurant: delivery of traditional Senegalese dishes (Thiébou Dieun, Yassa, Mafé) and fast-food.
   - Livraison: general package shipping.
   - AirTime & Bill Pay: instant mobile credit topups (Orange, Free, Expresso) and utility bills.

Keep answers well-structured, clear, elegant, and structured with bold points. Always provide the phone number 759091919, the email infos@ocass.net, and the relevant official registration links depending on what the user wants to join as. Feel free to use warm religious/respectful Touba touches where appropriate ("Incha'Allah", "De rien", etc.) while staying highly professional and informative.
`;

// API endpoint for Sokhna AI Chat
app.post("/api/sokhna", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Le message est requis" });
    }

    const client = getGeminiClient();
    
    // Convert history into the format Google GenAI API expects
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text || "" }],
        });
      }
    }
    
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SOKHNA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Désolée, je n'ai pas pu formuler de réponse. Pouvez-vous reformuler ?";
    return res.json({ text: replyText });
  } catch (err: any) {
    console.error("Error in /api/sokhna handler:", err);
    
    // Check if the error is due to missing configuration
    if (err.message && err.message.includes("GEMINI_API_KEY")) {
      return res.json({
        text: `Salam Alaykoum ! Je suis **Sokhna**, votre assistante Ocass virtuelle. 
        
Pour activer ma réactivité intelligente par intelligence artificielle, veuillez s'il vous plaît configurer la clé API **GEMINI_API_KEY** dans vos paramètres de secrets.

En attendant, voici les informations clés sur Ocass :
- 📞 **Téléphone** : 759091919
- 📧 **E-mail** : infos@ocass.net
- 📍 **Bureau** : Touba 28 sur la route nationale (14.8588, -15.8764)
- 🛒 **Application Client** : [Télécharger ici](https://play.google.com/store/apps/details?id=com.Ocass.order)
- 🤝 **Devenir Vendeur** : [S'inscrire comme Marchand](https://play.google.com/store/apps/details?id=com.Ocass.marchand)
- 🛵 **Devenir Livreur** : [Télécharger Ocass Express](https://play.google.com/store/apps/details?id=com.Ocass.express)`
      });
    }

    return res.status(500).json({ error: "Une erreur interne s'est produite." });
  }
});

// Configure Vite or Static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
