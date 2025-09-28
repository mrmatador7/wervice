'use client';

export default function ClientHtml({
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // Always suppress hydration warnings for the html element
  // This is safe because hydration mismatches here are typically caused by
  // browser extensions (like Google Tag Assistant) modifying the DOM
  return (
    <html {...props} suppressHydrationWarning>
      {children}
    </html>
  );
}
