"use client";

import type { CartItem, MenuItem } from '@/lib/types';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

interface CartContextProps extends CartState {
    addItem: (item: MenuItem, quantity?: number, specialRequest?: string) => void;
    removeItem: (itemId: number) => void;
    updateItemQuantity: (itemId: number, quantity: number) => void;
    updateItemSpecialRequest: (itemId: number, specialRequest: string) => void;
    clearCart: () => void;
    getItemQuantity: (itemId: number) => number;
}

const TAX_RATE = 0.10;

const CartContext = createContext<CartContextProps | undefined>(undefined);

type CartAction =
    | { type: 'ADD_ITEM'; payload: { item: MenuItem; quantity: number; specialRequest?: string } }
    | { type: 'REMOVE_ITEM'; payload: { itemId: number } }
    | { type: 'UPDATE_ITEM_QUANTITY'; payload: { itemId: number; quantity: number } }
    | { type: 'UPDATE_ITEM_SPECIAL_REQUEST'; payload: { itemId: number; specialRequest: string } }
    | { type: 'CLEAR_CART' };

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subTotalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems, totalPrice: subTotalPrice };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    let newItems: CartItem[];
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(i => i.id === action.payload.item.id);

            if (existingItemIndex > -1) {
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? {
                            ...item,
                            quantity: item.quantity + action.payload.quantity,
                            specialRequest:
                                action.payload.specialRequest !== undefined
                                    ? action.payload.specialRequest
                                    : item.specialRequest,
                        }
                        : item
                );
            } else {
                newItems = [
                    ...state.items,
                    {
                        ...action.payload.item,
                        quantity: action.payload.quantity,
                        specialRequest: action.payload.specialRequest,
                    },
                ];
            }
            return { ...state, items: newItems, ...calculateTotals(newItems) };
        }

        case 'REMOVE_ITEM':
            newItems = state.items.filter(item => item.id !== action.payload.itemId);
            return { ...state, items: newItems, ...calculateTotals(newItems) };

        case 'UPDATE_ITEM_QUANTITY':
            newItems = state.items
                .map(item =>
                    item.id === action.payload.itemId
                        ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                        : item
                )
                .filter(item => item.quantity > 0);
            return { ...state, items: newItems, ...calculateTotals(newItems) };

        case 'UPDATE_ITEM_SPECIAL_REQUEST':
            newItems = state.items.map(item =>
                item.id === action.payload.itemId
                    ? { ...item, specialRequest: action.payload.specialRequest }
                    : item
            );
            return { ...state, items: newItems, ...calculateTotals(newItems) };

        case 'CLEAR_CART':
            return { ...initialState };

        default:
            return state;
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = (item: MenuItem, quantity: number = 1, specialRequest?: string) => {
        dispatch({ type: 'ADD_ITEM', payload: { item, quantity, specialRequest } });
    };

    const removeItem = (itemId: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
    };

    const updateItemQuantity = (itemId: number, quantity: number) => {
        dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { itemId, quantity } });
    };

    const updateItemSpecialRequest = (itemId: number, specialRequest: string) => {
        dispatch({ type: 'UPDATE_ITEM_SPECIAL_REQUEST', payload: { itemId, specialRequest } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getItemQuantity = (itemId: number): number => {
        const item = state.items.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice,
                addItem,
                removeItem,
                updateItemQuantity,
                updateItemSpecialRequest,
                clearCart,
                getItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextProps => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used ضمن CartProvider');
    }
    return context;
};

export const getTaxRate = () => TAX_RATE;
