import { Calendar, MapPin, Tag, Award } from 'lucide-react';
import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import type { VendorDetail } from '@/lib/db/vendors';
import { localizeCityLabel } from '@/lib/types/vendor';

interface VendorMetaProps {
  vendor: VendorDetail;
  locale?: string;
}

export default function VendorMeta({ vendor, locale = 'en' }: VendorMetaProps) {
  const categoryLabel = labelForCategory(vendor.category, locale);
  const cityLabel = localizeCityLabel(capitalizeCity(vendor.city), locale);
  
  // Format the created date
  const joinDate = new Date(vendor.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Details</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-zinc-100 p-2">
            <Tag className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Category</p>
            <p className="text-sm font-medium text-zinc-900">{categoryLabel}</p>
          </div>
        </div>

        {/* City */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-zinc-100 p-2">
            <MapPin className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Location</p>
            <p className="text-sm font-medium text-zinc-900">{cityLabel}</p>
          </div>
        </div>

        {/* Plan */}
        {vendor.plan && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-zinc-100 p-2">
              <Award className="h-4 w-4 text-zinc-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Plan</p>
              <p className="text-sm font-medium text-zinc-900 capitalize">{vendor.plan}</p>
            </div>
          </div>
        )}

        {/* Member Since */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-zinc-100 p-2">
            <Calendar className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Member since</p>
            <p className="text-sm font-medium text-zinc-900">{joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
