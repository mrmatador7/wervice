'use client';

import Script from 'next/script';

const DEFAULT_CLARITY_PROJECT_ID = 'vub1cmbwg9';

export default function MicrosoftClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || DEFAULT_CLARITY_PROJECT_ID;
  if (!projectId) return null;

  const script = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId}");
  `;

  return <Script id="microsoft-clarity" strategy="afterInteractive">{script}</Script>;
}

