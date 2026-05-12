import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export function Chatbot({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm ReturnSense AI. Ask me about a return, refund, or troubleshooting. I'm here to help." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    let acc = "";
    try {
      const r = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (r.status === 429) { toast.error("Rate limit reached. Try again shortly."); setLoading(false); return; }
      if (r.status === 402) { toast.error("AI credits exhausted. Add credits in workspace settings."); setLoading(false); return; }
      if (!r.ok || !r.body) throw new Error("stream failed");
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let done = false;
      setMessages((p) => [...p, { role: "assistant", content: "" }]);
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += dec.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx); buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content as string | undefined;
            if (c) { acc += c; setMessages((m) => m.map((x, i) => i === m.length - 1 ? { ...x, content: acc } : x)); }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
      if (user && acc) {
        await supabase.from("chat_messages").insert([
          { user_id: user.id, role: "user", content: text },
          { user_id: user.id, role: "assistant", content: acc },
        ]);
      }
    } catch (e) {
      toast.error("Chatbot error");
    } finally { setLoading(false); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full gradient-primary text-navy shadow-elevated transition hover:scale-105"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
      {open && (
        <Card className="fixed bottom-24 right-6 z-40 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-border shadow-elevated">
          <div className="flex items-center gap-2 border-b border-border bg-navy px-4 py-3 text-navy-foreground">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary"><Sparkles className="h-4 w-4 text-navy" /></div>
            <div>
              <div className="text-sm font-semibold">ReturnSense Assistant</div>
              <div className="text-xs text-white/60">Powered by AI · Online</div>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === "user" ? "rounded-br-sm bg-navy text-navy-foreground" : "rounded-bl-sm bg-card text-card-foreground shadow-card"
                }`}>{m.content || (loading ? "…" : "")}</div>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 border-t border-border bg-background p-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" disabled={loading} />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} className="gradient-primary text-navy hover:opacity-90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
