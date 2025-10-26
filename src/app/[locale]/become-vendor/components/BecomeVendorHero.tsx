import Link from 'next/link';

export default function BecomeVendorHero() {

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Mesh Gradient Background with Wervice Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F3F1EE] via-[#E8E5DC] to-[#CAC4B7]" />
      
      {/* Decorative Mesh Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#D9FF0A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#787664] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#CAC4B7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-[#D9FF0A] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#11190C] mb-4 leading-tight">
          Get More Wedding Leads—Fast.
        </h1>
        
        {/* Subtitle */}
        <p className="text-base md:text-lg text-[#787664] mb-8 leading-relaxed max-w-2xl mx-auto">
          Join Morocco's wedding marketplace. Create your free vendor profile and start receiving WhatsApp inquiries this week.
        </p>

        {/* CTA */}
        <div className="flex items-center justify-center">
          <Link 
            href="#pricing"
            className="bg-[#D9FF0A] text-[#11190C] px-8 py-3 rounded-full font-semibold hover:bg-[#11190C] hover:text-[#D9FF0A] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            See Plans & Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

