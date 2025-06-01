
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { Waypoints, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  showSearch?: boolean;
}

export function Header({ searchTerm, onSearchChange, showSearch = false }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex h-16 items-center justify-between px-6">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Waypoints className="h-7 w-7 text-primary" />
        <span className="font-bold text-lg hidden sm:inline">{t("appName", "ElectroCar Charging")}</span>
      </Link>

      {/* Center: Search (conditionally rendered) or Spacer */}
      {showSearch && onSearchChange ? (
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md relative mx-2 sm:mx-4"> {/* Adjusted width and margins for centering */}
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholderMap", "Search stations...")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full pl-10"
          />
        </div>
      ) : (
        <div className="flex-grow"></div> 
      )}
      
      {/* Right: Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}
