import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Undo2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/orders")({ component: Orders });

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("user_id", user.id).order("ordered_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
  }, [user]);
  const filtered = orders.filter((o) => o.product_name.toLowerCase().includes(q.toLowerCase()) || o.order_number.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground">Browse and request returns on past purchases.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search orders…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-3">
        {filtered.map((o) => (
          <Card key={o.id} className="flex flex-wrap items-center gap-4 p-4 shadow-card">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-secondary text-muted-foreground"><Package className="h-6 w-6" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold">{o.product_name}</div>
                <Badge variant="outline">{o.category}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{o.order_number} · ${Number(o.price).toFixed(2)} · {new Date(o.ordered_at).toLocaleDateString()}</div>
            </div>
            <Badge className="bg-success text-success-foreground">{o.status}</Badge>
            <Button asChild size="sm" variant="outline">
              <Link to="/returns/new" search={{ orderId: o.id } as any}><Undo2 className="mr-1.5 h-4 w-4" /> Return</Link>
            </Button>
          </Card>
        ))}
        {filtered.length === 0 && <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No orders found.</div>}
      </div>
    </div>
  );
}
