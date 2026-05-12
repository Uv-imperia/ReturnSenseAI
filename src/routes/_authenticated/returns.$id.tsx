import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ShieldAlert, Workflow, Brain, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/returns/$id")({ component: ReturnDetail });

function ReturnDetail() {
  const { id } = Route.useParams();
  const [r, setR] = useState<any>(null);
  useEffect(() => { supabase.from("returns").select("*").eq("id", id).single().then(({ data }) => setR(data)); }, [id]);
  if (!r) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const riskColor = r.risk_level === "High" ? "destructive" : r.risk_level === "Medium" ? "default" : "outline";
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2"><Link to="/dashboard"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Link></Button>
      <Card className="overflow-hidden border-0 gradient-navy p-6 text-navy-foreground">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/40 bg-primary/10 text-primary">Return #{r.id.slice(0,8)}</Badge>
            <h1 className="font-display text-2xl font-bold">{r.product_name}</h1>
            <p className="text-white/70">{r.reason}</p>
          </div>
          <Badge variant={riskColor as any} className="text-base">{r.risk_level ?? "Pending"}</Badge>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldAlert className="h-4 w-4 text-destructive" /> Fraud score</div>
          <div className="mt-2 font-display text-3xl font-bold">{r.fraud_score ?? "—"}<span className="text-base text-muted-foreground">/100</span></div>
          {r.fraud_score != null && <Progress value={r.fraud_score} className="mt-3" />}
        </Card>
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><PackageCheck className="h-4 w-4 text-success" /> Approval confidence</div>
          <div className="mt-2 font-display text-3xl font-bold">{r.approval_confidence ?? "—"}%</div>
          {r.approval_confidence != null && <Progress value={r.approval_confidence} className="mt-3" />}
        </Card>
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Workflow className="h-4 w-4 text-chart-2" /> Smart routing</div>
          <div className="mt-2 font-display text-2xl font-bold">{r.routing ?? "Pending"}</div>
          <div className="mt-1 text-xs text-muted-foreground">Recommended action: {r.recommended_action ?? "—"}</div>
        </Card>
      </div>
      <Card className="p-6 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Brain className="h-4 w-4 text-primary" /> AI explanation</div>
        <p className="text-sm leading-relaxed text-muted-foreground">{r.ai_explanation ?? "Awaiting analysis."}</p>
        {r.damage_assessment && <p className="mt-3 text-sm"><span className="font-semibold">Damage:</span> {r.damage_assessment}</p>}
      </Card>
      {r.media_urls?.length > 0 && (
        <Card className="p-6 shadow-card">
          <div className="mb-3 text-sm font-semibold">Uploaded evidence</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {r.media_urls.map((u: string) => (
              <a key={u} href={u} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
                <img src={u} alt="" className="h-full w-full object-cover" />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
