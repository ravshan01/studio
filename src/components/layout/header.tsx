
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase";
import { signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Waypoints, LogIn, LogOut, UserCircle, Heart } from "lucide-react"; // Added Heart
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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: t("loginSuccessTitle", "Login Successful"), description: t("loginSuccessDesc", "Welcome!") });
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Google Sign-In popup closed by user.");
        return; 
      }
      if (error.code === 'auth/cancelled-popup-request') {
        console.warn("Login popup request cancelled, possibly due to another popup.");
        return; 
      }

      let errorMessage = t("loginErrorGeneric", "Failed to login with Google. Please try again.");
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = t("loginErrorGoogleDiffCredential", "An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.");
      } else if (error.code === 'auth/popup-already-handled') {
        errorMessage = t("loginErrorGooglePopupHandled", "Login process was already active. Please complete or cancel the existing login attempt.");
      }
      
      toast({
        title: t("loginErrorTitle", "Login Failed"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

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
        <span className="font-semibold text-lg hidden sm:inline-block">{t("appName", "ElectroCar Charging")}</span>
      </Link>

      {showSearch && onSearchChange && (
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md relative mx-2 sm:mx-4">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            type="search"
            placeholder={t("searchPlaceholderMap", "Search stations...")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full pl-10"
          />
        </div>
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
                  <DropdownMenuLabel className="truncate max-w-[200px]">{user.displayName || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/favorites')}>
                    <Heart className="mr-2 h-4 w-4" />
                    {t("myFavorites", "My Favorites")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout", "Logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleGoogleSignIn} 
                aria-label={t("loginWithGoogle", "Sign in with Google")}
              >
                <LogIn className="h-5 w-5" />
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
