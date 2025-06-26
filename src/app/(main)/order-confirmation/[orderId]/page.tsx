
"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function OrderConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { translate, direction } = useLocale();
  const orderId = params.orderId as string;
  const customerName = searchParams.get('name');

  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  useEffect(() => {
    const timesAr = ["20-30 دقيقة", "30-45 دقيقة", "45-60 دقيقة"];
    const timesEn = ["20-30 minutes", "30-45 minutes", "45-60 minutes"];
    setEstimatedTime(translate(timesAr[Math.floor(Math.random() * timesAr.length)], timesEn[Math.floor(Math.random() * timesEn.length)]));
  }, [translate]);

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <h1 className="font-headline text-2xl text-destructive mb-4">{translate("خطأ: رقم الطلب غير موجود", "Error: Order ID not found")}</h1>
        <Button asChild>
          <Link href="/menu">{translate("العودة إلى القائمة", "Back to Menu")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center bg-primary/5 rounded-t-lg py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">
            {translate(`شكرًا لك على طلبك, ${decodeURIComponent(customerName || "عميلنا العزيز")}!`, `Thank you for your order, ${decodeURIComponent(customerName || "Valued Customer")}!`)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="font-body text-lg text-foreground/90 mb-2">
            {translate("تم استلام طلبك بنجاح وجاري التحقق من الدفع سنوافيكم عبر اشعار من خلال الواتس اب.", "Your order has been successfully received and is being prepared.")}
          </p>
          <p className="font-body text-xl font-semibold text-accent mb-6">
            {translate("رقم طلبك هو:", "Your order number is:")} <span className="font-mono">{orderId}</span>
          </p>
          {estimatedTime && (
            <p className="font-body text-md text-foreground/80 mb-4">
              {translate("الوقت المقدر لتجهيز طلبك:", "Estimated preparation time:")} <span className="font-semibold">{estimatedTime}</span>.
            </p>
          )}
          <p className="font-body text-muted-foreground mb-8">
            {translate("ستتلقى إشعارًا عند قبول او رفض الطلب وجاهزيته للاستلام أو عند خروجه للتوصيل.", "You will receive a notification when your order is ready for pickup or out for delivery.")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/menu">
                <ShoppingBag className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {translate("متابعة التسوق", "Continue Shopping")}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-primary border-primary hover:bg-primary/10">
              <Link href="/">
                {translate("العودة للصفحة الرئيسية", "Back to Homepage")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
