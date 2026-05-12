import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { seedDemoOrders } from "@/lib/demo-seed";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Undo2, ShieldCheck, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ orders: number; returns: number; pending: number; saved: number } | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await seedDemoOrders(user.id);
      const [o, r, p] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("returns").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("returns").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
      ]);
      setStats({ orders: o.count ?? 0, returns: r.count ?? 0, pending: p.count ?? 0, saved: 248 });
      const { data } = await supabase.from("returns").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
      setRecent(data ?? []);
    })();
  }, [user]);

  const cards = [
    { l: "Orders", v: stats?.orders ?? "—", icon: Package, color: "text-chart-2" },
    { l: "Returns filed", v: stats?.returns ?? "—", icon: Undo2, color: "text-chart-1" },
    { l: "Pending review", v: stats?.pending ?? "—", icon: ShieldCheck, color: "text-warning" },
    { l: "Avg savings", v: stats ? `$${stats.saved}` : "—", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="overflow-hidden border-0 gradient-navy p-6 text-navy-foreground md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> AI-powered
            </Badge>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Welcome back 👋</h1>
            <p className="mt-1 text-white/70">Here's what's happening with your orders and returns.</p>
          </div>
          <Button asChild size="lg" className="gradient-primary text-navy hover:opacity-90">
            <Link to="/returns/new">File a return <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.l} className="p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{c.l}</div>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{stats ? c.v : <Skeleton className="h-7 w-16" />}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent returns</h2>
            <Button variant="ghost" size="sm" asChild><Link to="/orders">View all</Link></Button>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No returns yet. <Link to="/returns/new" className="text-primary underline">Start one →</Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">{r.product_name}</div>
                    <div className="text-xs text-muted-foreground">{r.reason}</div>
                  </div>
                  <Badge variant={r.risk_level === "High" ? "destructive" : r.risk_level === "Medium" ? "default" : "outline"}>
                    {r.risk_level ?? r.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">Quick actions</h2>
          <div className="grid gap-3">
            <Link to="/orders" className="flex items-center justify-between rounded-lg border border-border p-4 transition hover:border-primary/50 hover:shadow-card">
              <div className="flex items-center gap-3"><Package className="h-5 w-5 text-chart-2" /> Browse my orders</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/returns/new" className="flex items-center justify-between rounded-lg border border-border p-4 transition hover:border-primary/50 hover:shadow-card">
              <div className="flex items-center gap-3"><Undo2 className="h-5 w-5 text-primary" /> Start a new return</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/settings" className="flex items-center justify-between rounded-lg border border-border p-4 transition hover:border-primary/50 hover:shadow-card">
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-success" /> Account settings</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
