
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Utensils, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { useLocale } from '@/contexts/LocaleContext';
import desh from '@/app/desh.png';
 

export default function HomePage() {
  const { translate, direction } = useLocale();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
              {translate('مرحبًا بك في مطعم كرسبر أونلاين', 'Welcome to Crisper Restaurant Online')}
            </h1>
            <p className="font-body text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
              {translate('اطلب وجباتك المفضلة بسهولة وسرعة.', 'Order your favorite meals easily and quickly.')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105">
                <Link href="/menu">
                  <ShoppingBag className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {translate('تصفح القائمة واطلب الآن', 'Browse Menu & Order Now')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary text-center mb-12">
              {translate('لماذا تختارنا؟', 'Why Choose Us?')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <Utensils className="h-12 w-12 text-accent" />
                </div>
                <h3 className="font-headline text-xl font-semibold text-primary mb-2 text-center">{translate('أطباق شهية', 'Delicious Dishes')}</h3>
                <p className="font-body text-foreground/70 text-center">
                  {translate('نقدم مجموعة متنوعة من الأطباق المحضرة من أجود المكونات الطازجة.', 'We offer a variety of dishes made from the finest fresh ingredients.')}
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="h-12 w-12 text-accent" />
                </div>
                <h3 className="font-headline text-xl font-semibold text-primary mb-2 text-center">{translate('طلب سهل وسريع', 'Easy & Fast Ordering')}</h3>
                <p className="font-body text-foreground/70 text-center">
                  {translate('تجربة طلب سلسة عبر الإنترنت مع خيارات دفع آمنة ومتعددة.', 'Smooth online ordering experience with secure and multiple payment options.')}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary mb-6">
                  {translate('اكتشف أشهى أطباقنا', 'Discover Our Tastiest Dishes')}
                </h2>
                <p className="font-body text-lg text-foreground/80 mb-8">
                  {translate('من المقبلات المنعشة إلى الأطباق الرئيسية الغنية والحلويات اللذيذة، كل طبق لدينا يحكي قصة من النكهات الأصيلة.', 'From refreshing appetizers to rich main courses and delicious desserts, every dish tells a story of authentic flavors.')}
                </p>
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
                  <Link href="/menu">
                    {translate('استكشف القائمة الكاملة', 'Explore Full Menu')}
                  </Link>
                </Button>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl">
                 <Image 
                                  src={desh.src} 
                    alt={translate("أطباق شهية", "Delicious Dishes")}
                    width={600} 
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint="delicious food"
                  />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
