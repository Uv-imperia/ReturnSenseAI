import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/app/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) return toast.error(error.message);
    setSent(true);
  };
  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure link." footer={<Link to="/login" className="underline">Back to sign in</Link>}>
      {sent ? (
        <p className="rounded-md border border-success/30 bg-success/10 p-4 text-sm">Check your inbox for the reset link.</p>
      ) : (
        <form onSubmit={handle} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button className="w-full gradient-primary text-navy hover:opacity-90">Send reset link</Button>
        </form>
      )}
    </AuthShell>
  );
}
