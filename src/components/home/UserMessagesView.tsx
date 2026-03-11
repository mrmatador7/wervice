'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, MessageSquare, ExternalLink } from 'lucide-react';

type UserMessage = {
  id: string;
  vendorLogoUrl?: string | null;
  vendorName: string;
  vendorCategory: string | null;
  vendorCity: string | null;
  vendorUrl: string | null;
  message: string;
  isRead: boolean;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
};

type MessageThread = {
  id: string;
  vendorLogoUrl?: string | null;
  vendorName: string;
  vendorCategory: string | null;
  vendorCity: string | null;
  vendorUrl: string | null;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
  messages: UserMessage[];
};

function formatDate(value: string, locale: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return '';
  const localeTag = locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US';
  return dt.toLocaleString(localeTag, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatRelative(value: string, locale: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return '';

  const localeTag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr' : 'en';
  const rtf = new Intl.RelativeTimeFormat(localeTag, { numeric: 'auto' });
  const diffMs = dt.getTime() - Date.now();
  const absMs = Math.abs(diffMs);

  const minute = 60_000;
  const hour = minute * 60;
  const day = hour * 24;

  if (absMs < hour) return rtf.format(Math.round(diffMs / minute), 'minute');
  if (absMs < day) return rtf.format(Math.round(diffMs / hour), 'hour');
  return rtf.format(Math.round(diffMs / day), 'day');
}

function threadKeyOf(message: UserMessage) {
  const urlPart = (message.vendorUrl || '').trim().toLowerCase();
  if (urlPart) return urlPart;
  return `${message.vendorName.trim().toLowerCase()}|${(message.vendorCity || '').trim().toLowerCase()}`;
}

function vendorInitials(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return '?';
  return parts.map((part) => part[0]?.toUpperCase() || '').join('');
}

function buildThreads(messages: UserMessage[]): MessageThread[] {
  const grouped = new Map<string, UserMessage[]>();

  for (const message of messages) {
    const key = threadKeyOf(message);
    const list = grouped.get(key) || [];
    list.push(message);
    grouped.set(key, list);
  }

  const threads: MessageThread[] = [];
  for (const [, list] of grouped.entries()) {
    const sorted = [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const last = sorted[sorted.length - 1];
    threads.push({
      id: threadKeyOf(last),
      vendorLogoUrl: last.vendorLogoUrl || null,
      vendorName: last.vendorName,
      vendorCategory: last.vendorCategory,
      vendorCity: last.vendorCity,
      vendorUrl: last.vendorUrl,
      unreadCount: sorted.filter((entry) => !entry.isRead).length,
      lastMessage: last.message,
      lastMessageAt: last.createdAt,
      messages: sorted,
    });
  }

  return threads.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export default function UserMessagesView({ locale }: { locale: string }) {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const copy = useMemo(() => {
    if (locale === 'fr') {
      return {
        title: 'Messages',
        subtitle: 'Suivez vos conversations avec les prestataires.',
        loading: 'Chargement des messages...',
        emptyTitle: 'Aucun message pour le moment',
        emptySubtitle: 'Contactez un prestataire depuis sa page pour démarrer une conversation.',
        browse: 'Voir les prestataires',
        sentOn: 'Envoyé le',
        openVendor: 'Ouvrir la page prestataire',
        conversations: 'Conversations',
        history: 'Historique',
        selectConversation: 'Sélectionnez une conversation pour voir l’historique.',
      };
    }
    if (locale === 'ar') {
      return {
        title: 'الرسائل',
        subtitle: 'تابع محادثاتك مع المزوّدين.',
        loading: 'جاري تحميل الرسائل...',
        emptyTitle: 'لا توجد رسائل حالياً',
        emptySubtitle: 'تواصل مع أي مزوّد من صفحته لبدء المحادثة.',
        browse: 'عرض المزوّدين',
        sentOn: 'تاريخ الإرسال',
        openVendor: 'فتح صفحة المزوّد',
        conversations: 'المحادثات',
        history: 'السجل',
        selectConversation: 'اختر محادثة لعرض السجل.',
      };
    }
    return {
      title: 'Messages',
      subtitle: 'Track your conversations with vendors.',
      loading: 'Loading messages...',
      emptyTitle: 'No messages yet',
      emptySubtitle: 'Contact a vendor from their page to start a conversation.',
      browse: 'Browse vendors',
      sentOn: 'Sent on',
      openVendor: 'Open vendor page',
      conversations: 'Conversations',
      history: 'History',
      selectConversation: 'Select a conversation to view message history.',
    };
  }, [locale]);

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/messages', { cache: 'no-store' });
        const json = (await response.json()) as {
          success?: boolean;
          message?: string;
          messages?: UserMessage[];
        };

        if (!response.ok || !json.success) {
          throw new Error(json.message || 'Failed to load messages');
        }

        if (!canceled) {
          setMessages(Array.isArray(json.messages) ? json.messages : []);
        }
      } catch (err) {
        if (!canceled) {
          setError(err instanceof Error ? err.message : 'Failed to load messages');
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, []);

  const threads = useMemo(() => buildThreads(messages), [messages]);

  useEffect(() => {
    if (threads.length === 0) {
      setSelectedThreadId(null);
      return;
    }

    if (!selectedThreadId || !threads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-4">
        <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.title}</h1>
        <p className="mt-2 text-lg text-[#4a5c74]">{copy.subtitle}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#d7deea] bg-white p-6 text-[#5f6f84]">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Loader2 className="h-4 w-4 animate-spin" />
            {copy.loading}
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-3xl border border-[#d7deea] bg-white p-8 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-[#8fa0b8]" />
          <h2 className="mt-3 text-xl font-bold text-[#11190C]">{copy.emptyTitle}</h2>
          <p className="mt-2 text-sm text-[#5f6f84]">{copy.emptySubtitle}</p>
          <Link
            href={`/${locale}/vendors`}
            className="mt-5 inline-flex rounded-full bg-[#11190C] px-5 py-2.5 text-sm font-bold text-[#D9FF0A]"
          >
            {copy.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border border-[#d7deea] bg-white p-3 shadow-sm">
            <div className="mb-2 px-2 py-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7d8ba0]">{copy.conversations}</p>
            </div>
            <div className="space-y-2">
              {threads.map((thread) => {
                const active = thread.id === selectedThreadId;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? 'border-[#d9ff0a] bg-[#f9ffe5]'
                        : 'border-[#e1e7f0] bg-[#fbfcfe] hover:border-[#d4dce8] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 gap-2.5">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#d6deea] bg-[#eff3f8]">
                          {thread.vendorLogoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thread.vendorLogoUrl}
                              alt={thread.vendorName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-xs font-bold text-[#4e607a]">
                              {vendorInitials(thread.vendorName)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                        <p className="truncate text-base font-bold text-[#11190C]">{thread.vendorName}</p>
                        <p className="mt-0.5 truncate text-xs text-[#6e7f97]">
                          {thread.vendorCategory || 'Vendor'}{thread.vendorCity ? ` · ${thread.vendorCity}` : ''}
                        </p>
                        </div>
                      </div>
                      {thread.unreadCount > 0 && (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#D9FF0A] px-1.5 py-0.5 text-[10px] font-bold text-[#11190C]">
                          {thread.unreadCount > 99 ? '99+' : thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-[#455974]">{thread.lastMessage}</p>
                    <p className="mt-2 text-[11px] font-semibold text-[#8393a8]">{formatRelative(thread.lastMessageAt, locale)}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="rounded-3xl border border-[#d7deea] bg-white shadow-sm">
            {selectedThread ? (
              <>
                <div className="border-b border-[#e6ebf3] px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#d6deea] bg-[#eff3f8]">
                        {selectedThread.vendorLogoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedThread.vendorLogoUrl}
                            alt={selectedThread.vendorName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-sm font-bold text-[#4e607a]">
                            {vendorInitials(selectedThread.vendorName)}
                          </div>
                        )}
                      </div>
                      <div>
                      <h3 className="text-2xl font-black text-[#11190C]">{selectedThread.vendorName}</h3>
                      <p className="text-sm text-[#5f6f84]">
                        {selectedThread.vendorCategory || 'Vendor'}{selectedThread.vendorCity ? ` · ${selectedThread.vendorCity}` : ''}
                      </p>
                      </div>
                    </div>
                    {selectedThread.vendorUrl && (
                      <a
                        href={selectedThread.vendorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2f5fff] hover:underline"
                      >
                        {copy.openVendor}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="max-h-[620px] space-y-3 overflow-y-auto px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7d8ba0]">{copy.history}</p>
                  {selectedThread.messages.map((message) => (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[84%] rounded-2xl bg-[#11190C] px-4 py-3 text-white shadow-sm">
                        <p className="whitespace-pre-wrap text-sm leading-6">{message.message}</p>
                        <p className="mt-2 text-[11px] font-medium text-white/70">
                          {copy.sentOn}: {formatDate(message.createdAt, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center px-6 py-8 text-center">
                <div>
                  <MessageSquare className="mx-auto h-11 w-11 text-[#94a3b8]" />
                  <p className="mt-3 text-sm font-semibold text-[#5f6f84]">{copy.selectConversation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
