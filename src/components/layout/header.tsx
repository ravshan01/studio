
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { Waypoints, Home, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  showSearch?: boolean;
}

export function Header({ searchTerm, onSearchChange, showSearch = false }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6 shrink-0">
          <Waypoints className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg hidden sm:inline">{t("appName", "ElectroCar Charging")}</span>
        </Link>

        {showSearch && onSearchChange && (
          <div className="flex-grow sm:flex-grow-0 sm:w-full sm:max-w-xs md:max-w-sm lg:max-w-md relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholderMap", "Search stations...")}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full pl-10" // Added padding for icon
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <LanguageSelector />
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/">
              <Home className="h-4 w-4" />
              {t("home", "Home")}
            </Link>
          </Button>
           <Button asChild variant="outline" size="sm">
            <Link href="/admin/login">{t("adminLogin", "Admin Login")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
