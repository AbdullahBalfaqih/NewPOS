
"use client";
import { SignupForm } from '@/components/auth/SignupForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';

// export const metadata = { // Dynamic metadata handling
//   title: 'إنشاء حساب جديد - مطعم POS أونلاين',
//   description: 'أنشئ حسابًا جديدًا لطلب وجباتك المفضلة.',
// };

export default function SignupPage() {
  const { translate } = useLocale();
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">{translate("إنشاء حساب جديد", "Create New Account")}</CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          {translate("املأ النموذج أدناه للانضمام إلينا.", "Fill out the form below to join us.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="mt-6 text-center text-sm font-body text-muted-foreground">
          {translate("لديك حساب بالفعل؟", "Already have an account?")}{' '}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            {translate("تسجيل الدخول", "Login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
