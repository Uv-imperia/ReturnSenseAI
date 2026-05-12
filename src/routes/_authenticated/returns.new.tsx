import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2, Upload, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/returns/new")({
  component: NewReturn,
  validateSearch: (s: Record<string, unknown>) => ({ orderId: (s.orderId as string) || "" }),
});

const REASONS = ["Damaged on arrival", "Wrong item", "Doesn't fit", "Not as described", "Changed my mind", "Defective", "Late delivery"];

function NewReturn() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { orderId } = Route.useSearch();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderIdSel, setOrderIdSel] = useState(orderId);
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("user_id", user.id).order("ordered_at", { ascending: false }).then(({ data }) => {
      setOrders(data ?? []);
      if (!orderIdSel && data?.[0]) setOrderIdSel(data[0].id);
    });
  }, [user]);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []).slice(0, 4);
    setFiles(list);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !orderIdSel) return toast.error("Pick an order");
    setLoading(true);
    try {
      const order = orders.find((o) => o.id === orderIdSel);
      const urls: string[] = [];
      for (const f of files) {
        const path = `${user.id}/${Date.now()}-${f.name}`;
        const { error } = await supabase.storage.from("returns").upload(path, f);
        if (!error) {
          const { data } = supabase.storage.from("returns").getPublicUrl(path);
          urls.push(data.publicUrl);
        }
      }
      const { count: prior } = await supabase.from("returns").select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString());

      const aiResp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-return`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          product_name: order?.product_name,
          reason, notes,
          prior_returns_30d: prior ?? 0,
          has_media: urls.length > 0,
        }),
      });
      let ai: any = null;
      if (aiResp.ok) ai = await aiResp.json();
      else if (aiResp.status === 429) toast.error("AI rate-limited; saving without scoring.");
      else if (aiResp.status === 402) toast.error("AI credits exhausted; saving without scoring.");

      const { data: ret, error } = await supabase.from("returns").insert({
        user_id: user.id, order_id: orderIdSel,
        product_name: order?.product_name ?? "Unknown",
        reason, notes, media_urls: urls,
        status: ai?.recommended_action === "Reject" ? "rejected" : ai?.recommended_action === "Approve" ? "approved" : "pending",
        fraud_score: ai?.fraud_score, risk_level: ai?.risk_level,
        approval_confidence: ai?.approval_confidence,
        damage_assessment: ai?.damage_assessment,
        ai_explanation: ai?.ai_explanation,
        recommended_action: ai?.recommended_action,
        routing: ai?.routing,
      }).select().single();
      if (error) throw error;
      toast.success("Return submitted");
      nav({ to: "/returns/$id", params: { id: ret.id } });
    } catch (err) {
      toast.error("Could not submit return");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Start a return</h1>
        <p className="text-sm text-muted-foreground">Our AI will score your return in seconds and suggest the next step.</p>
      </div>
      <Card className="p-6 shadow-card">
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1.5">
            <Label>Order</Label>
            <Select value={orderIdSel} onValueChange={setOrderIdSel}>
              <SelectTrigger><SelectValue placeholder="Select an order" /></SelectTrigger>
              <SelectContent>{orders.map((o) => <SelectItem key={o.id} value={o.id}>{o.order_number} — {o.product_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Reason for return</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Additional notes</Label>
            <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell us more about the issue…" />
          </div>
          <div className="space-y-1.5">
            <Label>Upload photos / video (optional)</Label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-6 text-sm text-muted-foreground transition hover:border-primary/50">
              <Upload className="h-4 w-4" /> Click to upload (max 4 files)
              <Input type="file" multiple accept="image/*,video/*" className="hidden" onChange={onFiles} />
            </label>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-secondary px-2 py-1 text-xs">
                    {f.name}
                    <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" className="w-full gradient-primary text-navy hover:opacity-90" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing with AI…</> : <><Sparkles className="mr-2 h-4 w-4" /> Submit & analyze</>}
          </Button>
        </form>
      </Card>
    </div>
  );
}
