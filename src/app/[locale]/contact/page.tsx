"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiMessageCircle } from "react-icons/fi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      label: "Email",
      value: "hello@wervice.com",
      href: "mailto:hello@wervice.com",
      icon: FiMail,
      description: "Send us an email anytime"
    },
    {
      label: "Phone",
      value: "+212 6 12 34 56 78",
      href: "tel:+212612345678",
      icon: FiPhone,
      description: "Call us during office hours"
    },
    {
      label: "WhatsApp",
      value: "+212 6 12 34 56 78",
      href: "https://wa.me/212612345678",
      icon: FiMessageCircle,
      description: "Quick message via WhatsApp"
    }
  ];

  const faqItems = [
    {
      question: "How do I contact vendors?",
      answer: "Use the phone number or email listed on each vendor's profile page. You can contact them directly to ask questions or make bookings."
    },
    {
      question: "Can I book vendors through Wervice?",
      answer: "For now, you contact vendors directly through their provided contact information to confirm availability and make bookings."
    },
    {
      question: "How do I become a vendor?",
      answer: "Visit our 'Become a Vendor' page to learn about the process and submit your application to join our platform."
    },
    {
      question: "Is Wervice available in all Moroccan cities?",
      answer: "We're expanding across Morocco. Check our cities page to see which locations currently have active vendors."
    },
    {
      question: "How does Wervice work?",
      answer: "Browse vendors by category and city, contact them directly, and create your perfect wedding experience with their help."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const to = "hello@wervice.com";
    const subject = encodeURIComponent(`Support - ${topic}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`);

    // Open email client
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    // Show confirmation
    alert("Opening your email app...");

    setIsSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-14 sm:py-16 bg-gradient-to-b from-[#F3F1EE] to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11190C] mb-4">
            Contact Wervice
          </h1>
          <p className="text-lg text-[#787664] max-w-2xl mx-auto">
            Questions, feedback, or partnership ideas? We&apos;re here to help make your wedding planning journey smooth and memorable.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group relative rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <method.icon className="w-6 h-6 text-[#11190C] mb-3" />
                    <h3 className="text-lg font-semibold text-[#11190C] mb-1">
                      {method.label}
                    </h3>
                    <p className="text-[#787664] text-sm mb-2">
                      {method.description}
                    </p>
                    <p className="text-[#11190C] font-medium">
                      {method.value}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(method.value);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-[#F3F1EE] ml-2"
                    aria-label={`Copy ${method.label}`}
                  >
                    <svg className="w-4 h-4 text-[#787664]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-14 sm:py-16 bg-[#F3F1EE]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 lg:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#11190C] mb-2">Send us a message</h2>
                <p className="text-[#787664]">We&apos;ll get back to you within 24 hours.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#11190C] mb-2">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#11190C] mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-[#11190C] mb-2">
                  Topic
                </label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Partnerships">Partnerships</option>
                  <option value="Press">Press & Media</option>
                  <option value="Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#11190C] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-xl bg-[#11190C] text-white font-semibold px-8 py-4 hover:opacity-95 focus:ring-2 focus:ring-[#11190C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#11190C] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#787664] max-w-2xl mx-auto">
              Quick answers to common questions about using Wervice.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {faqItems.map((item, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#11190C] mb-3">
                  {item.question}
                </h3>
                <p className="text-[#787664] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
