
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart, getTaxRate } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, MinusCircle, ShoppingCart, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocale } from '@/contexts/LocaleContext';

export function CartSidebar() {
  const { items, removeItem, updateItemQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { translate, direction, locale } = useLocale();
  const taxRate = getTaxRate();
  const taxAmount = totalPrice * 1;
  const finalTotal = totalPrice + 0;
  const currencySymbol = translate("ر.ي", "YER");

  const translatedItems = items.map(item => ({
    ...item,
    name: locale === 'en' && item.name_en ? item.name_en : item.name,
    specialRequest: item.specialRequest ? (locale === 'en' ? 'Note: ' : 'ملاحظة: ') + item.specialRequest : undefined
  }));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
            variant="outline" 
            className={`fixed bottom-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} z-50 rounded-full h-16 w-16 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center`} 
            aria-label={translate(`عرض السلة، ${totalItems} عناصر`, `View cart, ${totalItems} items`)}
        >
          <ShoppingCart className="h-7 w-7" />
          {totalItems > 0 && (
            <span className={`absolute -top-1 ${direction === 'rtl' ? '-left-1' : '-right-1'} inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full`}>
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-card p-0" side={direction === 'rtl' ? 'left' : 'right'}>
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="font-headline text-2xl text-primary">{translate('سلة التسوق الخاصة بك', 'Your Shopping Cart')}</SheetTitle>
        </SheetHeader>
        
        {translatedItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6">
            <ShoppingCart className="h-20 w-20 text-muted-foreground mb-4" />
            <p className="font-body text-muted-foreground text-lg">{translate('سلتك فارغة.', 'Your cart is empty.')}</p>
            <SheetClose asChild>
                <Button variant="link" className="text-accent mt-2" asChild>
                    <Link href="/menu">{translate('ابدأ التسوق', 'Start Shopping')}</Link>
                </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow p-6">
              <div className="space-y-4">
                {translatedItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-3 bg-background/50 rounded-lg shadow-sm">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover w-16 h-16"
                        data-ai-hint={item.imageHint || "cart item"}
                      />
                    )}
                    <div className="flex-grow">
                      <h4 className="font-body font-semibold text-primary">{item.name}</h4>
                      <p className="font-body text-sm text-muted-foreground">{item.price} {currencySymbol}</p>
                      {item.specialRequest && <p className="font-body text-xs text-accent mt-1 italic">{item.specialRequest}</p>}
                      <div className="flex items-center gap-2 mt-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity - 1)} aria-label={translate(`تقليل كمية ${item.name}`, `Decrease quantity of ${item.name}`)}>
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="font-body text-sm w-5 text-center">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity + 1)} aria-label={translate(`زيادة كمية ${item.name}`, `Increase quantity of ${item.name}`)}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-7 w-7" onClick={() => removeItem(item.id)} aria-label={translate(`إزالة ${item.name} من السلة`, `Remove ${item.name} from cart`)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="p-6 border-t mt-auto">
              <div className="w-full space-y-3">
                 
                <div className="flex justify-between font-body text-lg font-semibold text-primary">
                  <span>{translate('الإجمالي:', 'Total:')}</span>
                  <span>{finalTotal} {currencySymbol}</span>
                </div>
                <SheetClose asChild>
                  <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4" asChild>
                    <Link href="/checkout">{translate('إتمام الطلب', 'Proceed to Checkout')}</Link>
                  </Button>
                </SheetClose>
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10" onClick={clearCart}>
                  {translate('إفراغ السلة', 'Empty Cart')}
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
         <SheetClose className={`absolute top-4 ${direction === 'rtl' ? 'left-4' : 'right-4'} rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary`}>
            <X className="h-5 w-5" />
            <span className="sr-only">{translate('إغلاق', 'Close')}</span>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
