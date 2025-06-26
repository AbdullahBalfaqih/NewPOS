"use client";

import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCart, getTaxRate } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import pic1 from '@/app/قط.png';
import pic2 from '@/app/عم.jpg';
import pic3 from '@/app/كر.jpg';
import pic4 from '@/app/بن.png';
export default function CheckoutPage() {
    const { items, totalPrice, totalItems } = useCart();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const { translate, direction, locale } = useLocale();

    const taxRate = getTaxRate();
    const taxAmount = totalPrice * 1;
    const finalTotal = totalPrice + 0;
    const currencySymbol = translate("ر.ي", "YER");

    useEffect(() => {
        if (typeof window !== 'undefined' && !authLoading && !isAuthenticated) {
            router.push(`/login?redirect=/checkout`);
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) {
        return (
            <div className="text-center py-10">
                <h1 className="font-headline text-3xl text-primary mb-4">{translate("جاري التحميل...", "Loading...")}</h1>
            </div>
        );
    }

    if (typeof window !== 'undefined' && !isAuthenticated) {
        return (
            <div className="text-center py-10">
                <h1 className="font-headline text-3xl text-primary mb-4">{translate("يرجى تسجيل الدخول للمتابعة", "Please Login to Continue")}</h1>
                <p className="font-body text-muted-foreground mb-6">{translate("يجب عليك تسجيل الدخول لإتمام عملية الشراء.", "You must be logged in to complete your purchase.")}</p>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/login?redirect=/checkout">
                        <ArrowRight className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                        {translate("الذهاب لصفحة تسجيل الدخول", "Go to Login Page")}
                    </Link>
                </Button>
            </div>
        );
    }

    if (items.length === 0 && typeof window !== 'undefined') {
        return (
            <div className="text-center py-10">
                <h1 className="font-headline text-3xl text-primary mb-4">{translate("سلة التسوق فارغة", "Your Cart is Empty")}</h1>
                <p className="font-body text-muted-foreground mb-6">{translate("ليس لديك أي عناصر في سلتك. ابدأ التسوق الآن!", "You have no items in your cart. Start shopping now!")}</p>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/menu">
                        <ArrowRight className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                        {translate("العودة إلى القائمة", "Back to Menu")}
                    </Link>
                </Button>
            </div>
        );
    }

    const translatedItems = items.map(item => ({
        ...item,
        name: locale === 'en' && item.name_en ? item.name_en : item.name,
        specialRequest: item.specialRequest ? (locale === 'en' ? 'Note: ' : 'ملاحظة: ') + item.specialRequest : undefined
    }));

    return (
        <div className="container mx-auto py-8">
            <h1 className="font-headline text-4xl font-bold text-primary mb-10 text-center">{translate("إتمام الطلب", "Checkout")}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">{translate("معلومات الطلب والدفع", "Order & Payment Information")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CheckoutForm />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className="shadow-lg sticky top-24">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">{translate("ملخص الطلب", "Order Summary")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                                {translatedItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            {item.imageUrl && (
                                                <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-md object-cover w-12 h-12" />
                                            )}
                                            <div>
                                                <p className="font-body font-semibold text-sm text-foreground">{item.name} <span className="text-xs text-muted-foreground">(x{item.quantity})</span></p>
                                                {item.specialRequest && <p className="text-xs text-accent italic">{item.specialRequest}</p>}
                                            </div>
                                        </div>
                                        <p className="font-body text-sm text-foreground">{(item.price * item.quantity).toFixed(2)} {currencySymbol}</p>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                            <div className="flex justify-between w-full font-body text-foreground/80">
                                <span>{translate("عدد العناصر:", "Total Items:")}</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="flex justify-between w-full font-body text-foreground/80">
                                <span>{translate("المجموع الفرعي:", "Subtotal:")}</span>
                                <span>{totalPrice} {currencySymbol}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between w-full font-body text-lg font-semibold text-primary">
                                <span>{translate("الإجمالي النهائي:", "Final Total:")}</span>
                                <span>{finalTotal} {currencySymbol}</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Glass Cards Footer */}
            <div className="mt-20 flex justify-center">
                <div className="container flex justify-center items-center gap-4 flex-wrap">
                    {[{
                        img: pic2.src,
                        alt: "مصرف العمقي",
                        text: "254214303",
                        rotate: "-15"
                    }, {
                        img: pic4.src,
                        alt: "بنك بن دول",
                        text: "23197205",
                        rotate: "5"
                    }, {
                        img: pic3.src,
                        alt: "بنك الكريمي",
                        text: "3092062518",
                        rotate: "25"
                    }, {
                        img: pic1.src,
                        alt: "بنك القطيبي",
                        text: "431275796",
                        rotate: "25"
                    }].map((bank, idx) => (
                        <div
                            key={idx}
                            data-text={bank.text}
                            style={{ ['--r' as any]: bank.rotate } as React.CSSProperties}
                            className="glass cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(bank.text)
                                    .then(() => alert(`تم نسخ رقم الحساب: ${bank.text}`))
                                    .catch(() => alert('حدث خطأ أثناء النسخ'));
                            }}
                        >
                            <img
                                src={bank.img}
                                alt={bank.alt}
                                className="w-full h-auto"
                            />
                            <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="..." />
                            </svg>
                        </div>
                    ))}
                </div>
            </div>


            <style jsx global>{`
  .glass {
    position: relative;
    width: 180px;
    height: 200px;
    background: linear-gradient(#fff2, transparent);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    border-radius: 10px;
    margin: 0 -45px;
    backdrop-filter: blur(10px);
    transform: rotate(calc(var(--r) * 1deg));
  }
  
  .glass:hover {
    transform: rotate(0deg);
    margin: 0 10px;
  }
  
  .glass::before {
    content: attr(data-text);
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    color: black; /* تغيير اللون إلى بني */
  }
  
  .glass svg {
    font-size: 2.5em;
    fill: #fff; /* يمكن تغييره إذا كنت ترغب في تغيير لون الأيقونات أيضًا */
  }
`}</style>
        </div>
    );
}
