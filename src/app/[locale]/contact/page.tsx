"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FiMail, FiPhone, FiMessageCircle } from "react-icons/fi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const t = useTranslations('contact');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      label: t('methods.email.label'),
      value: t('methods.email.value'),
      href: "mailto:hello@wervice.com",
      icon: FiMail,
      description: t('methods.email.description')
    },
    {
      label: t('methods.phone.label'),
      value: t('methods.phone.value'),
      href: "tel:+212612345678",
      icon: FiPhone,
      description: t('methods.phone.description')
    },
    {
      label: t('methods.whatsapp.label'),
      value: t('methods.whatsapp.value'),
      href: "https://wa.me/212612345678",
      icon: FiMessageCircle,
      description: t('methods.whatsapp.description')
    }
  ];

  const faqItems = [
    {
      question: t('faq.items.contactVendors.question'),
      answer: t('faq.items.contactVendors.answer')
    },
    {
      question: t('faq.items.bookVendors.question'),
      answer: t('faq.items.bookVendors.answer')
    },
    {
      question: t('faq.items.becomeVendor.question'),
      answer: t('faq.items.becomeVendor.answer')
    },
    {
      question: t('faq.items.availability.question'),
      answer: t('faq.items.availability.answer')
    },
    {
      question: t('faq.items.howItWorks.question'),
      answer: t('faq.items.howItWorks.answer')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert(t('form.required'));
      return;
    }

    setIsSubmitting(true);

    const to = "hello@wervice.com";
    const subject = encodeURIComponent(`Support - ${topic}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`);

    // Open email client
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    // Show confirmation
    alert(t('form.sent'));

    setIsSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(t('form.copied'));
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
              {t('title')}
            </h1>
            <p className="text-lg text-[#787664] max-w-2xl mx-auto">
              {t('subtitle')}
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
                <h2 className="text-2xl font-bold text-[#11190C] mb-2">{t('form.title')}</h2>
                <p className="text-[#787664]">{t('form.subtitle')}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#11190C] mb-2">
                    {t('form.name')} *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors"
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#11190C] mb-2">
                    {t('form.email')} *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-[#11190C] mb-2">
                  {t('form.topic')}
                </label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors"
                >
                  <option value="general">{t('form.topics.general')}</option>
                  <option value="partnerships">{t('form.topics.partnerships')}</option>
                  <option value="press">{t('form.topics.press')}</option>
                  <option value="support">{t('form.topics.support')}</option>
                  <option value="feedback">{t('form.topics.feedback')}</option>
                  <option value="other">{t('form.topics.other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#11190C] mb-2">
                  {t('form.message')} *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#CAC4B7]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#CAC4B7]/40 focus:border-[#CAC4B7] transition-colors resize-none"
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-xl bg-[#11190C] text-white font-semibold px-8 py-4 hover:opacity-95 focus:ring-2 focus:ring-[#11190C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? t('form.submitting') : t('form.submit')}
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#11190C] mb-4">
                {t('faq.title')}
              </h2>
              <p className="text-[#787664] max-w-2xl mx-auto">
                {t('faq.subtitle')}
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
