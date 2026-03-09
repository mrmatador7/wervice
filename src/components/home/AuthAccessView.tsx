'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type AuthAccessViewProps = {
  locale: string;
};

type AuthMode = 'signin' | 'signup';

function authText(locale: string) {
  if (locale === 'fr') {
    return {
      signinTitle: 'Connexion',
      signinSubtitle: 'Connectez-vous pour accéder à vos outils et favoris.',
      signupTitle: 'Créer un compte',
      signupSubtitle: 'Rejoignez Wervice et commencez à organiser votre mariage.',
      name: 'Nom',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      agree: "J'accepte les Conditions et la Politique de confidentialité",
      terms: 'Conditions',
      privacy: 'Confidentialité',
      signIn: 'Se connecter',
      signUp: "S'inscrire",
      noAccount: "Vous n'avez pas de compte ?",
      hasAccount: 'Vous avez déjà un compte ?',
      switchToSignUp: "S'inscrire",
      switchToSignIn: 'Se connecter',
      loadingSignIn: 'Connexion...',
      loadingSignUp: 'Création du compte...',
      leftBadge: 'Compte Wervice',
      leftTitle: 'Planifiez\nvotre mariage\navec Wervice',
      leftSubtitle: 'Créez votre compte pour accéder à vos outils et favoris.',
      placeholderName: 'Entrez votre nom...',
      placeholderEmail: 'mail@exemple.com',
    };
  }
  if (locale === 'ar') {
    return {
      signinTitle: 'تسجيل الدخول',
      signinSubtitle: 'سجّل الدخول للوصول إلى أدواتك ومفضلاتك.',
      signupTitle: 'إنشاء حساب',
      signupSubtitle: 'انضم إلى Wervice وابدأ تخطيط زفافك.',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      agree: 'أوافق على الشروط وسياسة الخصوصية',
      terms: 'الشروط',
      privacy: 'الخصوصية',
      signIn: 'دخول',
      signUp: 'إنشاء حساب',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      switchToSignUp: 'إنشاء حساب',
      switchToSignIn: 'تسجيل الدخول',
      loadingSignIn: 'جارٍ تسجيل الدخول...',
      loadingSignUp: 'جارٍ إنشاء الحساب...',
      leftBadge: 'حساب Wervice',
      leftTitle: 'ابدأ\nتخطيط زفافك\nمع Wervice',
      leftSubtitle: 'أنشئ حسابك للوصول إلى أدواتك ومزوديك المفضلين.',
      placeholderName: 'اكتب اسمك...',
      placeholderEmail: 'mail@example.com',
    };
  }
  return {
    signinTitle: 'Sign in',
    signinSubtitle: 'Please log in to access your dashboard tools and favorites.',
    signupTitle: 'Create account',
    signupSubtitle: 'Join Wervice and start planning your wedding.',
    name: 'Name',
    email: 'Email address',
    password: 'Password',
    agree: 'I agree to the Terms & Privacy',
    terms: 'Terms',
    privacy: 'Privacy',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    switchToSignUp: 'Sign up',
    switchToSignIn: 'Log in',
    loadingSignIn: 'Signing in...',
    loadingSignUp: 'Creating account...',
    leftBadge: 'Wervice Account',
    leftTitle: 'Start your\nwedding planning\nwith Wervice',
    leftSubtitle: 'Create your account to unlock tools, saved vendors, and planning progress.',
    placeholderName: 'Enter your name...',
    placeholderEmail: 'workmail@gmail.com',
  };
}

