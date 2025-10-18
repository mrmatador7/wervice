import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getVendorBySlug } from '@/lib/vendors-server';
import { getVendorBySlug as getMockVendorBySlug } from '@/data/vendors.mock';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let vendor = await getVendorBySlug(slug);

  if (!vendor) {
    vendor = getMockVendorBySlug(slug) as any;
  }

  if (!vendor) {
    return {
      title: 'Vendor Not Found | Wervice',
    };
  }

  const vendorName = (vendor as any).business_name || (vendor as any).name;
  const vendorCategory = (vendor as any).category;
  const vendorCity = (vendor as any).city;
  const vendorDescription = (vendor as any).description;

  return {
    title: `${vendorName} - ${vendorCategory} in ${vendorCity} | Wervice`,
    description: vendorDescription?.slice(0, 155) || `${vendorName} - Professional ${vendorCategory} services in ${vendorCity}, Morocco.`,
    keywords: `${vendorCategory}, ${vendorCity}, Morocco, wedding services, ${vendorName}`,
    openGraph: {
      title: `${vendorName} - ${vendorCategory} in ${vendorCity}`,
      description: vendorDescription?.slice(0, 155) || `${vendorName} - Professional ${vendorCategory} services in ${vendorCity}, Morocco.`,
      images: [{ url: (vendor as any).profile_photo_url || (vendor as any).coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop' }],
      type: 'website',
    },
  };
}

export default async function VendorProfilePage({ params }: PageProps) {
  const { slug } = await params;

  // Try to get vendor from real database first
  let vendor = await getVendorBySlug(slug);

  // Fall back to mock data if not found
  if (!vendor) {
    vendor = getMockVendorBySlug(slug) as any;
  }

  if (!vendor) {
    notFound();
  }

  const vendorData = vendor as any;
  const vendorName = vendorData.business_name || vendorData.name;
  const vendorCategory = vendorData.category;
  const vendorCity = vendorData.city;
  const vendorRating = vendorData.rating;
  const vendorPrice = vendorData.starting_price;
  const vendorDescription = vendorData.description;
  const vendorPhone = vendorData.phone;
  const vendorEmail = vendorData.email;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {vendorName}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
              <p className="text-gray-600 mb-2"><strong>Category:</strong> {vendorCategory}</p>
              <p className="text-gray-600 mb-2"><strong>City:</strong> {vendorCity}</p>
              {vendorRating && (
                <p className="text-gray-600 mb-2"><strong>Rating:</strong> {vendorRating}/5</p>
              )}
              {vendorPrice && (
                <p className="text-gray-600 mb-2"><strong>Starting Price:</strong> MAD {vendorPrice.toLocaleString()}</p>
              )}
            </div>

            <div>
              {vendorDescription && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-600">{vendorDescription}</p>
                </>
              )}
            </div>
          </div>

          {(vendorPhone || vendorEmail) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                {vendorPhone && (
                  <a
                    href={`https://wa.me/${vendorPhone}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Contact on WhatsApp
                  </a>
                )}
                {vendorEmail && (
                  <a
                    href={`mailto:${vendorEmail}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Email
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
