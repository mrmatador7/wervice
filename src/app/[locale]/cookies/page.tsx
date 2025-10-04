"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-14 sm:py-16 bg-gradient-to-b from-[#F3F1EE] to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11190C] mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-[#787664] max-w-2xl mx-auto">
              Learn how we use cookies and similar technologies to improve your experience on Wervice.
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

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">1. What Are Cookies</h2>
              <p className="text-[#787664] mb-6">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you
                with a better browsing experience and allow certain features to work properly.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">2. How We Use Cookies</h2>
              <p className="text-[#787664] mb-6">
                We use cookies for several purposes:
              </p>
              <ul className="text-[#787664] mb-6 ml-6">
                <li>• <strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li>• <strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li>• <strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li>• <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Essential Cookies</h3>
              <p className="text-[#787664] mb-6">
                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually
                only set in response to actions made by you which amount to a request for services.
              </p>

              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Analytics Cookies</h3>
              <p className="text-[#787664] mb-6">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                They help us to know which pages are the most and least popular and see how visitors move around the site.
              </p>

              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Functional Cookies</h3>
              <p className="text-[#787664] mb-6">
                These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by
                third-party providers whose services we have added to our pages.
              </p>

              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Marketing Cookies</h3>
              <p className="text-[#787664] mb-6">
                These cookies may be set through our site by our advertising partners. They may be used by those companies to build
                a profile of your interests and show you relevant adverts on other sites.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">4. Third-Party Cookies</h2>
              <p className="text-[#787664] mb-6">
                In some special cases we also use cookies provided by trusted third parties. The following section details which
                third-party cookies you might encounter through this site:
              </p>
              <ul className="text-[#787664] mb-6 ml-6">
                <li>• Google Analytics: Used to track website usage and performance</li>
                <li>• Social media platforms: Used when you share content from our site</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">5. Managing Cookies</h2>
              <p className="text-[#787664] mb-6">
                You can control and manage cookies in various ways:
              </p>
              <ul className="text-[#787664] mb-6 ml-6">
                <li>• Most web browsers allow you to control cookies through their settings preferences</li>
                <li>• You can delete all cookies that are already on your computer</li>
                <li>• You can set most browsers to prevent cookies from being placed</li>
                <li>• However, if you do this, you may have to manually adjust some preferences every time you visit a site</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">6. Cookie Consent</h2>
              <p className="text-[#787664] mb-6">
                When you first visit our website, you will be shown a cookie banner asking for your consent to use non-essential
                cookies. You can withdraw your consent at any time by updating your cookie preferences or contacting us.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">7. Updates to This Policy</h2>
              <p className="text-[#787664] mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational,
                legal, or regulatory reasons. We will notify you of any material changes.
              </p>

              <h2 className="text-2xl font-bold text-[#11190C] mb-6">8. Contact Us</h2>
              <p className="text-[#787664] mb-6">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at hello@wervice.com.
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

