import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ShieldAlert, Package, Users, AlertTriangle, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({ component: Admin });

function Admin() {
  const { isAdmin, loading, user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const { data } = await supabase.from("returns").select("*").order("created_at", { ascending: false }).limit(200);
    setRows(data ?? []);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (loading) return null;
  if (!isAdmin) return (
    <Card className="mx-auto max-w-xl p-8 text-center shadow-card">
      <ShieldAlert className="mx-auto h-10 w-10 text-warning" />
      <h2 className="mt-3 font-display text-xl font-bold">Admin only</h2>
      <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have admin access. Promote yourself in the database to use this console.</p>
      <Button className="mt-4 gradient-primary text-navy hover:opacity-90" onClick={async () => {
        if (!user) return;
        const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
        if (error) toast.error(error.message); else { toast.success("Granted (demo). Reload to apply."); }
      }}>Grant admin (demo)</Button>
    </Card>
  );

  const filtered = rows.filter((r) => r.product_name.toLowerCase().includes(q.toLowerCase()));
  const fraud = rows.filter((r) => r.risk_level === "High").length;
  const pending = rows.filter((r) => r.status === "pending").length;

  const exportCsv = () => {
    const header = ["id","product","reason","risk","fraud_score","status","created_at"].join(",");
    const lines = filtered.map((r) => [r.id, JSON.stringify(r.product_name), JSON.stringify(r.reason), r.risk_level ?? "", r.fraud_score ?? "", r.status, r.created_at].join(","));
    const blob = new Blob([header + "\n" + lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "returns.csv"; a.click();
  };

  const setStatus = async (id: string, status: string) => {
    await supabase.from("returns").update({ status }).eq("id", id);
    load();
  };

  const stats = [
    { l: "Total returns", v: rows.length, i: Package },
    { l: "Pending", v: pending, i: AlertTriangle },
    { l: "Fraud alerts", v: fraud, i: ShieldAlert },
    { l: "Customers", v: new Set(rows.map(r => r.user_id)).size, i: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Console</h1>
          <p className="text-sm text-muted-foreground">Manage returns, fraud alerts, and warehouse routing.</p>
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-1.5 h-4 w-4" /> Export CSV</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.l} className="p-5 shadow-card">
            <div className="flex items-center justify-between text-sm text-muted-foreground">{s.l}<s.i className="h-4 w-4" /></div>
            <div className="mt-2 font-display text-2xl font-bold">{s.v}</div>
          </Card>
        ))}
      </div>
      <Card className="shadow-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-display font-semibold">All returns</div>
          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Routing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, 50).map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.product_name}</TableCell>
                <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                <TableCell><Badge variant={r.risk_level === "High" ? "destructive" : r.risk_level === "Medium" ? "default" : "outline"}>{r.risk_level ?? "—"}</Badge></TableCell>
                <TableCell>{r.fraud_score ?? "—"}</TableCell>
                <TableCell>{r.routing ?? "—"}</TableCell>
                <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                <TableCell className="space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "approved")}>Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "rejected")}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No returns yet.</div>}
      </Card>
    </div>
  );
}
