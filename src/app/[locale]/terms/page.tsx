"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-14 sm:py-16 bg-gradient-to-b from-[#F3F1EE] to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11190C] mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-[#787664] max-w-2xl mx-auto">
              Please read these terms carefully before using Wervice. By using our platform, you agree to these terms.
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

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">1. Acceptance of Terms</h2>
              <p className="text-[#787664] mb-6">
                By accessing and using Wervice, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">2. Use License</h2>
              <p className="text-[#787664] mb-6">
                Permission is granted to temporarily use Wervice for personal, non-commercial transitory viewing only.
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="text-[#787664] mb-6 ml-6">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose</li>
                <li>• Attempt to decompile or reverse engineer any software</li>
                <li>• Remove any copyright or other proprietary notations</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">3. User Accounts</h2>
              <p className="text-[#787664] mb-6">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">4. Vendor Services</h2>
              <p className="text-[#787664] mb-6">
                Wervice connects couples with wedding vendors. We facilitate connections but are not responsible for the quality,
                safety, or legality of services provided by vendors. All transactions and arrangements are made directly between
                couples and vendors.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">5. Content</h2>
              <p className="text-[#787664] mb-6">
                Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics,
                or other material. You are responsible for content that you post to the service.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">6. Prohibited Uses</h2>
              <p className="text-[#787664] mb-6">
                You may not use our service:
              </p>
              <ul className="text-[#787664] mb-6 ml-6">
                <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">7. Termination</h2>
              <p className="text-[#787664] mb-6">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
                including without limitation if you breach the Terms.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">8. Limitation of Liability</h2>
              <p className="text-[#787664] mb-6">
                In no event shall Wervice, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for
                any indirect, incidental, special, consequential, or punitive damages.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">9. Governing Law</h2>
              <p className="text-[#787664] mb-6">
                These Terms shall be interpreted and governed by the laws of Morocco, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">10. Contact Information</h2>
              <p className="text-[#787664] mb-6">
                If you have any questions about these Terms of Service, please contact us at hello@wervice.com.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">11. Changes to Terms</h2>
              <p className="text-[#787664] mb-6">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material,
                we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

