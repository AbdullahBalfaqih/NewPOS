import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// قاعدة الرابط من .env.local
const DOTNET_API_BASE_URL = 'https://api.crisper.food';


export async function POST(request: NextRequest) {
    try {
        const { usernameOrEmail, password } = await request.json();

        if (!usernameOrEmail || !password) {
            return NextResponse.json(
                { message: 'Username/Email and password are required.' },
                { status: 400 }
            );
        }

        // إرسال الطلب إلى API الخارجي (الذي يعمل بـ .NET)
        const apiResponse = await fetch(`${DOTNET_API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: usernameOrEmail,
                password: password,
            }),
        });

        const responseData = await apiResponse.json();

        // التحقق من النتيجة
        if (apiResponse.ok && responseData.success && responseData.user) {
            const dbUser = responseData.user;

            const userToReturn = {
                id: dbUser.userId?.toString() ?? '',
                name: dbUser.name.trim(), // استخدم الاسم فقط بدون اللقب
                username: dbUser.userName,
                email: dbUser.email,
                phone: dbUser.surname, // وهمي في حال عدم توفره
            };

            return NextResponse.json({
                user: userToReturn,
                message: responseData.message || 'Login successful',
            });
        } else {
            return NextResponse.json(
                {
                    message:
                        responseData.message || 'Invalid username/email or password.',
                },
                { status: apiResponse.status || 401 }
            );
        }
    } catch (error: any) {
        console.error('Login API error:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json(
                {
                    message:
                        'Could not connect to authentication service. Please try again later.',
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: 'An unexpected error occurred during login.' },
            { status: 500 }
        );
    }
}