export default function AuthAccessView({ locale }: AuthAccessViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const t = useMemo(() => authText(locale), [locale]);

  const [signinData, setSigninData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'auth');
    params.set('mode', nextMode);
    router.replace(`/${locale}/vendors?${params.toString()}`);
    setError('');
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!agreedToTerms) {
      setError(locale === 'ar' ? 'الرجاء الموافقة على الشروط والخصوصية للمتابعة' : locale === 'fr' ? 'Veuillez accepter les Conditions et la confidentialité pour continuer' : 'Please agree to the Terms & Privacy to continue');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: signinData.email,
          password: signinData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Sign in failed');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem(
          'wervice_user',
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            signedInAt: new Date().toISOString(),
          })
        );
        if (data.user_type) {
          localStorage.setItem(
            'wervice_profile',
            JSON.stringify({
              user_type: data.user_type,
              id: data.user.id,
              email: data.user.email,
            })
          );
        }
      }

      const isAdmin = data.user_type === 'admin' || data.user_type === 'super_admin';
      if (isAdmin) {
        window.location.href = '/admin';
        return;
      }
      window.location.href = `/${locale}/vendors`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!agreedToTerms) {
      setError(locale === 'ar' ? 'الرجاء الموافقة على الشروط والخصوصية للمتابعة' : locale === 'fr' ? 'Veuillez accepter les Conditions et la confidentialité pour continuer' : 'Please agree to the Terms & Privacy to continue');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          firstName: signupData.firstName,
          lastName: signupData.lastName || signupData.firstName,
          locale,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem(
          'wervice_user',
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            firstName: signupData.firstName,
            lastName: signupData.lastName || signupData.firstName,
            locale,
            signedUpAt: new Date().toISOString(),
          })
        );
      }

      window.location.href = `/${locale}/vendors`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center py-6">
      <div className="grid w-full overflow-hidden rounded-[28px] border border-black/10 bg-[#F7F5F2] shadow-[0_20px_60px_rgba(17,25,12,0.12)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden border-r border-black/10 bg-[#ECE8E1] lg:block">
          <div className="absolute -left-16 top-[-120px] h-[320px] w-[320px] rounded-full bg-[#D9FF0A]/35 blur-3xl" />
          <div className="absolute -right-10 bottom-[-90px] h-[280px] w-[280px] rounded-full bg-[#C7D5EA]/45 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10">
            <Link href={`/${locale}/vendors`} className="w-fit">
              <Image src="/wervice-logo-black.png" alt="Wervice Logo" width={190} height={56} className="h-12 w-auto" />
            </Link>
            <div>
              <p className="mb-3 inline-flex rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#4A5C74]">
                {t.leftBadge}
              </p>
              <h1 className="whitespace-pre-line text-5xl font-black leading-[0.95] text-[#11190C]">{t.leftTitle}</h1>
              <p className="mt-5 max-w-md text-lg text-[#4A5C74]">{t.leftSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href={`/${locale}/vendors`}>
                <Image src="/wervice-logo-black.png" alt="Wervice Logo" width={150} height={44} className="mx-auto h-10 w-auto" />
              </Link>
            </div>

            <div className="mb-6 flex rounded-xl border border-[#d2d9e5] bg-white p-1">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${mode === 'signin' ? 'bg-[#11190C] text-[#D9FF0A]' : 'text-[#33475f]'}`}
              >
                {t.signIn}
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-[#11190C] text-[#D9FF0A]' : 'text-[#33475f]'}`}
              >
                {t.signUp}
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-4xl font-black text-[#11190C]">{mode === 'signin' ? t.signinTitle : t.signupTitle}</h2>
              <p className="mt-2 text-[#5F6F84]">{mode === 'signin' ? t.signinSubtitle : t.signupSubtitle}</p>
            </div>

            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-5">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#33475F]">
                    {t.name}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={signupData.firstName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, firstName: e.target.value, lastName: e.target.value }))}
                    className="w-full rounded-xl border border-[#D2D9E5] bg-white px-4 py-3 text-[#11190C] outline-none transition focus:border-[#11190C]"
                    placeholder={t.placeholderName}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#33475F]">
                  {t.email}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={mode === 'signin' ? signinData.email : signupData.email}
                  onChange={(e) =>
                    mode === 'signin'
                      ? setSigninData((prev) => ({ ...prev, email: e.target.value }))
                      : setSignupData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#D2D9E5] bg-white px-4 py-3 text-[#11190C] outline-none transition focus:border-[#11190C]"
                  placeholder={t.placeholderEmail}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#33475F]">
                  {t.password}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  value={mode === 'signin' ? signinData.password : signupData.password}
                  onChange={(e) =>
                    mode === 'signin'
                      ? setSigninData((prev) => ({ ...prev, password: e.target.value }))
                      : setSignupData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#D2D9E5] bg-white px-4 py-3 text-[#11190C] outline-none transition focus:border-[#11190C]"
                  placeholder="••••••••••"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-[#C7D0DE] text-[#11190C]"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-[#5F6F84]">
                  {t.agree}{' '}
                  <Link href={`/${locale}/terms`} className="font-semibold text-[#33475F] hover:underline">
                    {t.terms}
                  </Link>{' '}
                  &{' '}
                  <Link href={`/${locale}/privacy`} className="font-semibold text-[#33475F] hover:underline">
                    {t.privacy}
                  </Link>
                </label>
              </div>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#11190C] px-4 py-3.5 font-semibold text-[#D9FF0A] transition hover:brightness-110 disabled:opacity-60"
              >
                {isLoading ? (mode === 'signin' ? t.loadingSignIn : t.loadingSignUp) : mode === 'signin' ? t.signIn : t.signUp}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#5F6F84]">
              {mode === 'signin' ? t.noAccount : t.hasAccount}{' '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-semibold text-[#11190C] hover:underline"
              >
                {mode === 'signin' ? t.switchToSignUp : t.switchToSignIn}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
