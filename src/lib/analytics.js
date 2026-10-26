import { DEVELOPER_SLUG } from "@/config";
import { insertPageView } from "@/lib/supabase";

// Records one page view per page load, after the page has rendered.
//
// Nothing personal is sent and nothing is stored in the browser: only this
// site's host name, the path (no query string or hash), this portfolio's
// slug and the referring site's host name. No cookies, IDs or IP addresses
// (the database doesn't store them).
//
// Skipped for: development builds, bots and automated browsers, and visitors
// with Do Not Track or Global Privacy Control switched on.

const BOT_PATTERN =
  /bot|crawl|spider|slurp|archiver|facebookexternalhit|embedly|preview|whatsapp|headless|lighthouse|pagespeed|prerender|phantom|python|curl|wget/i;

const shouldTrack = () => {
  if (import.meta.env.DEV) return false;
  if (navigator.webdriver) return false;
  if (BOT_PATTERN.test(navigator.userAgent)) return false;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return false;
  if (navigator.globalPrivacyControl === true) return false;
  return true;
};

// The referring site's host name, or null for direct visits and links from
// this same site.
const referrerHost = () => {
  try {
    const host = new URL(document.referrer).hostname.toLowerCase();
    return host && host !== location.hostname.toLowerCase() ? host.slice(0, 253) : null;
  } catch {
    return null;
  }
};

const send = () =>
  insertPageView({
    site: location.hostname.toLowerCase(),
    path: location.pathname.slice(0, 500) || "/",
    developer_slug: DEVELOPER_SLUG,
    referrer: referrerHost(),
  }).catch(() => {
    // Best effort: a failed or rejected view is simply not counted.
  });

export const trackPageView = () => {
  if (!shouldTrack()) return;
  const whenIdle = () =>
    "requestIdleCallback" in window
      ? requestIdleCallback(send, { timeout: 5000 })
      : setTimeout(send, 1000);
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
};
