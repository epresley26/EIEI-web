export const firebaseConfig = {
  apiKey: "AIzaSyCZNErpIXNGplWVDozEM99eYHjX_gr57vE",
  authDomain: "eiei-e1a76.firebaseapp.com",
  projectId: "eiei-e1a76",
  storageBucket: "eiei-e1a76.appspot.com",
  messagingSenderId: "381572080594",
  appId: "1:381572080594:web:1a98854dc676648d5e5e0b",
  measurementId: "G-28SHEQRWLY"
};

export function generateSlug(title: string) {
  return (title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function badgeClass(type: string) {
  return type === 'News' ? 'badge-news' : type === 'Event' ? 'badge-event' : 'badge-blog';
}

export function getDateMillis(post: any) {
  const val = post.publishDate || post.createdAt || null;
  if (!val) return 0;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.toDate === 'function') return val.toDate().getTime();
  return new Date(val).getTime() || 0;
}

export function formatDate(millis: number) {
  if (!millis) return '';
  return new Date(millis).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function plainExcerpt(post: any) {
  const source = post.excerpt || post.content || '';
  const text = source.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.slice(0, 160);
}
