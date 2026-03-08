import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import VendorSubscribeForm from '../components/VendorSubscribeForm';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; cadence?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return {
    title: "Start your Wervice Vendor Subscription",
    description: "Fill out your business details — we'll review and contact you to activate your subscription.",
  };
}

export default async function VendorSubscribePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolved = await searchParams;
  const { category, cadence } = resolved;

  return (
    <div className="min-h-screen bg-[#F3F1EE] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1260px] overflow-hidden rounded-[28px] border border-black/10 bg-[#F7F5F2] shadow-[0_20px_60px_rgba(17,25,12,0.12)]">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          <aside className="relative hidden border-r border-black/10 bg-[#ECE8E1] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-16 top-[-120px] h-[320px] w-[320px] rounded-full bg-[#D9FF0A]/35 blur-3xl" />
            <div className="absolute -right-10 bottom-[-90px] h-[280px] w-[280px] rounded-full bg-[#C7D5EA]/45 blur-3xl" />
            <Link href={`/${locale}`} className="relative z-10 w-fit">
              <Image src="/wervice-logo-black.png" alt="Wervice Logo" width={190} height={56} className="h-12 w-auto" />
            </Link>
            <div className="relative z-10">
              <p className="mb-3 inline-flex rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#4A5C74]">
                Vendor Membership
              </p>
              <h1 className="text-5xl font-black leading-[0.95] text-[#11190C]">
                Join Wervice
                <br />
                and get discovered
                <br />
                by couples
              </h1>
              <p className="mt-5 max-w-md text-lg text-[#4A5C74]">
                Submit your business details and we will activate your profile after review.
              </p>
            </div>
          </aside>

          <main className="p-6 sm:p-10">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <h1 className="text-4xl font-black text-[#11190C]">Start your Wervice Vendor Subscription</h1>
                <p className="mt-2 text-[#5F6F84]">
                  Fill out your business details. We&apos;ll review and contact you to activate your subscription.
                </p>
              </div>

              <VendorSubscribeForm defaultCategory={category} defaultCadence={cadence} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
