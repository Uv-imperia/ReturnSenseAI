import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Package, Undo2, ShieldAlert, BarChart3, Settings,
  Bell, Menu, Sparkles, LogOut, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Chatbot } from "./Chatbot";
import { useState } from "react";

const customerNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "My Orders", icon: Package },
  { to: "/returns/new", label: "New Return", icon: Undo2 },
  { to: "/settings", label: "Settings", icon: Settings },
];
const adminNav = [
  { to: "/admin", label: "Admin Console", icon: ShieldAlert },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

function NavItem({ to, label, icon: I, active }: { to: string; label: string; icon: typeof Package; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-sidebar-accent text-sidebar-primary"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      }`}
    >
      <I className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const loc = useLocation();
  const { isAdmin } = useAuth();
  const items = [...customerNav, ...(isAdmin ? adminNav : [])];
  return (
    <div className="flex h-full flex-col bg-sidebar p-3 text-sidebar-foreground">
      <Link to="/" className="flex items-center gap-2 px-2 py-3" onClick={onClose}>
        <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary"><Sparkles className="h-5 w-5 text-navy" /></div>
        <span className="font-display text-lg font-bold">ReturnSense</span>
      </Link>
      <nav className="mt-3 flex-1 space-y-1" onClick={onClose}>
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">Customer</div>
        {customerNav.map((n) => <NavItem key={n.to} {...n} active={loc.pathname === n.to} />)}
        {isAdmin && (
          <>
            <div className="mt-4 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">Admin</div>
            {adminNav.map((n) => <NavItem key={n.to} {...n} active={loc.pathname === n.to} />)}
          </>
        )}
      </nav>
      <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/70">
        <div className="flex items-center gap-1.5 font-semibold text-sidebar-foreground"><Bot className="h-3.5 w-3.5 text-primary" /> AI Assistant</div>
        <p className="mt-1">Tap the chat button anywhere to get instant return help.</p>
      </div>
    </div>
  );
}

function Topbar() {
  const { user, signOut } = useAuth();
  const initials = (user?.email ?? "U").slice(0, 2).toUpperCase();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8"><AvatarFallback className="bg-navy text-xs text-navy-foreground">{initials}</AvatarFallback></Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="hidden md:block"><Sidebar /></aside>
      <div className="flex flex-col">
        <Topbar />
        <main className="flex-1 bg-secondary/30 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
      <Chatbot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
