"use client";

import Image from 'next/image';
import type { MenuItem as MenuItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { PlusCircle, MinusCircle, ShoppingCart, MessageSquarePlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { useLocale } from '@/contexts/LocaleContext';

interface MenuItemCardProps {
    item: MenuItemType & { description?: string };  // تأكد من وجود الحقل description
}

export function MenuItemCard({ item }: MenuItemCardProps) {
    // Debug: التأكد من وصول البيانات مع الحقل المهم availableQuantity
    console.log("🚩 كامل كائن المنتج:", item);
    console.log("🎯 المنتج", item.name, "، الكمية القادمة من الـ props:", item.availableQuantity);

    const {
        addItem,
        updateItemQuantity,
        getItemQuantity,
        updateItemSpecialRequest,
        items: cartItems,
    } = useCart();

    const { translate, direction } = useLocale();

    const [specialRequest, setSpecialRequest] = useState('');
    const [showSpecialRequestModal, setShowSpecialRequestModal] = useState(false);

    const quantityInCart = getItemQuantity(item.id);
    const currencySymbol = translate("", "YER");
    const availableQuantity = Number(item.availableQuantity);

    // هل المنتج غير متوفر؟
    const isOutOfStock = availableQuantity <= 0;
    const isInsufficientStock = quantityInCart >= availableQuantity;

    // إضافة عنصر للسلة مع التحقق من المخزون
    const handleAddToCart = () => {
        if (isOutOfStock) {
            alert(translate("الكمية غير كافية في المخزون", "Insufficient stock"));
            return;
        }

        if (quantityInCart === 0) {
            addItem(item, 1, specialRequest);
        } else {
            if (isInsufficientStock) {
                alert(translate("لا يمكنك طلب كمية أكبر من المتوفر في المخزون.", "You cannot order more than available stock."));
                return;
            }
            updateItemQuantity(item.id, quantityInCart + 1);
            if (specialRequest) {
                updateItemSpecialRequest(item.id, specialRequest);
            }
        }
        setShowSpecialRequestModal(false);
    };

    // زيادة الكمية مع التحقق من المخزون
    const handleIncreaseQuantity = () => {
        if (isInsufficientStock) {
            alert(translate("لا يمكنك طلب كمية أكبر من المتوفر في المخزون.", "You cannot order more than available stock."));
            return;
        }
        updateItemQuantity(item.id, quantityInCart + 1);
    };

    // حفظ الطلب الخاص وإضافة المنتج (أو تحديثه)
    const handleSaveSpecialRequestAndAdd = () => {
        if (isOutOfStock) {
            alert(translate("الكمية غير كافية في المخزون", "Insufficient stock"));
            return;
        }

        if (quantityInCart === 0) {
            addItem(item, 1, specialRequest);
        } else {
            updateItemSpecialRequest(item.id, specialRequest);
        }
        setShowSpecialRequestModal(false);
    };

    // فتح نافذة الطلب الخاص مع تحميل الطلب الموجود إذا كان في السلة
    const handleOpenSpecialRequestModal = () => {
        const cartItem = cartItems.find(ci => ci.id === item.id);
        setSpecialRequest(cartItem?.specialRequest || '');
        setShowSpecialRequestModal(true);
    };

    return (
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            {item.imageUrl && (
                <div className="relative w-full h-48">
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 1000vw, 25vw"
                        style={{ objectFit: "contain", width: "100%", height: "100%" }}
                        data-ai-hint={item.imageHint || "food item"}
                    />
                </div>
            )}

            <CardHeader className={`pb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <CardTitle className="font-headline text-xl text-primary">{item.name}</CardTitle>
            </CardHeader>

            <CardContent className={`flex-grow ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <p className="font-body text-lg font-semibold text-accent">
                    {item.price} {currencySymbol}
                </p>

                {/* وصف المنتج */}
                {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                        {item.description}
                    </p>
                )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-0 p-4">
                {isOutOfStock ? (
                    <Button disabled className="w-full bg-gray-400 cursor-not-allowed">
                        {translate('الكمية غير كافية في المخزون', 'Insufficient stock')}
                    </Button>
                ) : (
                    <>
                        {quantityInCart > 0 ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateItemQuantity(item.id, quantityInCart - 1)}
                                    aria-label={translate(`تقليل كمية ${item.name}`, `Decrease quantity of ${item.name}`)}
                                >
                                    <MinusCircle className="h-5 w-5" />
                                </Button>
                                <span className="font-body text-lg font-semibold w-8 text-center">{quantityInCart}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleIncreaseQuantity}
                                    aria-label={translate(`زيادة كمية ${item.name}`, `Increase quantity of ${item.name}`)}
                                >
                                    <PlusCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={handleAddToCart}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex-grow"
                                aria-label={translate(`إضافة ${item.name} إلى السلة`, `Add ${item.name} to cart`)}
                            >
                                <ShoppingCart className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                {translate('أضف للسلة', 'Add to Cart')}
                            </Button>
                        )}

                        {/* زر الطلب الخاص */}
                        <Dialog open={showSpecialRequestModal} onOpenChange={setShowSpecialRequestModal}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full sm:w-auto text-primary hover:bg-primary/10"
                                    onClick={handleOpenSpecialRequestModal}
                                    aria-label={translate(`إضافة طلب خاص لـ ${item.name}`, `Add special request for ${item.name}`)}
                                >
                                    <MessageSquarePlus className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                    {translate('طلب خاص', 'Special Request')}
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[425px] bg-card">
                                <DialogHeader className={direction === 'rtl' ? 'text-right' : 'text-left'}>
                                    <DialogTitle className="font-headline text-primary">
                                        {translate('طلب خاص لـ', 'Special Request for')} {item.name}
                                    </DialogTitle>
                                    <DialogDescription className="font-body text-muted-foreground">
                                        {translate('أضف أي تعليمات خاصة لهذا الطبق.', 'Add any special instructions for this item.')}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <div className={`grid ${direction === 'rtl' ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr_auto]'} items-center gap-4`}>
                                        <Label htmlFor="special-request" className={`${direction === 'rtl' ? 'text-right' : 'text-left'} font-body col-span-4 sm:col-span-1`}>
                                            {translate('الطلب', 'Request')}
                                        </Label>
                                        <Textarea
                                            id="special-request"
                                            value={specialRequest}
                                            onChange={(e) => setSpecialRequest(e.target.value)}
                                            placeholder={translate('مثال: بدون بصل، صلصة إضافية...', 'e.g.: no onions, extra sauce...')}
                                            className="col-span-4 sm:col-span-3 font-body"
                                            rows={3}
                                            dir={direction}
                                        />
                                    </div>
                                </div>

                                <DialogFooter className={`sm:justify-${direction === 'rtl' ? 'start' : 'end'}`}>
                                    <DialogClose asChild>
                                        <Button variant="outline">{translate('إلغاء', 'Cancel')}</Button>
                                    </DialogClose>
                                    <Button
                                        type="button"
                                        onClick={handleSaveSpecialRequestAndAdd}
                                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                    >
                                        {quantityInCart > 0
                                            ? translate('تحديث الطلب الخاص', 'Update Special Request')
                                            : translate('إضافة للسلة مع الطلب الخاص', 'Add to Cart with Request')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
