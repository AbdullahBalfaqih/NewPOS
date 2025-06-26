
"use client";

import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, LogIn, Utensils, ShoppingCart, Banknote, Clock } from 'lucide-react';
import React from 'react';

export default function InstructionsPage() {
    const { translate, direction } = useLocale();

    const timelineSteps = [
        {
            icon: <UserPlus className="h-6 w-6 text-accent" />,
            titleAr: "أولاً: إنشاء حساب جديد",
            titleEn: "First: Create a New Account",
            descriptionAr: "ابدأ بإنشاء حسابك الخاص. قم بتعبئة معلوماتك الشخصية وبريدك الإلكتروني لتكون على اطلاع دائم بآخر أخبارنا وعروضنا الحصرية.",
            descriptionEn: "Start by creating your own account. Fill in your personal information and email to stay updated with our latest news and exclusive offers.",
        },
        {
            icon: <LogIn className="h-6 w-6 text-accent" />,
            titleAr: "ثانياً: تسجيل الدخول",
            titleEn: "Second: Login",
            descriptionAr: "بعد إنشاء حسابك، قم بتسجيل الدخول للوصول إلى كافة ميزات النظام وبدء تجربة تسوق سهلة وممتعة.",
            descriptionEn: "After creating your account, log in to access all system features and start an easy and enjoyable shopping experience.",
        },
        {
            icon: <Utensils className="h-6 w-6 text-accent" />,
            titleAr: "ثالثاً: استكشاف قائمة الطعام",
            titleEn: "Third: Explore the Menu",
            descriptionAr: "تصفح قائمة طعامنا المتنوعة والغنية. اكتشف أطباقنا الشهية واختر ما يناسب ذوقك.",
            descriptionEn: "Browse our rich and diverse menu. Discover our delicious dishes and choose what suits your taste.",
        },
        {
            icon: <ShoppingCart className="h-6 w-6 text-accent" />,
            titleAr: "رابعاً و خامساً: أخذ الطلب وتأكيد السلة",
            titleEn: "Fourth & Fifth: Place Order and Confirm Cart",
            descriptionAr: "أضف الأطباق التي اخترتها إلى سلة المشتريات مع إمكانية إضافة طلب خاص. بعد الانتهاء، قم بمراجعة وتأكيد طلباتك في السلة.",
            descriptionEn: "Add your chosen dishes to the cart with the option for special requests. Once done, review and confirm your items in the cart.",
        },
        {
            icon: <Banknote className="h-6 w-6 text-accent" />,
            titleAr: "سادساً: تأكيد الطلب والدفع",
            titleEn: "Sixth: Confirm Order and Payment",
            descriptionAr: "الطريقة المتاحة حاليًا هي الحوالة البنكية. يرجى إرفاق صورة عالية الدقة لإثبات الدفع عبر أحد البنوك التالية: الكريمي، العمقي، القطيبي, أو بن دول. لطلبات التوصيل، حدد موقعك بدقة مع تشغيل تتبع الموقع (تكلفة التوصيل على العميل).",
            descriptionEn: "The currently available method is bank transfer. Please attach a high-resolution photo of the payment proof via one of the following banks: Al-Kuraimi, Al-Amqi, Al-Qutaibi, or Bin Dowal. For delivery orders, specify your location accurately and enable location tracking (delivery cost is paid by the customer).",
        },
        {
            icon: <Clock className="h-6 w-6 text-accent" />,
            titleAr: "أخيراً: انتظار تأكيد الطلب",
            titleEn: "Finally: Wait for Order Confirmation",
            descriptionAr: "بعد إرسال إثبات الدفع، سيقوم فريقنا بمراجعة طلبك. ستتلقى إشعارًا عبر البريد الإلكتروني أو الواتساب عند قبول طلبك وبدء تحضيره. شكرًا لكم وتسوق ممتع!",
            descriptionEn: "After sending the payment proof, our team will review your order. You will receive a notification via email or WhatsApp once your order is accepted and preparation begins. Thank you and happy shopping!",
        },
    ];

    return (
        <div className="container mx-auto py-8">
            <Card className="shadow-lg overflow-hidden">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl text-primary">
                        {translate("تعليمات استخدام النظام", "System Usage Instructions")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <div className="relative">
                        {/* The vertical line */}
                        <div className={`absolute top-0 bottom-0 w-0.5 bg-border/70 ${direction === 'rtl' ? 'right-6' : 'left-6'} -z-10`}></div>

                        <div className="space-y-4">
                            {timelineSteps.map((step, index) => (
                                <div key={index} className="group relative flex items-start gap-6 p-4 rounded-lg transition-all duration-300 hover:bg-primary/5 hover:scale-[1.02] cursor-default">
                                    {/* Icon and circle */}
                                    <div className={`z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-8 ring-background group-hover:bg-accent/20 transition-colors`}>
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1.5">
                                        <h3 className="font-headline text-xl font-semibold text-primary mb-2">
                                            {translate(step.titleAr, step.titleEn)}
                                        </h3>
                                        <p className="font-body text-foreground/80">
                                            {translate(step.descriptionAr, step.descriptionEn)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
