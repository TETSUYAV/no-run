import Script from 'next/script';

export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const cfBeacon = process.env.NEXT_PUBLIC_CF_BEACON;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {/* Plausible Analytics (Privacy-friendly, GDPR compliant, no cookie) */}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="lazyOnload"
        />
      )}

      {/* Cloudflare Web Analytics (Privacy-friendly, no cookies) */}
      {cfBeacon && (
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${cfBeacon}"}`}
          strategy="lazyOnload"
        />
      )}

      {/* Google Analytics 4 (Optional) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
