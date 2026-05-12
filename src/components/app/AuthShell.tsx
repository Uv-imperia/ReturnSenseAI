import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden gradient-navy p-10 text-navy-foreground md:flex md:flex-col md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary"><Sparkles className="h-5 w-5 text-navy" /></div>
          <span className="font-display text-lg font-bold">ReturnSense AI</span>
        </Link>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">Stop bleeding on returns. <span className="text-primary">Start recovering revenue.</span></h2>
          <p className="mt-3 max-w-md text-white/70">Score every return for fraud, automate inspection, and route items intelligently — all in one AI command center.</p>
        </div>
        <div className="text-xs text-white/50">© {new Date().getFullYear()} ReturnSense AI</div>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 md:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary"><Sparkles className="h-4 w-4 text-navy" /></div>
            <span className="font-display font-bold">ReturnSense AI</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
