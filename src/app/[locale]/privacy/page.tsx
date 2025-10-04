"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-14 sm:py-16 bg-gradient-to-b from-[#F3F1EE] to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11190C] mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-[#787664] max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-[#CAC4B7] mt-4">
              Last updated: December 2024
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-[#11190C]">

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">1. Information We Collect</h2>
              <p className="text-[#787664] mb-6">
                We collect information you provide directly to us, such as when you create an account, use our services,
                or contact us for support. This may include your name, email address, phone number, and wedding planning details.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">2. How We Use Your Information</h2>
              <p className="text-[#787664] mb-6">
                We use the information we collect to provide, maintain, and improve our services, communicate with you,
                process transactions, and ensure the security of our platform.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">3. Information Sharing</h2>
              <p className="text-[#787664] mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
                except as described in this policy or as required by law.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">4. Data Security</h2>
              <p className="text-[#787664] mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">5. Your Rights</h2>
              <p className="text-[#787664] mb-6">
                You have the right to access, update, or delete your personal information. You may also object to or restrict
                certain processing of your information.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">6. Cookies and Tracking</h2>
              <p className="text-[#787664] mb-6">
                We use cookies and similar technologies to enhance your experience on our website. See our Cookie Policy
                for more details.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">7. Contact Us</h2>
              <p className="text-[#787664] mb-6">
                If you have any questions about this Privacy Policy, please contact us at hello@wervice.com.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">8. Changes to This Policy</h2>
              <p className="text-[#787664] mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                policy on this page and updating the &quot;Last updated&quot; date.
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

