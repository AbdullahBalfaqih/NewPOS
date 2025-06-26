
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const yemeniPhoneRegex = /^(70|71|73|77|78)\d{7}$/;

export function SignupForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { translate, direction } = useLocale();

  const formSchema = z.object({
    name: z.string().min(2, { message: translate("الاسم يجب أن يتكون من حرفين على الأقل.", "Name must be at least 2 characters.") }),
    phone: z.string().regex(yemeniPhoneRegex, { message: translate("رقم الهاتف يجب أن يكون رقم يمني صحيح (9 أرقام ويبدأ بـ 70, 71, 73, 77, أو 78).", "Phone number must be a valid Yemeni number (9 digits, starting with 70, 71, 73, 77, or 78).") }),
    email: z.string().email({ message: translate("الرجاء إدخال بريد إلكتروني صحيح.", "Please enter a valid email address.") }),
    username: z.string().min(3, { message: translate("اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل.", "Username must be at least 3 characters.") }),
    password: z.string().min(6, { message: translate("كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.", "Password must be at least 6 characters.") }),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      username: "",
      password: "",
    },
  });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    surname: values.phone, // ← ضع الهاتف في surname
                    email: values.email,
                    userName: values.username,
                    password: values.password,
                }),

            });

            const data = await response.json();

            if (response.ok && data.success) {
                // تسجيل الدخول بعد نجاح الإنشاء
                login({
                    id: data.user?.id ?? "",
                    name: data.user?.name ?? values.name,
                    username: data.user?.username ?? values.username,
                    email: data.user?.email ?? values.email,
                    phone: data.user?.phone ?? values.phone,
                });


                toast({
                    title: translate("تم إنشاء الحساب بنجاح!", "Account created successfully!"),
                    description: translate(`مرحبًا بك، ${values.name}. تم تسجيل دخولك تلقائيًا.`, `Welcome, ${values.name}. You have been logged in automatically.`),
                });

                router.push("/menu");
            } else {
                toast({
                    variant: "destructive",
                    title: translate("فشل إنشاء الحساب", "Signup Failed"),
                    description: data.message || translate("حدث خطأ أثناء إنشاء الحساب.", "An error occurred during signup."),
                });
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast({
                variant: "destructive",
                title: translate("خطأ", "Error"),
                description: translate("حدث خطأ غير متوقع. حاول مرة أخرى.", "An unexpected error occurred. Please try again."),
            });
        }
    }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-body">{translate("الاسم الكامل", "Full Name")}</FormLabel>
              <FormControl>
                <Input placeholder={translate("مثال: علي محمد", "e.g.: Ali Mohamed")} {...field} className="font-body" dir={direction}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-body">{translate("رقم الهاتف اليمني", "Yemeni Phone Number")}</FormLabel>
              <FormControl>
                <Input placeholder={translate("مثال: 771234567", "e.g.: 771234567")} {...field} className="font-body" type="tel" dir={direction}/>
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
                <Input placeholder="example@mail.com" {...field} className="font-body" type="email" dir={direction}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-body">{translate("اسم المستخدم", "Username")}</FormLabel>
              <FormControl>
                <Input placeholder={translate("اختر اسم مستخدم فريد", "Choose a unique username")} {...field} className="font-body" dir={direction}/>
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
                <Input type="password" placeholder={translate("كلمة مرور قوية", "Strong password")} {...field} className="font-body" dir={direction}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md mt-6" disabled={form.formState.isSubmitting}>
          <UserPlus className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          {form.formState.isSubmitting ? translate("جاري إنشاء الحساب...", "Creating account...") : translate("إنشاء حساب", "Create Account")}
        </Button>
      </form>
    </Form>
  );
}
