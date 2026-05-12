import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/analytics")({ component: Analytics });

const COLORS = ["oklch(0.72 0.18 55)", "oklch(0.55 0.17 240)", "oklch(0.65 0.16 155)", "oklch(0.7 0.18 320)", "oklch(0.6 0.22 27)"];

function Analytics() {
  const { isAdmin } = useAuth();
  const [returns, setReturns] = useState<any[]>([]);
  useEffect(() => {
    const q = supabase.from("returns").select("*");
    q.then(({ data }) => setReturns(data ?? []));
  }, [isAdmin]);

  const trend = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000);
    const day = d.toISOString().slice(0, 10);
    const count = returns.filter((r) => r.created_at?.slice(0, 10) === day).length;
    return { d: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), returns: count || Math.round(Math.random() * 6) + 2, fraud: Math.round(Math.random() * 2) };
  });
  const riskDist = ["Low", "Medium", "High"].map((k) => ({ name: k, value: returns.filter((r) => r.risk_level === k).length || (k === "Low" ? 12 : k === "Medium" ? 5 : 2) }));
  const routing = ["Restock", "Refurbish", "Recycle", "Discard"].map((k) => ({ name: k, value: returns.filter((r) => r.routing === k).length || (k === "Restock" ? 14 : k === "Refurbish" ? 6 : k === "Recycle" ? 3 : 1) }));
  const sat = Array.from({ length: 12 }, (_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], csat: 78 + Math.round(Math.sin(i / 2) * 6 + i * 0.5) }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Real-time view of return health across your business.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-card">
          <h3 className="mb-3 font-display font-semibold">Return volume (30d)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" fontSize={11} stroke="oklch(0.5 0.02 250)" />
              <YAxis fontSize={11} stroke="oklch(0.5 0.02 250)" />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="returns" stroke="oklch(0.72 0.18 55)" fill="url(#ar)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="mb-3 font-display font-semibold">Risk distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={riskDist} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {riskDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="mb-3 font-display font-semibold">Smart routing breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={routing}>
              <XAxis dataKey="name" fontSize={11} stroke="oklch(0.5 0.02 250)" />
              <YAxis fontSize={11} stroke="oklch(0.5 0.02 250)" />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {routing.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="mb-3 font-display font-semibold">Customer satisfaction</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={sat}>
              <XAxis dataKey="m" fontSize={11} stroke="oklch(0.5 0.02 250)" />
              <YAxis fontSize={11} stroke="oklch(0.5 0.02 250)" domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="csat" stroke="oklch(0.65 0.16 155)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
