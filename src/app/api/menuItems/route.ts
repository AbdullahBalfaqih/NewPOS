import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DOTNET_API_BASE_URL = 'https://api.crisper.food';


export async function GET(request: NextRequest) {
    try {
        const apiResponse = await fetch(`${DOTNET_API_BASE_URL}/api/menu`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!apiResponse.ok) {
            let errorData = { message: 'فشل في جلب البيانات' };
            try {
                errorData = await apiResponse.json();
            } catch { }

            return NextResponse.json(
                { message: errorData.message || 'فشل في جلب البيانات', success: false },
                { status: apiResponse.status }
            );
        }

        const categories = await apiResponse.json();

        const result = categories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            items: (cat.items || []).map((prod: any) => ({
                id: prod.id,
                name: prod.name,
                price: prod.price,
                imageUrl: prod.imageUrl,
                availableQuantity: Number(
                    prod.availableQuantity ??
                    prod.AvailableQuantity ??
                    prod.availablequantity ??
                    prod.stock ??
                    0
                ),
                description: prod.description ?? prod.Description ?? "",  // إضافة الوصف هنا
            })),
        }));

        return NextResponse.json(result);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { message: 'حدث خطأ أثناء جلب البيانات.', success: false },
            { status: 500 }
        );
    }
}
