import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/hooks/useCart';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "next-themes";
import { LocaleProvider } from '@/contexts/LocaleContext';

export const metadata: Metadata = {
    title: 'مطعم كرسبر',
    description: 'قم بحجز طلباتك اونلاين',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-body antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <LocaleProvider>
                        <AuthProvider>
                            <CartProvider>
                                {children}
                                <Toaster />
                            </CartProvider>
                        </AuthProvider>
                    </LocaleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
