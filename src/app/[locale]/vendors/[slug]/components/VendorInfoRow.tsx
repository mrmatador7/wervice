'use client';

import { Vendor } from '@/lib/types';
import { KEY_INFO_SPEC } from '@/lib/keyInfoSpec';

interface VendorInfoRowProps {
  vendor: Vendor;
}

export function VendorInfoRow({ vendor }: VendorInfoRowProps) {
  const spec = KEY_INFO_SPEC[vendor.category] || [];
  const items = spec
    .map(it => ({ label: it.label, val: it.value(vendor) }))
    .filter(it => it.val); // only show available data

  if (!items.length) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map(({ label, val }) => (
          <div key={label} className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4">
            <div className="text-xs text-[#787664]">{label}</div>
            <div className="mt-1 text-sm font-semibold text-[#11190C]">{val}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
