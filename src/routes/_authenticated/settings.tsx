import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({ component: Settings });

function Settings() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name").eq("id", user.id).single().then(({ data }) => setName(data?.full_name ?? ""));
    setDark(document.documentElement.classList.contains("dark"));
  }, [user]);

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success("Saved");
  };
  const toggleDark = (v: boolean) => { setDark(v); document.documentElement.classList.toggle("dark", v); };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences.</p>
      </div>
      <Card className="p-6 shadow-card">
        <h3 className="mb-4 font-display font-semibold">Profile</h3>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
          <div className="space-y-1.5"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <Button onClick={save} className="gradient-primary text-navy hover:opacity-90">Save changes</Button>
        </div>
      </Card>
      <Card className="p-6 shadow-card">
        <h3 className="mb-4 font-display font-semibold">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Dark mode</div>
            <div className="text-xs text-muted-foreground">Switch between light and dark themes.</div>
          </div>
          <Switch checked={dark} onCheckedChange={toggleDark} />
        </div>
      </Card>
      <Card className="border-destructive/30 p-6 shadow-card">
        <h3 className="mb-2 font-display font-semibold text-destructive">Danger zone</h3>
        <p className="mb-4 text-sm text-muted-foreground">Sign out of your account.</p>
        <Button variant="destructive" onClick={() => signOut()}>Sign out</Button>
      </Card>
    </div>
  );
}
