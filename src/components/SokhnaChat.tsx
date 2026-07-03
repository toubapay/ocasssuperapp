import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

type ChatTurn = { role: "user" | "model"; text: string };

export default function SokhnaChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([
    {
      role: "model",
      text: "Salam Alaykoum, je suis Sokhna, votre conseillère Ocass. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);

  async function sendMessage() {
    const message = input.trim();
    if (!message || loading) return;

    const nextHistory: ChatTurn[] = [...history, { role: "user", text: message }];
    setHistory(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/sokhna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: nextHistory.slice(0, -1) }),
      });
      const data = await res.json();
      const replyText = data.text ?? data.error ?? "Désolée, une erreur est survenue.";
      setHistory((h) => [...h, { role: "model", text: replyText }]);
    } catch {
      setHistory((h) => [
        ...h,
        { role: "model", text: "Désolée, je n'ai pas pu contacter le serveur. Réessayez plus tard." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-xl sm:w-96"
          >
            <div className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
              <span className="font-semibold">Sokhna · Assistante Ocass</span>
              <button onClick={() => setOpen(false)} aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {history.map((turn, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                    turn.role === "user"
                      ? "ml-auto bg-emerald-800 text-white"
                      : "bg-emerald-50 text-emerald-900"
                  }`}
                >
                  {turn.text}
                </div>
              ))}
              {loading && (
                <div className="max-w-[85%] rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900/60">
                  Sokhna écrit...
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-emerald-900/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Écrivez votre message..."
                className="flex-1 rounded-full border border-emerald-900/15 px-4 py-2 text-sm outline-none focus:border-emerald-600"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                aria-label="Envoyer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir le chat Sokhna"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-emerald-950 shadow-lg transition hover:bg-amber-300"
      >
        <MessageCircle size={26} />
      </button>
    </div>
  );
}
