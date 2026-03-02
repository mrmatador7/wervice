'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FiSearch,
  FiRefreshCw,
  FiMapPin,
  FiUsers,
  FiEye,
  FiCheckCircle,
} from 'react-icons/fi';
import Link from 'next/link';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

type CityStats = {
  city: string;
  vendorCount: number;
  publishedCount: number;
};

// Canonical Wervice cities (same 15 as filters and forms)
const CANONICAL_CITY_NAMES = MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => c.label);

export default function AdminCitiesPage() {
  const [statsFromApi, setStatsFromApi] = useState<CityStats[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/cities');
      const result = await response.json();

      if (result.success) {
        setStatsFromApi(result.cities);
      } else {
        console.error('Failed to fetch cities:', result.error);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Merge API stats with canonical list so all 15 Wervice cities are always shown
  const cities = useMemo(() => {
    const byCity = new Map<string, CityStats>();
    for (const row of statsFromApi) {
      byCity.set(row.city, { city: row.city, vendorCount: row.vendorCount, publishedCount: row.publishedCount });
    }
    return CANONICAL_CITY_NAMES.map((name) => ({
      city: name,
      vendorCount: byCity.get(name)?.vendorCount ?? 0,
      publishedCount: byCity.get(name)?.publishedCount ?? 0,
    }));
  }, [statsFromApi]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCities(cities);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredCities(
      cities.filter((c) => c.city.toLowerCase().includes(q))
    );
  }, [cities, searchQuery]);

  const totalVendors = cities.reduce((sum, c) => sum + c.vendorCount, 0);
  const totalPublished = cities.reduce((sum, c) => sum + c.publishedCount, 0);

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#11190C]">Cities</h1>
            <p className="text-gray-600 mt-1">
              Wervice cities and vendor counts per city
            </p>
          </div>
          <button
            onClick={fetchCities}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Cities</span>
              <FiMapPin className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-[#11190C]">
              {CANONICAL_CITY_NAMES.length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Vendors</span>
              <FiUsers className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-[#11190C]">
              {totalVendors}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Published Vendors</span>
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {totalPublished}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cities by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
          />
        </div>
      </div>

      {/* Cities Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9FF0A] mx-auto mb-4" />
          <p className="text-gray-600">Loading cities...</p>
        </div>
      ) : filteredCities.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No cities found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? 'Try a different search'
              : 'Vendor cities will appear here once vendors are added.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    City
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">
                    Vendors
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">
                    Published
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCities.map((row) => (
                  <tr
                    key={row.city}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-[#11190C]">
                        {row.city}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-700">
                      {row.vendorCount}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={
                          row.publishedCount === row.vendorCount
                            ? 'text-green-600 font-medium'
                            : 'text-gray-700'
                        }
                      >
                        {row.publishedCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/vendors?city=${encodeURIComponent(row.city)}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        View vendors
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && filteredCities.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredCities.length} of {cities.length} cities
        </div>
      )}
    </div>
  );
}
