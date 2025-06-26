import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DOTNET_API_BASE_URL = 'http://localhost:5086';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('📦 البيانات المستلمة:', body);

        const { name, surname, email, userName, password } = body;

        if (!name || !surname || !email || !userName || !password) {
            return NextResponse.json(
                { message: 'جميع الحقول مطلوبة.', success: false },
                { status: 400 }
            );
        }

        const apiResponse = await fetch(`${DOTNET_API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                surname: surname, // نخزن الرقم في surname
                email,
                userName: userName,
                password,
            }),
        });

        const responseData = await apiResponse.json();

        console.log('🌐 استجابة API الدوت نت:', apiResponse.status, responseData);

        // نعتمد فقط على success في البيانات وليس apiResponse.ok
        if (responseData.success && responseData.user) {
            const dbUser = responseData.user;

            return NextResponse.json({
                user: {
                    id: dbUser.userId?.toString() ?? '',
                    name: dbUser.name.trim(),
                    username: dbUser.userName,
                    email: dbUser.email,
                    phone: dbUser.surname ,
                },
                message: responseData.message || 'تم إنشاء الحساب بنجاح.',
                success: true,
            });
        } else {
            return NextResponse.json(
                {
                    message: responseData.message || 'فشل إنشاء الحساب.',
                    success: false,
                },
                { status: apiResponse.status || 400 }
            );
        }
    } catch (error: any) {
        console.error('Register API error:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json(
                { message: 'تعذر الاتصال بخدمة التسجيل. حاول لاحقًا.', success: false },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: 'حدث خطأ غير متوقع أثناء إنشاء الحساب.', success: false },
            { status: 500 }
        );
    }
}
