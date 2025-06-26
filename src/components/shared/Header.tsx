
"use client";
import Image from 'next/image';
import Logo2 from '@/app/logo2.png';  // الشعار النهاري
import Logo from '@/app/logo.png';
import Link from 'next/link';
import { ClipboardList,Home,MessageSquareWarning,Utensils, ShoppingCart, Menu as MenuIcon, LogIn, LogOut, UserPlus, Sun, Moon, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useLocale } from '@/contexts/LocaleContext';

export function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, translate, direction } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

    const mainNavLinks = [
        { href: '/', labelAr: 'الرئيسية', labelEn: 'Home', icon: <Home className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} /> },
    { href: '/menu', labelAr: 'القائمة', labelEn: 'Menu', icon: <Utensils className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} /> },
      { href: '/feedback', labelAr: 'الشكاوى والاقتراحات', labelEn: 'Feedback', icon: <MessageSquareWarning className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} /> },

        { href: '/instructions', labelAr: 'التعليمات', labelEn: 'instructions', icon: <ClipboardList className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} /> },
        { href: '/checkout', labelAr: 'طلبي', labelEn: 'My Order', icon: <ShoppingCart className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />, badge: totalItems > 0 ? totalItems : undefined },
  ];

  const AuthNavLinksContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {mainNavLinks.map((link) => (
        <Button 
          key={link.href} 
          variant="ghost" 
          asChild 
          className={`font-body text-foreground hover:bg-accent/10 ${isMobile ? 'justify-start w-full' : ''}`}
        >
          <Link href={link.href} className="flex items-center gap-2" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
            {link.icon}
            {translate(link.labelAr, link.labelEn)}
            {link.badge && (
              <span className={`${direction === 'rtl' ? 'mr-1' : 'ml-1'} inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-accent-foreground bg-accent rounded-full`}>
                {link.badge}
              </span>
            )}
          </Link>
        </Button>
      ))}
    </>
  );

    const UserAvatar = () => {
        if (loading || !mounted) return null;
        if (!isAuthenticated || !user) return null;

        // A more robust way to get the initial
        const fallbackChar = (user.name || user.username || 'U').charAt(0).toUpperCase();

        // Use the user's full name for the avatar API if available, otherwise the username
        const avatarName = encodeURIComponent(user.name || user.username);

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-9 w-9">
                            {/* Use ui-avatars.com for a nicer, more reliable avatar */}
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${avatarName}&background=random&color=fff`} alt={user.name || 'User Avatar'} />
                            <AvatarFallback>{fallbackChar}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align={direction === 'rtl' ? "end" : "start"} forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none text-primary">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                        <LogOut className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                        {translate('تسجيل الخروج', 'Logout')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };
  const ThemeToggleButton = () => {
    if (!mounted) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={translate("تغيير الوضع", "Toggle theme")}
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    );
  };

  const LanguageToggleButton = () => {
    if (!mounted) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
        aria-label={translate("تغيير اللغة", "Toggle language")}
      >
        <Languages className="h-5 w-5" />
      </Button>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link
                  href="/"
                  className="flex items-center gap-2"
                  aria-label={translate(
                      "الصفحة الرئيسية لمطعم كرسبر أونلاين",
                      "Crisper Restaurant Online Home"
                  )}
              >
                  <Image
                      src={theme === 'dark' ? Logo : Logo2}
                      alt={translate('شعار مطعم كرسبر', 'Crisper Restaurant Logo')}
                      width={130}
                      height={130}
                      className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}
                  />
                  <span className="font-headline text-2xl font-semibold text-primary">
                      {translate('مطعم كرسبر', 'Crisper Restaurant Online')}
                  </span>
              </Link>
        
        <nav className="hidden md:flex items-center gap-x-1 lg:gap-x-2">
          <AuthNavLinksContent />
           {!loading && !isAuthenticated && mounted && (
            <>
              <Button variant="ghost" asChild className="font-body text-foreground hover:bg-accent/10">
                <Link href="/login" className="flex items-center gap-2">
                  <LogIn className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {translate('تسجيل الدخول', 'Login')}
                </Link>
              </Button>
              <Button asChild className="font-body bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup" className="flex items-center gap-2">
                  <UserPlus className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {translate('إنشاء حساب', 'Sign Up')}
                </Link>
              </Button>
            </>
          )}
          <UserAvatar />
          <ThemeToggleButton />
          <LanguageToggleButton />
        </nav>

        <div className="md:hidden flex items-center gap-2">
           {!loading && isAuthenticated && mounted && <UserAvatar />}
           {mounted && <ThemeToggleButton />}
           {mounted && <LanguageToggleButton />}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">{translate('فتح القائمة', 'Open menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={direction === 'rtl' ? "right" : "left"} className="w-[280px] bg-background p-0 pt-6">
              <SheetHeader className="p-6 pt-0 border-b mb-4">
                <SheetTitle className={`font-headline text-2xl text-primary ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>{translate('القائمة', 'Menu')}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-2 px-6">
                <AuthNavLinksContent isMobile={true} />
                 {!loading && !isAuthenticated && mounted && (
                  <>
                    <Button variant="ghost" asChild className="font-body text-foreground hover:bg-accent/10 justify-start w-full">
                      <Link href="/login" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <LogIn className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                        {translate('تسجيل الدخول', 'Login')}
                      </Link>
                    </Button>
                    <Button asChild className="font-body bg-primary hover:bg-primary/90 text-primary-foreground justify-start w-full">
                      <Link href="/signup" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <UserPlus className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                        {translate('إنشاء حساب', 'Sign Up')}
                      </Link>
                    </Button>
                  </>
                )}
                {!loading && isAuthenticated && mounted &&(
                   <Button variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="font-body text-destructive hover:bg-destructive/10 justify-start w-full">
                     <LogOut className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                     {translate('تسجيل الخروج', 'Logout')}
                   </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
