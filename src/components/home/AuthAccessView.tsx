import Link from 'next/link';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';

type AuthAccessViewProps = {
  locale: string;
};

export default function AuthAccessView({ locale }: AuthAccessViewProps) {
  const copy = getDashboardCopy(locale);
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
      <div className="w-full rounded-3xl border border-[#d7deea] bg-white p-10 text-center shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.auth.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-[#4a5c74]">
          {copy.auth.subtitle}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/auth/signin`}
            className="inline-flex min-w-[150px] items-center justify-center rounded-xl bg-[#11190C] px-5 py-3 text-sm font-bold text-[#D9FF0A]"
          >
            {copy.auth.signIn}
          </Link>
          <Link
            href={`/${locale}/auth/signup`}
            className="inline-flex min-w-[150px] items-center justify-center rounded-xl border border-[#d2d9e5] bg-white px-5 py-3 text-sm font-bold text-[#33475f] hover:bg-[#F3EFE7]"
          >
            {copy.auth.signUp}
          </Link>
        </div>
      </div>
    </section>
  );
}
