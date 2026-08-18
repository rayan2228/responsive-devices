/**
 * Sites known to refuse embedding.
 *
 * Embed-blocking cannot be detected reliably from the client: a site sending
 * `X-Frame-Options: DENY` or a `frame-ancestors` CSP either fires no event at
 * all, or — as Chrome does — fires `load` against an error document, which is
 * indistinguishable from success because reading into a cross-origin frame
 * throws by design.
 *
 * So detection is layered:
 *   1. this list  — instant and accurate for the sites people actually try
 *   2. a timeout  — catches sites that block silently
 *   3. an always-present "open in new tab" control on every pane
 *
 * This list is a convenience, not a source of truth. It will go stale as sites
 * change their headers, which is why it only ever *adds* an early, correct
 * answer and never suppresses a preview that might have worked.
 */
const KNOWN_BLOCKERS: readonly string[] = [
  "google.com",
  "gmail.com",
  "youtube.com",
  "facebook.com",
  "instagram.com",
  "threads.net",
  "x.com",
  "twitter.com",
  "linkedin.com",
  "reddit.com",
  "pinterest.com",
  "tiktok.com",
  "github.com",
  "gitlab.com",
  "stackoverflow.com",
  "developer.mozilla.org",
  "amazon.com",
  "netflix.com",
  "twitch.tv",
  "spotify.com",
  "discord.com",
  "slack.com",
  "notion.so",
  "figma.com",
  "chatgpt.com",
  "openai.com",
  "claude.ai",
  "paypal.com",
  "stripe.com",
  "apple.com",
  "microsoft.com",
  "live.com",
  "office.com",
];

/**
 * True when the host is a known blocker, matching the registrable domain so
 * subdomains are covered (mail.google.com, www.amazon.com) without a bare
 * `includes` matching something like "notgoogle.com.example.org".
 */
export function isKnownBlocker(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }

  return KNOWN_BLOCKERS.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
}
