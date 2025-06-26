"use client"; // Required for using hooks like useEffect and useRouter

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Loader2 } from 'lucide-react'; // For loading indicator

const PROTECTED_ROUTES = ['/checkout']; // Define routes that require authentication

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && PROTECTED_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading && PROTECTED_ROUTES.includes(pathname)) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-body text-muted-foreground">جاري التحقق من المصادقة...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If not loading and not authenticated but trying to access a protected route,
  // children might render briefly before redirect. This check prevents that.
  // However, the useEffect will handle the redirect.
  // For non-protected routes or if authenticated, render normally.
  if (!loading && !isAuthenticated && PROTECTED_ROUTES.includes(pathname)) {
      // This state means the redirect is about to happen.
      // You can return null or a minimal loading state, 
      // but the useEffect redirect is the primary mechanism.
      // Returning the loading indicator again for consistency until redirect.
       return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-body text-muted-foreground">التوجيه إلى تسجيل الدخول...</p>
            </div>
            </main>
            <Footer />
        </div>
        );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
