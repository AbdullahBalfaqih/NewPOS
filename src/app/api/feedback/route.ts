import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DOTNET_API_BASE_URL = 'http://localhost:5086';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('📦 البيانات المستلمة:', body);

        // تحقق من الحقول المطلوبة (مثلاً: name, email, message في حالة Feedback)
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { message: 'جميع الحقول مطلوبة.', success: false },
                { status: 400 }
            );
        }

        // إرسال البيانات إلى API الدوت نت الخاص بالـ Feedback
        const apiResponse = await fetch(`${DOTNET_API_BASE_URL}/api/Feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const responseData = await apiResponse.json();
        console.log('🌐 استجابة API الدوت نت:', apiResponse.status, responseData);

        if (responseData.success) {
            return NextResponse.json({
                message: responseData.message || 'تم إرسال الملاحظات بنجاح.',
                success: true,
            });
        } else {
            return NextResponse.json(
                {
                    message: responseData.message || 'فشل إرسال الملاحظات.',
                    success: false,
                },
                { status: apiResponse.status || 400 }
            );
        }
    } catch (error: any) {
        console.error('Feedback API error:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json(
                { message: 'تعذر الاتصال بخدمة الملاحظات. حاول لاحقًا.', success: false },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: 'حدث خطأ غير متوقع أثناء إرسال الملاحظات.', success: false },
            { status: 500 }
        );
    }
}
