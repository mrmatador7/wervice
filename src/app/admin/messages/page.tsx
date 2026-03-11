'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { MessageSquare, Send, Flag, Archive, Loader2, Phone, Link as LinkIcon } from 'lucide-react';

type Message = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isFlagged: boolean;
  vendorName: string;
  vendorCategory: string | null;
  vendorCity: string | null;
  vendorUrl: string | null;
  vendorLogoUrl: string | null;
  locale: string;
  senderName: string;
  senderPhone: string;
  senderAccountEmail: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatRelativeTime(timestampIso: string): string {
  const date = new Date(timestampIso);
  if (Number.isNaN(date.getTime())) return 'just now';

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const absMs = Math.abs(diffMs);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (absMs < hour) {
    const value = Math.round(diffMs / minute);
    return rtf.format(value, 'minute');
  }

  if (absMs < day) {
    const value = Math.round(diffMs / hour);
    return rtf.format(value, 'hour');
  }

  const value = Math.round(diffMs / day);
  return rtf.format(value, 'day');
}

function formatAbsoluteTime(timestampIso: string): string {
  const date = new Date(timestampIso);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getInitials(name: string): string {
  const cleaned = (name || '').trim();
  if (!cleaned) return '?';

  const parts = cleaned.split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'flagged'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedId) || null,
    [messages, selectedId]
  );

  const filteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        if (filter === 'unread') return !message.isRead;
        if (filter === 'flagged') return message.isFlagged;
        return true;
      }),
    [messages, filter]
  );

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/messages', { cache: 'no-store' });
      const json = (await response.json()) as {
        success?: boolean;
        message?: string;
        messages?: Message[];
      };

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to load messages');
      }

      const nextMessages = Array.isArray(json.messages) ? json.messages : [];
      setMessages(nextMessages);

      if (selectedId) {
        const exists = nextMessages.some((message) => message.id === selectedId);
        if (!exists) setSelectedId(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const patchMessage = async (
    messageId: string,
    payload: Partial<Pick<Message, 'isRead' | 'isFlagged'>> & { isArchived?: boolean }
  ) => {
    const optimisticMessages = messages;

    setMessages((prev) =>
      prev
        .map((msg) => {
          if (msg.id !== messageId) return msg;
          const next = { ...msg };
          if (typeof payload.isRead === 'boolean') next.isRead = payload.isRead;
          if (typeof payload.isFlagged === 'boolean') next.isFlagged = payload.isFlagged;
          return next;
        })
        .filter((msg) => (payload.isArchived && msg.id === messageId ? false : true))
    );

    setUpdatingId(messageId);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to update message');
      }

      if (payload.isArchived && selectedId === messageId) {
        setSelectedId(null);
      }
    } catch (err) {
      setMessages(optimisticMessages);
      const message = err instanceof Error ? err.message : 'Failed to update message';
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedId(message.id);
    if (!message.isRead) {
      await patchMessage(message.id, { isRead: true });
    }
  };

  const toggleFlag = async (message: Message) => {
    await patchMessage(message.id, { isFlagged: !message.isFlagged });
  };

  const archiveSelected = async () => {
    if (!selectedMessage) return;
    await patchMessage(selectedMessage.id, { isArchived: true });
  };

  const unreadCount = messages.filter((message) => !message.isRead).length;
  const flaggedCount = messages.filter((message) => message.isFlagged).length;
  const selectedIsUpdating = Boolean(selectedMessage && updatingId === selectedMessage.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" subtitle="Customer inquiries and support conversations" />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Total</p>
          <p className="mt-2 text-3xl font-bold text-[#11190C]">{messages.length}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Unread</p>
          <p className="mt-2 text-3xl font-bold text-[#11190C]">{unreadCount}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Flagged</p>
          <p className="mt-2 text-3xl font-bold text-[#11190C]">{flaggedCount}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <section className="space-y-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: `All (${messages.length})` },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'flagged', label: `Flagged (${flaggedCount})` },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as 'all' | 'unread' | 'flagged')}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  filter === item.key
                    ? 'border-[#D9FF0A] bg-[#D9FF0A] text-[#11190C]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#11190C]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-[#F7F8FA] p-12 text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading messages...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F7F8FA] p-12 text-center text-gray-500">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((message) => {
                const selected = selectedMessage?.id === message.id;
                return (
                  <article
                    key={message.id}
                    onClick={() => void handleSelectMessage(message)}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      selected
                        ? 'border-[#D9FF0A] bg-[#FAFFE7] shadow-sm'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-[#F9FAFC]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#d6deea] bg-[#EFF2F6]">
                        {message.vendorLogoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={message.vendorLogoUrl} alt={message.vendorName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs font-bold text-[#11190C]">
                            {getInitials(message.vendorName || message.from)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`truncate text-sm ${message.isRead ? 'font-medium text-gray-500' : 'font-semibold text-[#11190C]'}`}>
                              {message.from}
                            </p>
                            <h3 className="mt-0.5 truncate text-base font-semibold text-[#11190C]">{message.subject}</h3>
                          </div>

                          <div className="flex items-center gap-2">
                            {!message.isRead && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                                New
                              </span>
                            )}
                            {message.isFlagged && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                Flagged
                              </span>
                            )}
                            <span className="whitespace-nowrap text-xs text-wv.sub">
                              {formatRelativeTime(message.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{message.preview}</p>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="truncate text-xs text-gray-500">
                            {message.vendorName}
                            {message.vendorCity ? ` · ${message.vendorCity}` : ''}
                          </p>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void toggleFlag(message);
                            }}
                            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-[#F2F4F7] hover:text-[#11190C]"
                            aria-label="Flag message"
                          >
                            <Flag className={`h-4 w-4 ${message.isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="xl:sticky xl:top-6 xl:h-fit">
          {selectedMessage ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#d6deea] bg-[#EFF2F6]">
                    {selectedMessage.vendorLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedMessage.vendorLogoUrl} alt={selectedMessage.vendorName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-sm font-bold text-[#11190C]">
                        {getInitials(selectedMessage.vendorName || selectedMessage.from)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-bold text-[#11190C]">{selectedMessage.from}</h3>
                    <p className="mt-1 text-sm text-gray-500">{formatAbsoluteTime(selectedMessage.timestamp)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void archiveSelected()}
                    disabled={selectedIsUpdating}
                    className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-[#F4F6F8] disabled:cursor-not-allowed disabled:opacity-50"
                    title="Archive"
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleFlag(selectedMessage)}
                    disabled={selectedIsUpdating}
                    className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-[#F4F6F8] disabled:cursor-not-allowed disabled:opacity-50"
                    title="Flag"
                  >
                    <Flag size={16} className={selectedMessage.isFlagged ? 'fill-amber-500 text-amber-500' : ''} />
                  </button>
                </div>
              </div>

              <div className="mb-5 rounded-2xl border border-gray-100 bg-[#F7F8FA] p-4">
                <h4 className="text-base font-semibold text-[#11190C]">{selectedMessage.subject}</h4>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{selectedMessage.message}</p>
              </div>

              <div className="mb-5 space-y-2 rounded-2xl border border-gray-100 bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Contact details</p>
                <p className="inline-flex items-center gap-2 text-sm text-[#11190C]">
                  <Phone className="h-3.5 w-3.5 text-gray-500" />
                  {selectedMessage.senderPhone}
                </p>
                {selectedMessage.senderAccountEmail && (
                  <p className="text-sm text-gray-600">{selectedMessage.senderAccountEmail}</p>
                )}
                {selectedMessage.vendorUrl && (
                  <a
                    href={selectedMessage.vendorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    Open vendor page
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <textarea
                  placeholder="Reply flow can be connected to email/WhatsApp next"
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-[#F7F8FA] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9FF0A]"
                  rows={4}
                  disabled
                />
                <button
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#11190C] px-4 py-2.5 text-sm font-semibold text-white opacity-45"
                >
                  <Send size={16} />
                  Reply coming soon
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[480px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">Select a message to view</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
