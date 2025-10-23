'use client';

import { Phone, Mail, MessageCircle } from 'lucide-react';
import type { VendorDetail } from '@/lib/db/vendors';

interface VendorContactCardProps {
  vendor: VendorDetail;
}

function normalizePhone(phone: string | null): string {
  if (!phone) return '';
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If starts with 0, replace with 212 (Morocco country code)
  if (digits.startsWith('0')) {
    return '212' + digits.substring(1);
  }
  // If already has country code, return as is
  if (digits.startsWith('212')) {
    return digits;
  }
  // Default: add Morocco country code
  return '212' + digits;
}

export default function VendorContactCard({ vendor }: VendorContactCardProps) {
  const normalizedPhone = normalizePhone(vendor.phone);
  const whatsappUrl = normalizedPhone ? `https://wa.me/${normalizedPhone}` : null;
  const telUrl = vendor.phone ? `tel:${vendor.phone}` : null;
  const emailUrl = vendor.email
    ? `mailto:${vendor.email}?subject=${encodeURIComponent(`Wedding Inquiry from Wervice - ${vendor.business_name}`)}`
    : null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900 mb-1">
        Contact {vendor.business_name}
      </h3>
      <p className="text-sm text-zinc-500 mb-6">
        Get in touch to discuss your wedding
      </p>

      {/* Price Reminder */}
      {vendor.starting_price ? (
        <div className="mb-6 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
          <p className="text-xs text-zinc-500 mb-1">Starting from</p>
          <p className="text-2xl font-bold text-zinc-900">
            MAD {vendor.starting_price.toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="mb-6 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
          <p className="text-sm text-zinc-600">Price available on request</p>
        </div>
      )}

      {/* Contact Buttons */}
      <div className="space-y-3">
        {/* WhatsApp */}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors w-full"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        )}

        {/* Call */}
        {telUrl && (
          <a
            href={telUrl}
            className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors w-full"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        )}

        {/* Email */}
        {emailUrl && (
          <a
            href={emailUrl}
            className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors w-full"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </a>
        )}

        {/* Fallback if no contact methods */}
        {!whatsappUrl && !telUrl && !emailUrl && (
          <div className="rounded-xl bg-zinc-50 p-4 text-center">
            <p className="text-sm text-zinc-500">
              Contact information not available
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-zinc-100">
        <p className="text-xs text-zinc-500 leading-relaxed">
          💡 Most vendors respond within 24 hours. Be sure to mention your wedding date and location.
        </p>
      </div>
    </div>
  );
}

