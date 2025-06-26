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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useEffect, useState } from "react";

interface FeedbackFormProps {
    type: "complaint" | "suggestion";
}

export function FeedbackForm({ type }: FeedbackFormProps) {
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const { translate, direction } = useLocale();
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        name: z
            .string()
            .min(2, {
                message: translate("الاسم يجب أن يتكون من حرفين على الأقل.", "Name must be at least 2 characters."),
            }),
        email: z
            .string()
            .email({
                message: translate("الرجاء إدخال بريد إلكتروني صحيح.", "Please enter a valid email address."),
            }),
        message: z
            .string()
            .min(10, {
                message: translate("الرسالة يجب أن تتكون من 10 أحرف على الأقل.", "Message must be at least 10 characters."),
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            form.reset({
                name: user.name,
                email: user.email,
                message: "",
            });
        }
    }, [isAuthenticated, user, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5086/api/Feedback', {


                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, type }), // إضافة نوع الرسالة
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: translate("تم الإرسال بنجاح!", "Submitted Successfully!"),
                    description: translate("شكرًا لك على مشاركة رأيك معنا.", "Thank you for sharing your feedback with us."),
                });

                form.reset({
                    name: form.getValues("name"),
                    email: form.getValues("email"),
                    message: "",
                });
            } else {
                toast({
                    title: translate("حدث خطأ!", "Something went wrong!"),
                    description: data.message || translate("تعذر إرسال الرسالة.", "Failed to submit feedback."),
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: translate("خطأ في الشبكة", "Network Error"),
                description: translate("حدث خطأ أثناء إرسال البيانات.", "An error occurred while submitting your message."),
                variant: "destructive",
            });
        }

        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-body">{translate("الاسم", "Name")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={translate("اسمك الكامل", "Your Full Name")}
                                        {...field}
                                        className="font-body"
                                        dir={direction}
                                        disabled={isAuthenticated && !!user}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-body">{translate("البريد الإلكتروني", "Email")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="example@mail.com"
                                        {...field}
                                        className="font-body"
                                        type="email"
                                        dir={direction}
                                        disabled={isAuthenticated && !!user}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-body">
                                {type === "complaint"
                                    ? translate("تفاصيل الشكوى", "Complaint Details")
                                    : translate("تفاصيل الاقتراح", "Suggestion Details")}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={translate("اكتب رسالتك هنا...", "Write your message here...")}
                                    {...field}
                                    className="font-body"
                                    rows={5}
                                    dir={direction}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
                    disabled={isLoading}
                >
                    <Send className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                    {isLoading ? translate("جاري الإرسال...", "Sending...") : translate("إرسال", "Send")}
                </Button>
            </form>
        </Form>
    );
}
