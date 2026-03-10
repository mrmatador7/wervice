'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from '@/lib/firebase-client';

export default function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string>('');
  const sentDebugPingRef = useRef(false);
  const debug = process.env.NEXT_PUBLIC_FIREBASE_DEBUG === 'true';

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (!pagePath || lastTrackedPathRef.current === pagePath) return;
    lastTrackedPathRef.current = pagePath;

    getFirebaseAnalytics()
      .then((analytics) => {
        if (!analytics) {
          if (debug) {
            console.info('[FirebaseAnalytics] analytics not initialized (unsupported browser or missing config)');
          }
          return;
        }
        logEvent(analytics, 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: pagePath,
          ...(debug ? { debug_mode: true } : {}),
        });
        if (debug) {
          console.info('[FirebaseAnalytics] page_view', pagePath);
        }

        // Ensure this browser is visible in GA4 DebugView.
        if (debug && !sentDebugPingRef.current) {
          sentDebugPingRef.current = true;
          logEvent(analytics, 'debug_ping', {
            page_path: pagePath,
            debug_mode: true,
          });
          console.info('[FirebaseAnalytics] debug_ping');
        }
      })
      .catch((error) => {
        if (debug) {
          console.error('[FirebaseAnalytics] failed to log page_view', error);
        }
      });
  }, [pathname, searchParams, debug]);

  return null;
}
