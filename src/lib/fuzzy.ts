/**
 * Subsequence matcher with prefix and word-boundary weighting.
 *
 * Returns null when the query isn't a subsequence of the target, otherwise a
 * score where higher is better. Deliberately small — the command set is a few
 * dozen static entries, so there is no need for a full fuzzy library.
 */
export function score(query: string, target: string): number | null {
  if (!query) return 0;

  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (t === q) return 1000;
  if (t.startsWith(q)) return 900 - t.length;

  const wordStart = t.split(/[\s\-_/]+/).some((word) => word.startsWith(q));
  if (t.includes(q)) return (wordStart ? 700 : 500) - t.length;

  // Subsequence pass — every query char must appear in order.
  let ti = 0;
  let points = 0;
  let streak = 0;

  for (const char of q) {
    const found = t.indexOf(char, ti);
    if (found === -1) return null;

    const boundary = found === 0 || /[\s\-_/]/.test(t[found - 1]);
    streak = found === ti ? streak + 1 : 0;
    points += 10 + streak * 5 + (boundary ? 15 : 0);
    ti = found + 1;
  }

  return points - t.length;
}

export function rank<T>(
  query: string,
  items: readonly T[],
  toText: (item: T) => string,
): T[] {
  if (!query.trim()) return [...items];

  return items
    .map((item) => ({ item, s: score(query.trim(), toText(item)) }))
    .filter((entry): entry is { item: T; s: number } => entry.s !== null)
    .sort((a, b) => b.s - a.s)
    .map((entry) => entry.item);
}
