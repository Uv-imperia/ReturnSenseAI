import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/app/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: ResetPage });

function ResetPage() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    nav({ to: "/dashboard" });
  };
  return (
    <AuthShell title="Set a new password">
      <form onSubmit={handle} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="p">New password</Label>
          <Input id="p" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="w-full gradient-primary text-navy hover:opacity-90">Update password</Button>
      </form>
    </AuthShell>
  );
}
