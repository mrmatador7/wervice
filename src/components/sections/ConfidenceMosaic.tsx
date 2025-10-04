'use client';

import { FiShield, FiClock, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

/**
 * Wervice "Plan With Confidence" Mosaic
 * Drops in between New Vendors and Wedding Insights.
 *
 * Structure (desktop):
 * ┌─────────────────────┬──────────┬─────────────────────┐
 * │                     │   95%    │    Safe &           │
 * │    Tall Image       │   Stat   │    Secure          │
 * │    (5 cols,         │ (4 cols) │   (3 cols)         │
 * │     2 rows)         │          │                     │
 * ├─────────────────────┴──────────┴─────────────────────┤
 * │                                                     │
 * │        Save Time & Energy                           │
 * │        (7 cols, spans full width below image)       │
 * └─────────────────────────────────────────────────────┘
 */

export default function ConfidenceMosaic() {
  return (
    <div>
      <header className="text-center mb-8 md:mb-10">
        <h2 className="font-inter font-bold text-3xl md:text-4xl text-slate-900">
          Plan With Confidence
        </h2>
        <p className="text-slate-600 mt-2">
          We take care of the details so you can move forward with confidence—knowing you&apos;re fully supported.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
        {/* ImageTile */}
        <ImageTile
          src="/images/wervice/peace-of-mind.jpg"
          alt="Couple planning with Wervice"
          title="10,000+ Applications Processed"
          caption="Phone, text, and email support in 50+ languages with smart notifications."
        />

        {/* Stat 95% */}
        <div className="rounded-xl shadow-sm p-6 lg:col-span-4 bg-[linear-gradient(135deg,#DBFF59_0%,#F6FFD7_100%)]">
          <div className="text-[44px] md:text-6xl font-extrabold tracking-tight text-gray-900">
            95%
          </div>
          <p className="mt-2 text-sm md:text-base text-gray-800">Couples find what they need in minutes</p>
          <p className="mt-1 text-xs md:text-sm text-gray-600">Delivered faster and seamlessly</p>
        </div>

        {/* Safe & Secure */}
        <div className="rounded-xl shadow-sm p-6 lg:col-span-3 bg-[linear-gradient(135deg,#F7FEE7_0%,#F8FAFC_100%)] border border-lime-200/50">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 backdrop-blur border border-white/40">
              <FiShield className="h-5 w-5 text-gray-900" />
            </span>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Safe & Secure
            </h3>
          </div>
          <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-gray-700">
            Your data and messages are encrypted end-to-end. Contact vendors directly with verified profiles and no hidden fees.
          </p>
          <Link
            href="/safety"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:opacity-90"
          >
            Read more
            <svg
              className="h-4 w-4 translate-x-0 group-hover:translate-x-0.5 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
              <path d="M3 10a1 1 0 011-1h9a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </Link>
        </div>

        {/* Save Time & Energy */}
        <div className="rounded-xl shadow-sm p-6 lg:col-span-7 bg-[radial-gradient(120%_120%_at_0%_0%,#EEF9C7_0%,#FFFFFF_45%,#F1F5F9_100%)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 backdrop-blur border border-white/40">
              <FiClock className="h-5 w-5 text-gray-900" />
            </span>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Save Time & Energy
            </h3>
          </div>

          <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-gray-700">
            Skip endless calls—compare the right vendors in one place. Book faster with clear pricing and instant confirmations.
          </p>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <li className="flex items-center gap-2 text-sm text-gray-800">
              <span className="text-base">📊</span>
              <span>Smart matching</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-800">
              <span className="text-base">💬</span>
              <span>Direct vendor chat</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-800">
              <span className="text-base">🧾</span>
              <span>Transparent pricing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ImageTile({
  className = '',
  src,
  alt,
  title,
  caption,
}: {
  className?: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
}) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-sm lg:col-span-5 lg:row-span-2 ${className}`}>
      {/* image */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

      {/* text container */}
      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="text-white font-bold text-2xl md:text-3xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
          {title}
        </h3>
        <p className="text-white/90 mt-2 text-sm md:text-base drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
          {caption}
        </p>
      </div>
    </div>
  );
}