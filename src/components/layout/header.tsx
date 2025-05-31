
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { Waypoints, Home } from "lucide-react"; // Added Home icon

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Waypoints className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg">{t("appName", "ElectroCar Charging")}</span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/">
              <Home />
              {t("home", "Home")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/login">{t("adminLogin", "Admin Login")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
