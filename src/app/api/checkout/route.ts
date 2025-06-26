import { NextRequest, NextResponse } from 'next/server';

const DOTNET_API_BASE_URL = 'http://localhost:5086';

export async function POST(req: NextRequest) {
    try {
        // استقبل البيانات من الـ frontend
        const body = await req.json();
        console.log("Received body:", body); // طباعة البيانات المستلمة

        // أرسل الطلب إلى API الـ .NET مع نفس الجسم (payload)
        const dotnetResponse = await fetch(`${DOTNET_API_BASE_URL}/api/OnlineOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        console.log("Dotnet response status:", dotnetResponse.status); // طباعة حالة الاستجابة

        // تحقق من نجاح الرد
        if (!dotnetResponse.ok) {
            let errorData = { message: 'فشل في إرسال الطلب' };
            try {
                errorData = await dotnetResponse.json();
            } catch {
                // تجاهل خطأ التحليل إذا لم يكن JSON صالحاً
            }

            return NextResponse.json(
                { success: false, message: errorData.message || 'فشل في إرسال الطلب' },
                { status: dotnetResponse.status }
            );
        }

        // قراءة البيانات المرسلة من الـ .NET API
        const responseData = await dotnetResponse.json();

        console.log("Response from .NET:", responseData); // طباعة البيانات المستلمة من الـ .NET

        // أعد البيانات إلى الواجهة
        return NextResponse.json({
            success: true,
            orderId: responseData.orderId || `ORD-${Date.now()}`, // لو API .NET لا ترجع رقم الطلب استخدم مؤقت
            message: 'تم إرسال الطلب بنجاح',
        });

    } catch (error) {
        console.error('Checkout API Error:', error);
        return NextResponse.json(
            { success: false, message: 'حدث خطأ أثناء إرسال الطلب.' },
            { status: 500 }
        );
    }
}