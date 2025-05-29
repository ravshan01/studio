"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { Waypoints } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Changed from "next/navigation"

export default function AdminLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Mock login logic
    // In a real app, you'd validate credentials and set a session/token
    console.log("Login attempt");
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-flex justify-center mb-4">
            <Waypoints className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("adminLogin", "Admin Login")}</CardTitle>
          <CardDescription>{t("adminWelcome", "Welcome back, please login to your account.")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t("username", "Username")}</Label>
              <Input id="username" type="text" placeholder="admin" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password", "Password")}</Label>
              <Input id="password" type="password" placeholder="********" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {t("login", "Login")}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-primary hover:underline">
              {t("backToMap", "← Back to Map View")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
