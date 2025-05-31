
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ListChecks, LogOut, Menu, Users, Map } from "lucide-react"; // Added Map icon
import { useLanguage } from "@/contexts/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/admin/dashboard", label: t("dashboard", "Dashboard"), icon: LayoutDashboard },
    { href: "/admin/stations", label: t("manageStations", "Stations"), icon: ListChecks },
    // Add more admin navigation items here
  ];

  return (
    <div className="min-h-screen w-full flex">
      <aside className="hidden md:flex flex-col w-64 border-r bg-background p-4 space-y-4">
        <div className="text-2xl font-bold text-primary mb-6">{t("adminPanel", "Admin Panel")}</div>
        <nav className="flex-grow space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              {t("exitAdmin", "Exit Admin")}
            </Link>
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium mt-8">
              <div className="text-xl font-bold text-primary mb-4">{t("adminPanel", "Admin Panel")}</div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                      pathname === item.href && "text-foreground bg-muted rounded-md py-2"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <Link
                    href="/"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground mt-auto"
                  >
                    <LogOut className="h-5 w-5" />
                     {t("exitAdmin", "Exit Admin")}
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Map className="h-4 w-4" />
                {t("viewMap", "View Map")}
              </Link>
            </Button>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
