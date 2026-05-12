import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Sparkles, ShieldCheck, BarChart3, Bot, PackageCheck, Recycle,
  ArrowRight, Check, Zap, Brain, Workflow, Star,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "ReturnSense AI — Cut return losses with AI" },
      { name: "description", content: "AI-powered return management: fraud scoring, smart routing, customer chatbot, real-time analytics." },
    ],
  }),
});

const trendData = Array.from({ length: 12 }, (_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  returns: 220 + Math.round(Math.sin(i / 1.6) * 60 + i * 8),
  fraud: 18 + Math.round(Math.cos(i / 2) * 6 + i * 0.4),
}));

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary shadow-card">
            <Sparkles className="h-5 w-5 text-navy" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">ReturnSense<span className="text-primary"> AI</span></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#analytics" className="hover:text-foreground">Analytics</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
          <Button asChild size="sm" className="gradient-primary text-navy hover:opacity-90"><Link to="/signup">Get started</Link></Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 md:grid-cols-2 md:pt-24">
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="mb-5 w-fit border-primary/40 bg-primary/10 text-foreground">
            <Sparkles className="mr-1.5 h-3 w-3 text-primary" /> Powered by Lovable AI
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            Turn return losses into <span className="text-primary">recovered revenue</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            ReturnSense AI scores every return for fraud, automates inspection,
            and routes items to restock, refurbish, recycle, or discard — in seconds.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gradient-primary text-navy hover:opacity-90">
              <Link to="/signup">Start free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">View demo</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> No credit card</div>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> 5-minute setup</div>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Enterprise-ready</div>
          </div>
        </div>
        <div className="relative">
          <Card className="overflow-hidden border-border/60 shadow-elevated">
            <div className="flex items-center justify-between gap-2 border-b border-border bg-navy px-4 py-2.5 text-navy-foreground">
              <div className="flex items-center gap-2 text-sm font-medium"><BarChart3 className="h-4 w-4 text-primary" /> Returns dashboard</div>
              <div className="flex gap-1"><span className="h-2 w-2 rounded-full bg-destructive/70" /><span className="h-2 w-2 rounded-full bg-warning" /><span className="h-2 w-2 rounded-full bg-success" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {[
                { l: "Returns", v: "12,408", d: "+8.2%" },
                { l: "Fraud blocked", v: "$48.2k", d: "+22%" },
                { l: "Auto-routed", v: "94%", d: "+11%" },
              ].map((k) => (
                <div key={k.l} className="rounded-lg border border-border bg-secondary/40 p-3">
                  <div className="text-xs text-muted-foreground">{k.l}</div>
                  <div className="font-display text-xl font-bold">{k.v}</div>
                  <div className="text-xs text-success">{k.d}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" stroke="oklch(0.5 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="returns" stroke="oklch(0.72 0.18 55)" strokeWidth={2} fill="url(#g1)" />
                  <Line type="monotone" dataKey="fraud" stroke="oklch(0.6 0.22 27)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { i: ShieldCheck, t: "AI fraud detection", d: "Score every return 0-100 with explanations grounded in customer history and media evidence." },
  { i: Bot, t: "Customer chatbot", d: "Resolve issues before returns happen. Cut return rates by up to 30%." },
  { i: Workflow, t: "Smart routing", d: "Auto-route to Restock, Refurbish, Recycle, or Discard based on AI damage assessment." },
  { i: BarChart3, t: "Live analytics", d: "Drill into volume, categories, fraud, and warehouse load with beautiful charts." },
  { i: PackageCheck, t: "Inspection automation", d: "Photos and video analyzed instantly. No more manual triage queues." },
  { i: Recycle, t: "Sustainability tracking", d: "Track items diverted from landfill. Hit ESG targets transparently." },
];

function Features() {
  return (
    <section id="features" className="border-t border-border/60 bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">Features</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Everything your returns desk needs</h2>
          <p className="mt-3 text-muted-foreground">An AI command center built for the messy reality of e-commerce returns.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ i: I, t, d }) => (
            <Card key={t} className="group p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated">
              <div className="grid h-11 w-11 place-items-center rounded-lg gradient-primary text-navy">
                <I className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { i: Zap, t: "Customer files return", d: "They snap a photo, pick a reason, and submit in 20 seconds." },
    { i: Brain, t: "AI scores the return", d: "Fraud risk, damage class, and recommended action — instantly." },
    { i: Workflow, t: "Auto-route the item", d: "Restock, refurbish, recycle, or discard. No queue, no waiting." },
  ];
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">How it works</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">From return request to resolution in seconds</h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(({ i: I, t, d }, idx) => (
            <li key={t} className="relative rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="absolute -top-3 -right-3 grid h-9 w-9 place-items-center rounded-full bg-navy font-display text-sm font-bold text-primary">{idx + 1}</div>
              <I className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AnalyticsPreview() {
  return (
    <section id="analytics" className="border-y border-border/60 bg-navy py-20 text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/50 bg-primary/10 text-primary">Analytics</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Charts that move the needle</h2>
          <p className="mt-3 text-white/70">Recharts-powered dashboards for return volume, fraud distribution, category mix, and warehouse load.</p>
          <ul className="mt-6 space-y-2.5 text-sm text-white/85">
            {["Return volume over time", "Fraud distribution by category", "Customer satisfaction trend", "Warehouse processing load"].map((x) => (
              <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {x}</li>
            ))}
          </ul>
        </div>
        <Card className="border-white/10 bg-white/5 p-4 backdrop-blur">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.5)" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="returns" stroke="oklch(0.72 0.18 55)" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { n: "Maya R.", r: "Head of Operations, Northwind", q: "We cut fraudulent refunds by 41% in the first month. The AI explanations make policy decisions defensible." },
    { n: "Daniel K.", r: "VP Supply Chain, Loop & Co.", q: "Smart routing alone saved us six FTEs in the warehouse. ROI was obvious in week two." },
    { n: "Priya S.", r: "Customer Experience, Atlas", q: "The chatbot deflects roughly 28% of return requests with a real fix. Customers love it." },
  ];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">Loved by ops teams</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Built for teams that hate guesswork</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t.n} className="p-6 shadow-card">
              <div className="flex gap-0.5 text-primary">{[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-sm leading-relaxed">"{t.q}"</p>
              <div className="mt-4 text-sm font-semibold">{t.n}</div>
              <div className="text-xs text-muted-foreground">{t.r}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { n: "Starter", p: "$0", d: "For small shops", f: ["Up to 100 returns/mo", "Basic AI scoring", "Customer chatbot"] },
    { n: "Growth", p: "$199", d: "Most popular", f: ["Up to 5,000 returns/mo", "Smart routing", "Full analytics", "Priority support"], hot: true },
    { n: "Enterprise", p: "Custom", d: "For large catalogs", f: ["Unlimited returns", "SSO & RBAC", "Dedicated CSM", "Custom integrations"] },
  ];
  return (
    <section id="pricing" className="border-t border-border/60 bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">Pricing</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Simple, usage-based</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.n} className={`p-7 shadow-card ${t.hot ? "border-primary ring-2 ring-primary/30" : ""}`}>
              {t.hot && <Badge className="mb-2 gradient-primary text-navy">Most popular</Badge>}
              <div className="font-display text-xl font-bold">{t.n}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{t.p}</span>
                {t.p !== "Custom" && <span className="text-sm text-muted-foreground">/mo</span>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.d}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {t.f.map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-success" /> {x}</li>)}
              </ul>
              <Button asChild className={`mt-6 w-full ${t.hot ? "gradient-primary text-navy hover:opacity-90" : ""}`} variant={t.hot ? "default" : "outline"}>
                <Link to="/signup">Get started</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "How accurate is the fraud detection?", a: "Our AI combines customer history, media evidence, and contextual signals. Most teams see 30–45% reduction in fraudulent refunds within 60 days." },
    { q: "Do I need to integrate my e-commerce platform?", a: "ReturnSense AI works standalone for return management. Optional integrations with Shopify, BigCommerce, and custom backends are available on Growth and Enterprise plans." },
    { q: "What about data privacy?", a: "All data is encrypted in transit and at rest. Role-based access control ensures customers only see their own data, and admins see what they're authorized to." },
    { q: "Can I export analytics?", a: "Yes — every chart and table can be exported to CSV from the analytics dashboard." },
  ];
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <Badge variant="outline" className="mb-3">FAQ</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {items.map((it) => (
            <AccordionItem key={it.q} value={it.q}>
              <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Card className="overflow-hidden border-0 gradient-navy p-10 text-navy-foreground shadow-elevated md:p-14">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to stop bleeding on returns?</h2>
              <p className="mt-2 text-white/70">Spin up your dashboard in 5 minutes. Free forever for small shops.</p>
            </div>
            <Button asChild size="lg" className="gradient-primary text-navy hover:opacity-90">
              <Link to="/signup">Start free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-navy py-10 text-navy-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded gradient-primary"><Sparkles className="h-4 w-4 text-navy" /></div>
          <span className="font-display font-semibold">ReturnSense AI</span>
        </div>
        <div className="text-white/60">© {new Date().getFullYear()} ReturnSense AI. Built with Lovable.</div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AnalyticsPreview />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
