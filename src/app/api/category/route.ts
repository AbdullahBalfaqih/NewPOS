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

        const result = categories.map((cat: any) => {
            const itemsSource = cat.items || cat.tblProduct || [];

            const items = itemsSource.map((prod: any) => {
                console.log('✅ المنتج من API:', prod); // ← هنا نطبع كل شيء

                const availableQty = Number(
                    prod.availableQuantity ??
                    prod.AvailableQuantity ??
                    prod.availablequantity ??
                    prod.stock ??
                    0
                );

                return {
                    id: prod.id ?? prod.productId ?? 0,
                    name: prod.name ?? prod.productName ?? 'غير معروف',
                    price: prod.price ?? prod.productPrice ?? 0,
                    imageUrl: prod.imageUrl
                        ? prod.imageUrl
                        : prod.productImage
                            ? typeof prod.productImage === 'string'
                                ? `data:image/png;base64,${prod.productImage}`
                                : `data:image/png;base64,${Buffer.from(prod.productImage).toString('base64')}`
                            : null,
                    availableQuantity: availableQty,
                    isOutOfStock: availableQty <= 0,
                    categoryId: prod.categoryId?.toString() ?? prod.CategoryId?.toString() ?? '0',
                    imageHint: '',
                };
            });


            return {
                id: (cat.id ?? cat.categoryId ?? 0).toString(), // ✅ كذلك هنا
                name: cat.name ?? cat.CategoryName ?? 'غير معروف',
                items,
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('❌ API Error:', error);
        return NextResponse.json(
            { message: 'حدث خطأ أثناء جلب البيانات.', success: false },
            { status: 500 }
        );
    }
}
