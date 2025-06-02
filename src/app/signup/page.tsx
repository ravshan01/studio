
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/contexts/language-context";
import { Mail, Lock, Waypoints, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const signUpFormSchema = z.object({
  email: z.string().email("invalidEmail").min(1, "emailRequired"),
  password: z.string().min(6, "passwordMinLength"),
  confirmPassword: z.string().min(1, "confirmPasswordRequired"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwordsDontMatch",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function UserSignUpPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: t("signUpSuccessTitle", "Account Created"), description: t("signUpSuccessDesc", "Welcome! You can now log in.") });
      router.push("/"); // Or router.push("/login") if preferred
    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = t("signUpErrorGeneric", "Failed to create account. Please try again.");
      if (error.code === "auth/email-already-in-use") {
        errorMessage = t("signUpErrorEmailInUse", "This email is already registered.");
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t("passwordMinLength", "Password should be at least 6 characters.");
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = t("signUpErrorAuthConfigNotFound", "Email/Password sign-in is not enabled in Firebase. Please contact the administrator or check Firebase console configuration.");
      }
      toast({
        title: t("signUpErrorTitle", "Sign Up Failed"),
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
            <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("signUp", "Create Account")}</CardTitle>
          <CardDescription>{t("signUpPageDesc", "Join to find and manage charging stations.")}</CardDescription>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t("confirmPassword", "Confirm Password")}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.confirmPassword && t(form.formState.errors.confirmPassword.message as any)}</FormMessage>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? t("creatingAccount", "Creating Account...") : t("signUp", "Create Account")}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {t("alreadyHaveAccount", "Already have an account?")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("login", "Login")}
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
