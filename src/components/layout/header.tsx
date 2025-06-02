
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Waypoints, Search as SearchIcon, LogIn, UserPlus, LogOut, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  showSearch?: boolean;
}

export function Header({ searchTerm, onSearchChange, showSearch = false }: HeaderProps) {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: t("logoutSuccessTitle", "Logged out"), description: t("logoutSuccessDesc", "You have been successfully logged out.") });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: t("logoutErrorTitle", "Logout Failed"), description: String(error), variant: "destructive" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex h-16 items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Waypoints className="h-7 w-7 text-primary" />
        <span className="font-bold text-lg hidden sm:inline">{t("appName", "ElectroCar Charging")}</span>
      </Link>

      {showSearch && onSearchChange ? (
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md relative mx-2 sm:mx-4">
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
      
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSelector />
        <ThemeToggle />
        {!loading && (
          <>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t("userMenu", "User Menu")}>
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="truncate max-w-[200px]">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem onClick={() => router.push('/profile')}>{t("profile", "Profile")}</DropdownMenuItem> */}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout", "Logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t("login", "Login")}</span>
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/signup">
                    <UserPlus className="mr-1 sm:mr-2 h-4 w-4" />
                     <span className="hidden sm:inline">{t("signUp", "Sign Up")}</span>
                  </Link>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
