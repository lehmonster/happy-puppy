# Cover URLs for DEFAULT_RECENT

Scraped verbatim from each live Goodreads page's `og:image` tag. Nothing constructed.

## The one that mattered

`The Villa` was pulling **Nora Roberts'** 2001 novel, because `BookCover` falls back to
`covers.openlibrary.org/b/title/The%20Villa` — a title-only match. Goodreads record
`60784641` is confirmed Rachel Hawkins (St. Martin's, Jan 3 2023, Fleetwood-Mac-inspired
thriller; Nora Roberts appears nowhere on the page).

## Patch: add `coverUrl` + `isbn` to these 10 entries in DEFAULT_RECENT

| id | Title | coverUrl | isbn |
|----|-------|----------|------|
| n7 | The Villa | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1651426717i/60784641.jpg` | 9781250280015 |
| n6 | Exit Lane | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1742733957i/228062219.jpg` | 9798893310610 |
| n5 | Hardly Strangers | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1719009370i/213458857.jpg` | 9798893310207 |
| n4 | The Hill | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1763281570i/231126807.jpg` | 9780374614546 |
| n3 | Comedic Timing | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1730128903i/217951320.jpg` | 9798893310276 |
| n2 | Found Time | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1762811487i/235992993.jpg` | 9798893311297 |
| n1 | The Vacationers | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1386629708i/18641982.jpg` | 9781594631573 |
| r1 | Grape Juice | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1742734016i/228062212.jpg` | 9798893310566 |
| d0b | It's a Love Story | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1728397501i/218153839.jpg` | 9780593714102 |
| d0a | Scythe & Sparrow | `https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1714505398i/127616032.jpg` | 9781638931812 |

`d0b` and `d0a` already had these exact URLs — they're listed so the ISBNs can be added
as a fallback. The other eight are new.

## Copy-paste form

Add `coverUrl` and `isbn` to each entry. Example for the first one:

```js
{ id: "n7", title: "The Villa", author: "Rachel Hawkins", dateFinished: "2026-08-18",
  rating: 0, review: "", wine: "Provence Rosé",
  coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1651426717i/60784641.jpg",
  isbn: "9781250280015",
  song: { title: "Silver Springs", artist: "Fleetwood Mac", basis: "title" } },
```

## Also worth fixing in `BookCover`

The title-only Open Library fallback is what caused the wrong-cover bug in the first
place. Prefer ISBN, and only fall back to title as a last resort:

```js
function BookCover({ title, author, coverUrl, isbn }) {
  const clean = isbn ? isbn.replace(/-/g, "") : null;
  const srcs = [
    coverUrl,
    clean && `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg?default=false`,
    // title match is a coin flip for common titles — last resort only
    `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-M.jpg?default=false`,
  ].filter(Boolean);
  // ...rest unchanged
}
```

Then pass it through: `<BookCover ... isbn={book.isbn} />`

## Caveats

- These URLs could not be HTTP-status-checked from here (the sandbox proxy blocks it and
  web_fetch returns empty for images). Confidence rests on provenance: they are what
  Goodreads serves right now, on a CDN built for hotlinking.
- Two 831 Stories titles have duplicate Goodreads records with *different* art. The
  canonical paperback record was used. If Exit Lane or Grape Juice looks wrong, the
  Kindle-record alternates are `.../1739446335i/227858430.jpg` and
  `.../1739470730i/227858416.jpg`.
- Don't rely on Open Library for the five 831 Stories novellas — unconfirmed whether
  they're in that catalog at all.
