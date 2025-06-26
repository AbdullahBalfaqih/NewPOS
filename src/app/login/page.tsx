
"use client";
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';

// export const metadata = { // Dynamic metadata handling
//   title: 'تسجيل الدخول - مطعم POS أونلاين',
//   description: 'سجل الدخول للوصول إلى حسابك.',
// };

export default function LoginPage() {
  const { translate } = useLocale();
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">{translate("تسجيل الدخول", "Login")}</CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          {translate("مرحبًا بعودتك! أدخل بياناتك للمتابعة.", "Welcome back! Enter your details to continue.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-6 text-center text-sm font-body text-muted-foreground">
          {translate("ليس لديك حساب؟", "Don't have an account?")}{' '}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            {translate("إنشاء حساب جديد", "Create a new account")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
