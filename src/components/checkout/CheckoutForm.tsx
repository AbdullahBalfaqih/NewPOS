"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { CreditCard, Landmark, Users } from "lucide-react";

export function CheckoutForm() {
    const { items, totalPrice, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { translate, direction } = useLocale();
    const [fileType, setFileType] = useState<string | null>(null);

    const yemenPhoneRegex = /^(71|73|70|77|78)\d{7}$/;

    // بناء الـ schema مع شرط التوصيل
    const formSchema = z.object({
        customerName: z.string().min(2),
        customerPhone: z.string().min(9),
        orderType: z.enum(["pickup", "delivery"]),
        paymentMethod: z.enum(["حوالة"]),
        // هنا لا تتحقق من الحقول الاختيارية في الـ schema
        address: z.string().optional(),
        locationDescription: z.string().optional(),
        paymentProof: z.string().min(10, {
            message: translate("إثبات الدفع مطلوب.", "Payment proof is required."),
        }),

        gpsLink: z.string().optional(),
        latitude: z.number().nullable().optional(),
        longitude: z.number().nullable().optional(),
        notes: z.string().optional(),
    });


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            orderType: "pickup",
            address: "",
            paymentMethod: "حوالة",
            notes: "",
            paymentProof: undefined,
            locationDescription: "",
            gpsLink: "",
            latitude: null,
            longitude: null,
        },
        mode: "all", // تحقق من صلاحية الفورم أثناء الكتابة
    });

    // تفريغ حقول التوصيل تلقائيًا عند اختيار الاستلام (pickup)
    const orderTypeWatch = form.watch("orderType");
    useEffect(() => {
        if (orderTypeWatch === "pickup") {
            form.setValue("address", "");
            form.setValue("locationDescription", "");
            form.setValue("gpsLink", "");
            form.setValue("latitude", null);
            form.setValue("longitude", null);
        }
    }, [orderTypeWatch, form]);

    const [paymentProofBase64, setPaymentProofBase64] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            form.reset({
                customerName: user.name,
                customerPhone: user.phone,
                orderType: "pickup",
                address: "",
                paymentMethod: "حوالة",
                notes: "",
                paymentProof: undefined,
                locationDescription: "",
                gpsLink: "",
                latitude: null,
                longitude: null,
            });
        }
    }, [isAuthenticated, user, form]);

    
    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            resetPaymentProof();
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("يرجى اختيار صورة فقط بصيغة JPG أو PNG أو WEBP.");
            e.target.value = "";
            resetPaymentProof();
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            setPaymentProofBase64(base64);
            setFileType(file.type);
            form.setValue("paymentProof", base64, { shouldValidate: true });
        } catch (err) {
            console.error("فشل في قراءة الملف:", err);
            alert("حدث خطأ أثناء قراءة الصورة.");
            resetPaymentProof();
        }
    }

    // تحويل الملف إلى Base64 باستخدام Promise
    function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const base64 = result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // دالة لإعادة ضبط حالة إثبات الدفع
    function resetPaymentProof() {
        setPaymentProofBase64(null);
        setFileType(null);
        form.setValue("paymentProof", "", { shouldValidate: true });
    }


    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (items.length === 0) {
            toast({
                title: translate("يجب إضافة منتجات إلى الطلب", "You must add items to your order"),
                variant: "destructive",
            });
            return;
        }

        const finalCustomerName = isAuthenticated && user ? user.name : values.customerName;
        const isDelivery = values.orderType === "delivery";

        if (isDelivery) {
            console.log("address:", values.address);
            console.log("locationDescription:", values.locationDescription);
            console.log("paymentProof:", values.paymentProof);
            console.log("gpsLink:", values.gpsLink);
            console.log("latitude:", values.latitude);
            console.log("longitude:", values.longitude);
            if (
                !values.paymentProof ||
                values.paymentProof.trim().length === 0
            ) {
                toast({
                    title: translate("إثبات الدفع مطلوب", "Payment proof is required"),
                    variant: "destructive",
                });
                return;
            }
            if (
                
                !values.locationDescription?.trim() ||
                !values.paymentProof ||
                !values.gpsLink ||
                values.latitude === null ||
                values.longitude === null
            ) {
                toast({
                    title: translate(
                        "الرجاء ملء جميع الحقول المطلوبة لطلبات التوصيل.",
                        "Please fill all required fields for delivery orders."
                    ),
                    variant: "destructive",
                });
                return;
            }
        }

        const payload = {
            customerName: finalCustomerName,
            customerPhone: values.customerPhone,
            customerEmail: user?.email || null,
            orderDate: new Date().toISOString(),  // ممكن تبقى، أو تحذف وتترك Backend يعينها
            paymentMethod: values.paymentMethod,
            notes: values.notes || null,
            paymentProofBase64: values.paymentProof || null,

            // لا ترسل status هنا

            gpsLink: isDelivery ? values.gpsLink : null,
            latitude: isDelivery ? values.latitude : null,
            longitude: isDelivery ? values.longitude : null,
            locationDescription: isDelivery ? values.locationDescription : null,

            tblOnlineOrderItem: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                itemNote: item.specialRequest,
            })),
        };


        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                toast({
                    title: translate("خطأ في إرسال الطلب", "Order Submission Error"),
                    description: data.message || "حدث خطأ أثناء إرسال الطلب.",
                    variant: "destructive",
                });
                return;
            }

            clearCart();
            toast({
                title: translate("تم استلام الطلب بنجاح!", "Order received successfully!"),
                description: translate(
                    `رقم طلبك هو ${data.orderId}. سيتم تجهيزه قريباً.`,
                    `Your order number is ${data.orderId}. It will be prepared soon.`
                ),
            });

            router.push(
                `/order-confirmation/${data.orderId}?name=${encodeURIComponent(finalCustomerName)}`
            );
        } catch (error) {
            toast({
                title: translate("حدث خطأ", "Error occurred"),
                description: "تعذر إرسال الطلب. حاول مرة أخرى.",
                variant: "destructive",
            });
            console.error("Checkout submission error:", error);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* الاسم الكامل */}
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-body">{translate("الاسم الكامل", "Full Name")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={translate("مثال: محمد الأحمد", "e.g.: Mohamed Alahmed")}
                                    {...field}
                                    className="font-body"
                                    dir={direction}
                                    disabled={isAuthenticated && !!user}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* رقم الهاتف */}
                <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-body">{translate("رقم الهاتف", "Phone Number")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={translate("مثال: 7123456798", "e.g.: 7123456798")}
                                    {...field}
                                    className="font-body"
                                    type="tel"
                                    dir={direction}
                                    disabled={isAuthenticated && !!user}
                                    required
                                />
                            </FormControl>
                            {isAuthenticated && user && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {translate(
                                        "يستخدم رقم الهاتف من حسابك. إذا كان رقم الهاتف الخاص بالطلب مختلفًا، يرجى تسجيل الخروج وتسجيل الدخول مجددا).",
                                        "Your account phone number is used. If the order phone number is different, please log out and order as a guest, or update your phone number in your profile (if available)."
                                    )}
                                </p>
                            )}
                        </FormItem>
                    )}
                />

                {/* نوع الطلب */}
                <FormField
                    control={form.control}
                    name="orderType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="font-body">{translate("نوع الطلب", "Order Type")}</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col sm:flex-row gap-4"
                                    dir={direction}
                                    required
                                >
                                    <FormItem
                                        className={`flex items-center space-y-0 ${direction === "rtl" ? "space-x-reverse space-x-3" : "space-x-3"
                                            }`}
                                    >
                                        <FormControl>
                                            <RadioGroupItem value="pickup" />
                                        </FormControl>
                                        <FormLabel className="font-normal font-body">
                                            {translate("استلام من المطعم", "Pickup from Restaurant")}
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem
                                        className={`flex items-center space-y-0 ${direction === "rtl" ? "space-x-reverse space-x-3" : "space-x-3"
                                            }`}
                                    >
                                        <FormControl>
                                            <RadioGroupItem value="delivery" />
                                        </FormControl>
                                        <FormLabel className="font-normal font-body">
                                            {translate("توصيل للمنزل", "Home Delivery")}
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* عند التوصيل: وصف الموقع + تحديد الموقع */}
                {orderTypeWatch === "delivery" && (
                    <>
                        {/* وصف الموقع */}
                        <FormField
                            control={form.control}
                            name="locationDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-body mt-4">
                                        {translate("وصف الموقع", "Location Description")}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={translate(
                                                "اذكر العنوان بالتفصيل (المدينة، الحي، الشارع، رقم المبنى)",
                                                "Enter the full address (City, District, Street, Building No.)"
                                            )}
                                            {...field}
                                            className="font-body"
                                            rows={2}
                                            dir={direction}
                                        // ! غير مطلوب مؤقتاً لتجربة:
                                        // required 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* حقل موقعي الحالي عبر GPS (نص فقط، readOnly) */}
                        <FormField
                            control={form.control}
                            name="gpsLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-body mt-4">
                                        {translate("موقعي الحالي عبر GPS", "My Current Location via GPS")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="font-body"
                                            dir="ltr"
                                            readOnly
                                            placeholder={translate("لم يتم تحديد الموقع بعد", "Location not set yet")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* زر تحديد موقعي */}
                        <FormItem>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (!navigator.geolocation) {
                                        toast({
                                            title: translate("المتصفح لا يدعم تحديد الموقع", "Geolocation is not supported"),
                                            variant: "destructive",
                                        });
                                        return;
                                    }

                                    navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                            const lat = position.coords.latitude;
                                            const lng = position.coords.longitude;
                                            const link = `https://maps.google.com/?q=${lat},${lng}`;

                                            form.setValue("gpsLink", link, { shouldValidate: true });
                                            form.setValue("latitude", lat, { shouldValidate: true });
                                            form.setValue("longitude", lng, { shouldValidate: true });

                                            toast({
                                                title: translate("تم تحديد موقعك بنجاح", "Location retrieved successfully"),
                                            });
                                        },
                                        (error) => {
                                            toast({
                                                title: translate("فشل في تحديد الموقع", "Failed to retrieve location"),
                                                description: error.message,
                                                variant: "destructive",
                                            });
                                        }
                                    );
                                }}
                            >
                                {translate("تحديد موقعي الحالي", "Get My Current Location")}
                            </Button>
                        </FormItem>
                    </>
                )}

                {/* طريقة الدفع */}
                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="font-body">{translate("طريقة الدفع", "Payment Method")}</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                                    dir={direction}
                                    required
                                >
                                    <FormItem
                                        className={`flex items-center p-4 border rounded-md hover:border-primary transition-colors ${direction === "rtl" ? "space-x-reverse space-x-3" : "space-x-3"
                                            }`}
                                    >
                                        <FormControl>
                                            <RadioGroupItem value="حوالة" id="bank_transfer" />
                                        </FormControl>
                                        <FormLabel
                                            htmlFor="bank_transfer"
                                            className="font-normal font-body flex items-center gap-2 cursor-pointer"
                                        >
                                            <Landmark className="h-5 w-5 text-primary" />
                                            {translate("تحويل بنكي", "Bank Transfer")}
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* إثبات الدفع (مطلوب في حالة التوصيل) */}
                <FormField
                    control={form.control}
                    name="paymentProof"
                    render={() => (
                        <FormItem>
                            <FormLabel className="font-body">
                                {translate("إثبات الدفع (صورة)", "Payment Proof (Image)")}
                            </FormLabel>
                            <FormControl>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/webp" // أكثر تحديدًا
                                    onChange={handleFileChange}
                                    className="font-body"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                            {paymentProofBase64 && fileType && (
                                <img
                                    src={`data:${fileType};base64,${paymentProofBase64}`}
                                    alt="Payment proof preview"
                                    className="mt-2 max-h-48 object-contain rounded-md border"
                                />
                            )}
                        </FormItem>
                    )}
                />


                {/* ملاحظات إضافية */}
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-body">{translate("ملاحظات إضافية (اختياري)", "Additional Notes (Optional)")}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={translate(
                                        "أي تعليمات خاصة بالطلب بشكل عام",
                                        "Any special instructions for the order in general"
                                    )}
                                    {...field}
                                    className="font-body"
                                    rows={3}
                                    dir={direction}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* زر الإرسال */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
                    disabled={form.formState.isSubmitting} // فقط عند الإرسال الحقيقي
                >
                    {form.formState.isSubmitting
                        ? translate("جاري إرسال الطلب...", "Submitting Order...")
                        : translate("تأكيد الطلب والدفع", "Confirm Order & Pay")}
                </Button>
            </form>
        </Form>
    );


}