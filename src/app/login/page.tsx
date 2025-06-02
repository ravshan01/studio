
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/contexts/language-context";
import { Mail, Lock, Waypoints } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const loginFormSchema = z.object({
  email: z.string().email("invalidEmail").min(1, "emailRequired"),
  password: z.string().min(1, "passwordRequired"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function UserLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: t("loginSuccessTitle", "Login Successful"), description: t("loginSuccessDesc", "Welcome back!") });
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = t("loginErrorGeneric", "Failed to login. Please check your credentials.");
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = t("loginErrorInvalidCredentials", "Invalid email or password.");
      }
      toast({
        title: t("loginErrorTitle", "Login Failed"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-flex justify-center mb-4">
            <Waypoints className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("login", "Login")}</CardTitle>
          <CardDescription>{t("loginPageDesc", "Access your account to find charging stations.")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t("email", "Email")}
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@example.com" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.email && t(form.formState.errors.email.message as any)}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t("password", "Password")}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.password && t(form.formState.errors.password.message as any)}</FormMessage>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? t("loggingIn", "Logging in...") : t("login", "Login")}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {t("dontHaveAccount", "Don't have an account?")}{" "}
            <Link href="/signup" className="text-primary hover:underline">
              {t("signUp", "Sign Up")}
            </Link>
          </div>
           <div className="mt-2 text-center text-sm">
             <Link href="/" className="text-muted-foreground hover:text-primary hover:underline">
              {t("backToMap", "← Back to Map View")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
