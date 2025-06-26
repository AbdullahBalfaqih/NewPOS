
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useState } from "react"; // Added for loading state

export function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams(); // For redirect
    const { toast } = useToast();
    const { translate, direction } = useLocale();
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        usernameOrEmail: z.string().min(1, { message: translate("اسم المستخدم أو البريد الإلكتروني مطلوب.", "Username or Email is required.") }),
        password: z.string().min(1, { message: translate("كلمة المرور مطلوبة.", "Password is required.") }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            usernameOrEmail: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok && data.user) {
                login(data.user);
                toast({
                    title: translate("تم تسجيل الدخول بنجاح!", "Logged in successfully!"),
                    description: translate(`مرحبًا بعودتك، ${data.user.name}.`, `Welcome back, ${data.user.name}.`),
                });
                const redirectUrl = searchParams.get('redirect') || "/menu";
                router.push(redirectUrl);
            } else {
                toast({
                    variant: "destructive",
                    title: translate("فشل تسجيل الدخول", "Login Failed"),
                    description: data.message || translate("اسم المستخدم أو كلمة المرور غير صحيحة.", "Invalid username or password."),
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                variant: "destructive",
                title: translate("خطأ", "Error"),
                description: translate("حدث خطأ أثناء محاولة تسجيل الدخول. الرجاء المحاولة مرة أخرى.", "An error occurred while trying to log in. Please try again."),
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="usernameOrEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-body">{translate("اسم المستخدم أو البريد الإلكتروني", "Username or Email")}</FormLabel>
                            <FormControl>
                                <Input placeholder={translate("اسم المستخدم أو البريد الإلكتروني", "Username or Email")} {...field} className="font-body" dir={direction} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-body">{translate("كلمة المرور", "Password")}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder={translate("كلمة المرور", "Password")} {...field} className="font-body" dir={direction} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md" disabled={isLoading}>
                    <LogIn className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {isLoading ? translate("جاري تسجيل الدخول...", "Logging in...") : translate("تسجيل الدخول", "Login")}
                </Button>
            </form>
        </Form>
    );
}
