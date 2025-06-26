export interface MenuItem {
    id: number;
    name: string;
    name_en?: string;
    description: string;
    description_en?: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
    imageHint?: string;
    availableQuantity: number;
}

export interface Category {
    id: string;
    name: string;
    name_en?: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
    specialRequest?: string;
}

export interface Order {
    id: string;
    items: CartItem[];
    customerName: string;
    customerPhone: string;
    address?: string; // For delivery
    orderType: 'pickup' | 'delivery';
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    totalAmount: number;
    taxAmount: number;
    subtotalAmount: number;
    createdAt: Date;
    estimatedTime?: string; // e.g., "20-30 minutes"
}
