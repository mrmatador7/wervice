import Link from 'next/link';
import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function VendorNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mx-auto max-w-md text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 grid h-16 w-16 place-content-center rounded-full bg-zinc-100">
            <Search className="h-8 w-8 text-zinc-400" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">
            Vendor Not Found
          </h1>

          {/* Description */}
          <p className="text-zinc-600 mb-8 leading-relaxed">
            We couldn't find the vendor you're looking for. It may have been removed, unpublished, or the link might be incorrect.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/en/vendors"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Browse All Vendors
            </Link>
            <Link
              href="/en"
              className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-zinc-500">
            Need help? <Link href="/en/contact" className="text-zinc-900 hover:underline">Contact us</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

