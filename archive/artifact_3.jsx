import { useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from "recharts";

// ─── DATA ───────────────────────────────────────────────────────────────────

const YEAR_DATA = [
  { year: "Earlier", count: 70, color: "#c9854e" },
  { year: "'22", count: 67, color: "#2d8a5f" },
  { year: "'23", count: 70, color: "#1a7a8a" },
  { year: "'24", count: 100, color: "#7a3baf" },
  { year: "'25", count: 83, color: "#c0395a" },
  { year: "'26", count: 19, color: "#c0392b" },
];

const GENRE_DATA = [
  { name: "Romance & RomCom", value: 155, color: "#d4617a" },
  { name: "Thriller & Suspense", value: 85, color: "#7a3baf" },
  { name: "Women's Fiction", value: 75, color: "#2d8a5f" },
  { name: "Literary Fiction", value: 30, color: "#c05030" },
  { name: "Crime & Mystery", value: 25, color: "#1a7a8a" },
  { name: "Nonfiction", value: 22, color: "#8B6E3C" },
  { name: "Seasonal", value: 20, color: "#c9a020" },
];

const AUTHORS = [
  { name: "Victor Methos", count: 28, color: "#7a3baf" },
  { name: "Colleen Hoover", count: 17, color: "#d4617a" },
  { name: "Elin Hilderbrand", count: 16, color: "#2d8a5f" },
  { name: "Jaine Diamond", count: 10, color: "#c0395a" },
  { name: "Ali Hazelwood", count: 9, color: "#c05030" },
  { name: "KA Tucker", count: 9, color: "#1a7a8a" },
  { name: "Christina Lauren", count: 7, color: "#c9a020" },
  { name: "Emily Henry", count: 7, color: "#c9854e" },
];

const INSIGHTS = [
  { emoji: "📈", label: "Peak Reading Year", value: "2024", sub: "100 books in one year" },
  { emoji: "⭐", label: "Only 5-Star of 2025", value: "Love of My Afterlife", sub: "Kristy Greenwood" },
  { emoji: "🔥", label: "Series Obsession", value: "Victor Methos", sub: "28 books devoured" },
  { emoji: "📚", label: "Dominant Genre", value: "Romance", sub: "155 books & counting" },
  { emoji: "✨", label: "2026 Discovery", value: "Gabrielle Zevin", sub: "3 books this year" },
  { emoji: "📖", label: "Avg Books / Month", value: "~6.9", sub: "across all of 2025" },
];

const THEMES = [
  {
    id: "thriller",
    name: "Psychological Thriller & Domestic Suspense",
    emoji: "🔪",
    color: "#7a3baf",
    light: "#c4a8e8",
    bg: "linear-gradient(135deg, #120820, #1a0f2e)",
    count: 85,
    vibe: "Twisty plots, unreliable narrators, marriages with dark secrets, and the kind of ending that makes you gasp audibly.",
    keyAuthors: ["Victor Methos", "Harlan Coben", "Peter Swanson", "Riley Sagar", "Greer Hendricks", "BA Paris", "David Ellis"],
    standouts: ["Verity", "I Am Pilgrim", "A Killer's Wife", "The Kind Worth Killing", "The Wife Between Us", "First Lie Wins", "Listen for the Lie", "Greenwich Park", "Pretty Little Wife", "End of Story"],
    note: "Victor Methos alone accounts for 28 of these. You basically read his entire catalog.",
  },
  {
    id: "romance",
    name: "Romance & RomCom",
    emoji: "💕",
    color: "#c0395a",
    light: "#f4a0b8",
    bg: "linear-gradient(135deg, #1a0810, #280d18)",
    count: 155,
    vibe: "Your dominant genre by a wide margin. Enemies to lovers, workplace tension, small-town charm, STEM romance — you've read every subgenre going.",
    keyAuthors: ["Emily Henry", "Abby Jimenez", "Tessa Bailey", "Ali Hazelwood", "Lucy Score", "KA Tucker", "Jaine Diamond", "Christina Lauren", "Colleen Hoover"],
    standouts: ["Happy Place", "Beach Read", "Book Lovers", "The Love Hypothesis", "Things We Never Got Over", "It Happened One Summer", "Bride", "Not in Love", "Deep End", "November 9"],
    note: "Colleen Hoover has 17 entries. Emily Henry has 7. Ali Hazelwood has 9. You are well-covered.",
  },
  {
    id: "womens",
    name: "Women's Fiction & Beach Reads",
    emoji: "🌊",
    color: "#1e8a6a",
    light: "#90d4be",
    bg: "linear-gradient(135deg, #08160f, #0e201a)",
    count: 75,
    vibe: "Nantucket summers, found families, complicated friendships, and women navigating life's messy turns with grace (eventually).",
    keyAuthors: ["Elin Hilderbrand", "Liane Moriarty", "Taylor Jenkins Reid", "Rebecca Serle", "Laura Dave", "Carly Fortune", "Kate Clayborn", "Sally Hepworth"],
    standouts: ["Malibu Rising", "Hotel Nantucket", "The Last Thing He Told Me", "Here One Moment", "Every Summer After", "Five Star Weekend", "Swan Song", "After I Do", "One Italian Summer"],
    note: "Hilderbrand has 16 books on your list. You've read nearly her entire Nantucket catalog.",
  },
  {
    id: "literary",
    name: "Literary Fiction & Prestige Reads",
    emoji: "📖",
    color: "#b84020",
    light: "#e8a888",
    bg: "linear-gradient(135deg, #160808, #220d08)",
    count: 30,
    vibe: "The books that surprised you by how much you thought about them afterward. Your 2026 reads skew heavily here — a new era is emerging.",
    keyAuthors: ["Matt Haig", "Gabrielle Zevin", "Bonnie Garmus", "Ann Patchett", "Miranda July", "Margaret Atwood", "Markus Zusak", "VE Schwab"],
    standouts: ["Tomorrow & Tomorrow & Tomorrow", "Lessons in Chemistry", "The Midnight Library", "Tom Lake", "The Testaments", "The Book Thief", "All Fours", "The Storied Life of AJ Fikry", "Elsewhere", "Beautyland"],
    note: "Your 2026 Gabrielle Zevin arc (3 books this year) signals a genuine literary gear-shift happening.",
  },
  {
    id: "crime",
    name: "Crime Fiction & Detective Mysteries",
    emoji: "🔍",
    color: "#1a6a8a",
    light: "#88c8e0",
    bg: "linear-gradient(135deg, #080f16, #0e1820)",
    count: 25,
    vibe: "Procedurals with atmosphere, small-town secrets, and detectives you'd follow anywhere. You're early in this genre — and it has a lot to offer.",
    keyAuthors: ["Jane Harper", "Richard Osman", "Jo Nesbø", "Dervla McTiernan", "Robert Crais", "Karin Slaughter", "Benjamin Stevenson"],
    standouts: ["The Dry", "The Thursday Murder Club", "We Solve Murders", "What Happened to Nina", "The Good Daughter", "The Monkey's Raincoat", "Everyone in My Family Has Killed Someone", "The Most Wonderful Crime of the Year"],
    note: "This is your most underdeveloped genre. Tana French, Holly Jackson, and Dervla McTiernan's full catalog are all waiting.",
  },
  {
    id: "nonfiction",
    name: "Nonfiction, Memoir & Self-Help",
    emoji: "💡",
    color: "#8B6020",
    light: "#d4a868",
    bg: "linear-gradient(135deg, #120e06, #1c1408)",
    count: 22,
    vibe: "The books you actually apply to your life. Wellness, leadership, celebrity confessionals, parenting wisdom — all present and accounted for.",
    keyAuthors: ["Gabby Bernstein", "Mel Robbins", "Dan Harris", "Paul Kalanithi", "Dolly Alderton", "Tinx", "Sahil Bloom"],
    standouts: ["Let Them", "10% Happier", "When Breath Becomes Air", "Good Material", "The Shift", "Co-Intelligence", "Careless People", "The Five Types of Wealth", "The Psilocybin Handbook for Women"],
    note: "2026 is leaning into this genre hard. The Whole-Brain Child + Co-Intelligence in the same year is a very Chelsea thing.",
  },
  {
    id: "seasonal",
    name: "Seasonal & Holiday Reads",
    emoji: "❄️",
    color: "#4a80c0",
    light: "#a0c8f0",
    bg: "linear-gradient(135deg, #080c18, #0e1422)",
    count: 20,
    vibe: "Christmas romances, winter cottages, and books that feel like a mug of something warm. More of these than you may realize.",
    keyAuthors: ["Elin Hilderbrand", "Sarah Morgenthaler", "Sierra Simone", "Lyssa Kay Adams", "Beth O'Leary", "Josie Silver"],
    standouts: ["Winter Street", "Winter Stroll", "Winter Storms", "Winter Solstice", "A Winter in New York", "The Christmas You Found Me", "Snow Place Like LA", "A Jingle Bell Mingle", "A Holly Jolly Ever After"],
    note: "Hilderbrand's entire Winter series made the list. The Christmas read is clearly a tradition.",
  },
];

// ─── BOOK COVERS (TBR) ──────────────────────────────────────────────────────

const CoverNightingale = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(170deg, #0a1530 0%, #152258 50%, #0e1a40 100%)", position: "relative", overflow: "hidden" }}>
    {[...Array(7)].map((_, i) => (<div key={i} style={{ position: "absolute", top: 0, left: "50%", width: "1px", height: "55%", background: `rgba(180,200,255,${0.03 + i * 0.01})`, transformOrigin: "bottom center", transform: `rotate(${(i - 3) * 14}deg)` }} />))}
    <svg viewBox="0 0 140 100" style={{ position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)", width: 120 }}>
      <path d="M70,80 Q42,55 12,62 Q32,48 52,56 Q58,28 70,18 Q82,28 88,56 Q108,48 128,62 Q98,55 70,80Z" fill="rgba(255,255,255,0.92)" />
      <ellipse cx="58" cy="58" rx="4" ry="6" fill="rgba(255,255,255,0.5)" transform="rotate(-20,58,58)" />
      <ellipse cx="82" cy="58" rx="4" ry="6" fill="rgba(255,255,255,0.5)" transform="rotate(20,82,58)" />
    </svg>
    <div style={{ position: "absolute", bottom: 56, left: 12, right: 12, height: 1, background: "linear-gradient(90deg, transparent, rgba(200,170,100,0.7), transparent)" }} />
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "#d4c090", lineHeight: 1.25, marginBottom: 4 }}>The<br />Nightingale</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#6a80c0", textTransform: "uppercase" }}>Kristin Hannah</div>
    </div>
    <div style={{ position: "absolute", top: 14, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 7, letterSpacing: 3, color: "rgba(160,180,220,0.6)", textTransform: "uppercase" }}>#1 Gap</div>
    </div>
  </div>
);

const CoverFamilyUpstairs = () => (
  <div style={{ width: "100%", height: "100%", background: "#2a0608", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #5a1010, #2a0608 60%)" }} />
    {[...Array(7)].map((_, i) => (<div key={i} style={{ position: "absolute", left: `${10 + i * 18}px`, right: `${10 + i * 18}px`, top: `${50 - i * 30}px`, bottom: `${160 - i * 15}px`, border: "1px solid rgba(255,100,100,0.2)", borderBottom: "none" }} />))}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(0deg, #1a0404, transparent)" }} />
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#f5e0e0", lineHeight: 1.2, marginBottom: 4 }}>The Family<br />Upstairs</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#a06060", textTransform: "uppercase" }}>Lisa Jewell</div>
    </div>
    <div style={{ position: "absolute", top: 14, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 7, letterSpacing: 2, color: "rgba(200,120,120,0.7)", textTransform: "uppercase" }}>Psychological</div>
    </div>
  </div>
);

const CoverGoodGirl = () => (
  <div style={{ width: "100%", height: "100%", background: "#f5f0e4", position: "relative", overflow: "hidden" }}>
    {[...Array(18)].map((_, i) => (<div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${i * 15}px`, height: "1px", background: "rgba(180,160,120,0.25)" }} />))}
    <div style={{ position: "absolute", top: 20, left: 14, right: 14 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#1a1010", lineHeight: 1.3 }}>A Good Girl's<br />Guide to Murder</div>
    </div>
    <svg viewBox="0 0 120 120" style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", width: 110 }}>
      <circle cx="60" cy="60" r="4" fill="#c0392b" /><circle cx="30" cy="35" r="3" fill="#c0392b" /><circle cx="95" cy="45" r="3" fill="#c0392b" /><circle cx="25" cy="90" r="3" fill="#c0392b" /><circle cx="90" cy="85" r="3" fill="#c0392b" /><circle cx="55" cy="20" r="3" fill="#c0392b" />
      <line x1="60" y1="60" x2="30" y2="35" stroke="rgba(192,57,43,0.6)" strokeWidth="1" /><line x1="60" y1="60" x2="95" y2="45" stroke="rgba(192,57,43,0.6)" strokeWidth="1" /><line x1="60" y1="60" x2="25" y2="90" stroke="rgba(192,57,43,0.6)" strokeWidth="1" /><line x1="60" y1="60" x2="90" y2="85" stroke="rgba(192,57,43,0.6)" strokeWidth="1" /><line x1="60" y1="60" x2="55" y2="20" stroke="rgba(192,57,43,0.6)" strokeWidth="1" />
    </svg>
    <div style={{ position: "absolute", bottom: 14, left: 10, right: 10 }}>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#8a6050", textTransform: "uppercase", textAlign: "center" }}>Holly Jackson</div>
    </div>
  </div>
);

const CoverBigLittleLies = () => (
  <div style={{ width: "100%", height: "100%", background: "#080808", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 8px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: "#ffffff", lineHeight: 0.9, textAlign: "center" }}>BIG</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: "#ffffff", lineHeight: 0.9, textAlign: "center" }}>LITTLE</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: "#d4b020", lineHeight: 0.9, textAlign: "center" }}>LIES</div>
    </div>
    <div style={{ position: "absolute", top: "38%", left: 10, right: 10, height: 2, background: "#d4b020" }} />
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 3, color: "#666", textTransform: "uppercase" }}>Liane Moriarty</div>
    </div>
  </div>
);

const CoverMeBeforeYou = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #f0e8dc 0%, #e8c8b0 40%, #c05030 100%)", position: "relative", overflow: "hidden" }}>
    <svg viewBox="0 0 120 100" style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: 110 }}>
      <circle cx="42" cy="35" r="16" fill="rgba(192,80,48,0.25)" /><circle cx="78" cy="35" r="16" fill="rgba(192,80,48,0.15)" />
      <rect x="30" y="48" width="24" height="40" rx="12" fill="rgba(192,80,48,0.35)" /><rect x="66" y="48" width="24" height="40" rx="12" fill="rgba(192,80,48,0.2)" />
      <path d="M54,68 Q60,62 66,68" stroke="rgba(192,80,48,0.5)" strokeWidth="1.5" fill="none" />
    </svg>
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 17, color: "#2a0808", lineHeight: 1.2, marginBottom: 3 }}>Me Before<br />You</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#7a3020", textTransform: "uppercase" }}>Jojo Moyes</div>
    </div>
  </div>
);

const CoverInTheWoods = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #060f08 0%, #0e2014 60%, #162818 100%)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle, #e8c060 0%, #c09020 40%, transparent 70%)" }} />
    <svg viewBox="0 0 140 120" style={{ position: "absolute", bottom: 60, left: 0, width: "100%" }}>
      {[10, 30, 50, 70, 90, 110, 130].map((x, i) => (<polygon key={i} points={`${x},120 ${x - 12 - i % 3 * 4},${60 - i % 4 * 8} ${x + 12 + i % 3 * 4},${60 - i % 4 * 8}`} fill={`rgba(10,30,12,${0.8 + i * 0.03})`} />))}
    </svg>
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#c0d890", lineHeight: 1.2, marginBottom: 4 }}>In the<br />Woods</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#4a7040", textTransform: "uppercase" }}>Tana French</div>
    </div>
  </div>
);

const CoverGentleman = () => (
  <div style={{ width: "100%", height: "100%", background: "#220808", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 6, border: "1px solid rgba(200,160,60,0.4)", borderRadius: 2 }} />
    <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(200,160,60,0.2)", borderRadius: 2 }} />
    <svg viewBox="0 0 110 80" style={{ position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)", width: 100 }}>
      <rect x="38" y="10" width="34" height="55" rx="2" fill="none" stroke="rgba(200,160,60,0.5)" strokeWidth="1" />
      <rect x="42" y="14" width="26" height="8" rx="1" fill="rgba(200,160,60,0.2)" />
      <line x1="55" y1="35" x2="55" y2="55" stroke="rgba(200,160,60,0.4)" strokeWidth="1" />
      <circle cx="55" cy="35" r="3" fill="rgba(200,160,60,0.5)" />
      <path d="M20,65 Q35,50 55,65 Q75,50 90,65" stroke="rgba(200,160,60,0.35)" strokeWidth="1" fill="none" />
    </svg>
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "#c9a040", lineHeight: 1.3, marginBottom: 4 }}>The Gentleman<br />of Moscow</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#7a5020", textTransform: "uppercase" }}>Amor Towles</div>
    </div>
  </div>
);

const CoverCaraval = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(170deg, #04040e 0%, #0a0618 60%, #060410 100%)", position: "relative", overflow: "hidden" }}>
    {[...Array(20)].map((_, i) => { const x = (i * 37 + 10) % 140; const y = (i * 53 + 15) % 220; const s = 1 + (i % 3); return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: i % 4 === 0 ? "#d4c060" : "rgba(200,180,255,0.6)" }} />; })}
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, color: "#d460a0", lineHeight: 1.2, marginBottom: 4, textShadow: "0 0 12px rgba(212,96,160,0.5)" }}>Caraval</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#6a3060", textTransform: "uppercase" }}>Stephanie Garber</div>
    </div>
  </div>
);

const CoverCoupleNextDoor = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #081818 0%, #0e2828 100%)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)", width: 80, height: 60, border: "3px solid rgba(220,200,20,0.7)", borderRadius: 3 }}>
      <div style={{ position: "absolute", top: 8, left: 8, right: 8, bottom: 8, background: "rgba(220,200,20,0.15)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 20, height: 24, background: "rgba(220,200,20,0.3)", borderRadius: "50% 50% 0 0" }} />
    </div>
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#e8e0c0", lineHeight: 1.3, marginBottom: 4 }}>The Couple<br />Next Door</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#6a8060", textTransform: "uppercase" }}>Shari Lapena</div>
    </div>
  </div>
);

const CoverIsland = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #4a1a08 0%, #7a3010 40%, #5a2008 100%)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(200,120,40,0.4), transparent 60%)" }} />
    <svg viewBox="0 0 120 160" style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", width: 110 }}>
      <line x1="60" y1="160" x2="60" y2="60" stroke="rgba(140,90,40,0.7)" strokeWidth="4" />
      <path d="M60,60 Q30,45 15,25 Q40,38 55,55" fill="rgba(80,140,40,0.6)" /><path d="M60,60 Q90,45 105,25 Q80,38 65,55" fill="rgba(60,120,30,0.6)" />
      <path d="M60,80 Q25,65 8,48 Q35,60 58,75" fill="rgba(80,140,40,0.5)" /><path d="M60,80 Q95,65 112,48 Q85,60 62,75" fill="rgba(60,120,30,0.5)" />
    </svg>
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "#e8c090", lineHeight: 1.3, marginBottom: 4 }}>Island of the<br />Missing Trees</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#9a6040", textTransform: "uppercase" }}>Elif Shafak</div>
    </div>
  </div>
);

const CoverHavana = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(140deg, #0a4a70 0%, #1a6a8a 50%, #0e5878 100%)", position: "relative", overflow: "hidden" }}>
    <svg viewBox="0 0 100 80" style={{ position: "absolute", top: 45, left: "50%", transform: "translateX(-50%)", width: 100 }}>
      <path d="M50,70 L50,30" stroke="rgba(60,140,60,0.7)" strokeWidth="3" />
      <path d="M50,30 Q30,10 15,20 Q35,25 50,40" fill="rgba(60,140,60,0.6)" /><path d="M50,30 Q70,10 85,20 Q65,25 50,40" fill="rgba(40,120,40,0.6)" />
      <ellipse cx="50" cy="70" rx="18" ry="5" fill="rgba(0,0,0,0.25)" />
    </svg>
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: "#f0e0b0", lineHeight: 1.3, marginBottom: 4 }}>Next Year<br />in Havana</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#a0c0d0", textTransform: "uppercase" }}>Chanel Cleeton</div>
    </div>
  </div>
);

const CoverTheRuin = () => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #0a0e18 0%, #121a28 60%, #0e1520 100%)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "35%", left: 0, right: 0, height: 1, background: "rgba(100,130,180,0.4)" }} />
    <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#a0b8d8", lineHeight: 1.2, marginBottom: 4, letterSpacing: 2 }}>THE RUIN</div>
      <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, color: "#4a6080", textTransform: "uppercase" }}>Dervla McTiernan</div>
    </div>
  </div>
);

const BOOKS = [
  { cover: <CoverNightingale />, title: "The Nightingale", author: "Kristin Hannah", hook: "Two sisters. WWII France. You will cry twice and that's a promise.", priority: "READ THIS FIRST", priorityColor: "#c0392b", rotation: -1.5 },
  { cover: <CoverFamilyUpstairs />, title: "The Family Upstairs", author: "Lisa Jewell", hook: "You read The Third Wife. Her real masterwork is this one.", priority: "Beyond The Third Wife", priorityColor: "#7a3baf", rotation: 1 },
  { cover: <CoverGoodGirl />, title: "A Good Girl's Guide to Murder", author: "Holly Jackson", hook: "True crime energy meets Harlan Coben plotting. Read the trilogy.", priority: "Your Next Series", priorityColor: "#1a7a8a", rotation: -0.5 },
  { cover: <CoverBigLittleLies />, title: "Big Little Lies", author: "Liane Moriarty", hook: "You've read The Last Anniversary. This is her best. Somehow you haven't.", priority: "Obvious Gap", priorityColor: "#d4b020", rotation: 2 },
  { cover: <CoverMeBeforeYou />, title: "Me Before You", author: "Jojo Moyes", hook: "The emotional devastation of Emily Henry, written a decade earlier.", priority: "Missing Author", priorityColor: "#c05030", rotation: -1 },
  { cover: <CoverInTheWoods />, title: "In the Woods", author: "Tana French", hook: "The best thriller series ever written. Atmospheric, literary, unforgettable.", priority: "Literary Thriller", priorityColor: "#1e8a6a", rotation: 1.5 },
  { cover: <CoverGentleman />, title: "The Gentleman of Moscow", author: "Amor Towles", hook: "It's already on your list. Move it to the top.", priority: "On Your TBR", priorityColor: "#c9a020", rotation: -2 },
  { cover: <CoverCaraval />, title: "Caraval", author: "Stephanie Garber", hook: "Also already on your list. Circus magic, dark romance, can't stop reading.", priority: "On Your TBR", priorityColor: "#d460a0", rotation: 0.5 },
  { cover: <CoverCoupleNextDoor />, title: "The Couple Next Door", author: "Shari Lapena", hook: "Post-Greer Hendricks? Shari Lapena is your next domestic thriller obsession.", priority: "Greer Hendricks Adjacent", priorityColor: "#1a7a8a", rotation: -1 },
  { cover: <CoverIsland />, title: "Island of the Missing Trees", author: "Elif Shafak", hook: "Cyprus, loss, and a fig tree that tells the story. Quietly devastating.", priority: "Literary Fiction", priorityColor: "#8B6020", rotation: 1.5 },
  { cover: <CoverHavana />, title: "Next Year in Havana", author: "Chanel Cleeton", hook: "Cuba, romance, family secrets, revolution. Already on your list — why?", priority: "On Your TBR", priorityColor: "#1a7a8a", rotation: -0.5 },
  { cover: <CoverTheRuin />, title: "The Ruin", author: "Dervla McTiernan", hook: "You loved What Happened to Nina. Start at the beginning of Cormac Reilly.", priority: "Based on What Happened to Nina", priorityColor: "#4a80c0", rotation: 1 },
];

// ─── TOOLTIP COMPONENTS ─────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <div style={{ background: "#1a0a14", border: "1px solid #5a2040", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#f5e0ef", fontFamily: "Lato, sans-serif", fontSize: 13, margin: 0 }}>
        <strong style={{ color: "#d4a0c0" }}>{payload[0].payload.year}</strong> · {payload[0].value} books
      </p>
    </div>
  ) : null;

const GenreTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <div style={{ background: "#1a0a14", border: "1px solid #5a2040", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#f5e0ef", fontFamily: "Lato, sans-serif", fontSize: 12, margin: 0 }}>
        {payload[0].name}: <strong>{payload[0].value}</strong>
      </p>
    </div>
  ) : null;

// ─── TAB VIEWS ───────────────────────────────────────────────────────────────

function VisualDashboard() {
  return (
    <div style={{ background: "#0d0810", color: "#f5e0ef", fontFamily: "Georgia, serif" }}>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #1c0a14 0%, #2a0d24 40%, #1a0a2e 100%)", padding: "3rem 2rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,74,0.2), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,59,140,0.2), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(72px, 15vw, 112px)", fontWeight: 700, color: "#fff", lineHeight: 1 }}>412</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(18px, 4vw, 28px)", color: "#b07090" }}>books</span>
          </div>
          <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 300, color: "#7a5060", fontSize: 13, letterSpacing: 1, marginBottom: 32 }}>tracked across 6 years</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 5vw, 48px)", flexWrap: "wrap" }}>
            {[{ label: "Years Tracked", value: "6" }, { label: "Avg / Year", value: "69" }, { label: "Best Year", value: "2024" }, { label: "2026 YTD", value: "19" }].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, color: "#d4a0c0" }}>{s.value}</div>
                <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "#6a4050" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem 3rem" }}>
        {/* YEAR CHART */}
        <section style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f5e0ef", margin: 0 }}>Reading by Year</h2>
            <span style={{ fontFamily: "Lato, sans-serif", fontSize: 11, color: "#7a5060", letterSpacing: 1 }}>books read each period</span>
          </div>
          <div style={{ background: "#130810", borderRadius: 14, padding: "24px 16px 16px", border: "1px solid #2a1020" }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={YEAR_DATA} barCategoryGap="25%">
                <XAxis dataKey="year" tick={{ fill: "#7a5060", fontSize: 13, fontFamily: "Lato, sans-serif", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" radius={[8, 8, 2, 2]}>{YEAR_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* GENRE + AUTHORS */}
        <div style={{ display: "grid", gridTemplateColumns: "5fr 6fr", gap: 16, marginBottom: 20 }}>
          <section>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f5e0ef", margin: "0 0 14px" }}>By Genre</h2>
            <div style={{ background: "#130810", borderRadius: 14, padding: "20px", border: "1px solid #2a1020" }}>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={GENRE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none" paddingAngle={2}>
                    {GENRE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip content={<GenreTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                {GENRE_DATA.map((g) => (
                  <div key={g.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: g.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "Lato, sans-serif", fontSize: 11, color: "#8a6070", flex: 1, lineHeight: 1.3 }}>{g.name}</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: g.color, fontWeight: 700 }}>{g.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f5e0ef", margin: "0 0 14px" }}>Top Authors</h2>
            <div style={{ background: "#130810", borderRadius: 14, padding: "20px", border: "1px solid #2a1020", display: "flex", flexDirection: "column", gap: 11 }}>
              {AUTHORS.map((a, i) => (
                <div key={a.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                    <span style={{ fontFamily: "Lato, sans-serif", fontSize: 12, color: "#c0a0b0", fontWeight: 700 }}>
                      <span style={{ color: "#4a2030", marginRight: 6, fontSize: 10 }}>#{i + 1}</span>{a.name}
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: a.color }}>{a.count}</span>
                  </div>
                  <div style={{ background: "#2a1020", borderRadius: 4, height: 5 }}>
                    <div style={{ width: `${(a.count / 28) * 100}%`, background: `linear-gradient(90deg, ${a.color}99, ${a.color})`, borderRadius: 4, height: "100%" }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* INSIGHTS */}
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f5e0ef", margin: "0 0 14px" }}>Reading Insights</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {INSIGHTS.map((ins) => (
              <div key={ins.label} style={{ background: "#130810", borderRadius: 12, padding: "16px", border: "1px solid #2a1020" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{ins.emoji}</div>
                <div style={{ fontFamily: "Lato, sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#5a3040", marginBottom: 5 }}>{ins.label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#f5e0ef", lineHeight: 1.3, marginBottom: 3 }}>{ins.value}</div>
                <div style={{ fontFamily: "Lato, sans-serif", fontSize: 11, color: "#7a5060" }}>{ins.sub}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LiteraryThemes() {
  const [expanded, setExpanded] = useState("romance");
  return (
    <div style={{ background: "#0c0810", fontFamily: "Georgia, serif", color: "#f0e8f4" }}>
      {/* Summary bar */}
      <div style={{ background: "#110818", borderBottom: "1px solid #2a1a3a", padding: "1rem 1.5rem", overflowX: "auto" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 6, justifyContent: "space-between" }}>
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => setExpanded(expanded === t.id ? null : t.id)} style={{ flex: 1, minWidth: 60, padding: "8px 4px", borderRadius: 8, border: `1.5px solid ${expanded === t.id ? t.color : "#2a1a3a"}`, background: expanded === t.id ? `${t.color}22` : "transparent", color: expanded === t.id ? t.light : "#6a4a7a", cursor: "pointer", fontFamily: "Lato, sans-serif", fontSize: "clamp(9px, 1.5vw, 12px)", fontWeight: 700, textAlign: "center", transition: "all 0.2s" }}>
              <div style={{ fontSize: "clamp(16px, 3vw, 20px)", marginBottom: 3 }}>{t.emoji}</div>
              <div style={{ lineHeight: 1.2 }}>{t.count}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem 1rem 3rem", display: "flex", flexDirection: "column", gap: 12 }}>
        {THEMES.map((t) => {
          const isOpen = expanded === t.id;
          return (
            <div key={t.id} onClick={() => setExpanded(isOpen ? null : t.id)} style={{ background: isOpen ? t.bg : "#130810", borderRadius: 14, border: `1.5px solid ${isOpen ? t.color + "55" : "#2a1a3a"}`, overflow: "hidden", transition: "all 0.3s ease", boxShadow: isOpen ? `0 8px 32px ${t.color}20` : "none", cursor: "pointer" }}>
              <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${t.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1px solid ${t.color}33` }}>{t.emoji}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(14px, 3vw, 18px)", fontWeight: 700, color: "#f0e8f4", margin: "0 0 3px", lineHeight: 1.2 }}>{t.name}</h2>
                  <div style={{ fontFamily: "Lato, sans-serif", fontSize: 11, color: t.light, fontWeight: 700, letterSpacing: 1 }}>{t.count} books</div>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: t.color, flexShrink: 0, lineHeight: 1 }}>{t.count}</div>
                <div style={{ color: "#4a2a5a", fontSize: 16, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</div>
              </div>
              {isOpen && (
                <div style={{ padding: "0 20px 20px" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: "#c0a8d4", lineHeight: 1.65, margin: "0 0 18px", paddingTop: 2, borderTop: `1px solid ${t.color}22` }}>"{t.vibe}"</p>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontFamily: "Lato, sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#5a3a6a", marginBottom: 10 }}>Representative Reads</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", flexWrap: "wrap" }}>
                      {t.standouts.map((book, i) => {
                        const h = 60 + ((i * 17) % 50);
                        const shades = ["aa", "cc", "ee", "bb", "dd", "99", "ff", "cc", "aa", "bb"];
                        return (
                          <div key={book} title={book} style={{ width: 28, height: h, background: `${t.color}${shades[i % shades.length]}`, borderRadius: "3px 3px 2px 2px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 6px rgba(0,0,0,0.4)", position: "relative", overflow: "hidden" }}>
                            <span style={{ fontFamily: "Lato, sans-serif", fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.9)", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", lineHeight: 1.1, textAlign: "center", padding: "2px 0", letterSpacing: 0.5, maxHeight: h - 8, overflow: "hidden" }}>{book.length > 20 ? book.slice(0, 18) + "…" : book}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: "Lato, sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#5a3a6a", marginBottom: 8 }}>Key Authors</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {t.keyAuthors.map((a) => (<span key={a} style={{ fontFamily: "Lato, sans-serif", fontSize: 12, fontWeight: 700, color: t.light, background: `${t.color}18`, border: `1px solid ${t.color}44`, borderRadius: 20, padding: "3px 10px" }}>{a}</span>))}
                    </div>
                  </div>
                  <div style={{ fontFamily: "Lato, sans-serif", fontSize: 12, color: "#7a5a8a", background: `${t.color}10`, borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${t.color}55`, lineHeight: 1.6 }}>📝 {t.note}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TBRPile() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div style={{ background: "#f5f0e8", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "clamp(20px, 4vw, 36px) clamp(12px, 3vw, 24px)", alignItems: "start" }}>
          {BOOKS.map((book, i) => (
            <div key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ transform: hoveredIdx === i ? "rotate(0deg) translateY(-6px) scale(1.04)" : `rotate(${book.rotation}deg)`, zIndex: hoveredIdx === i ? 10 : 1, position: "relative", transition: "transform 0.25s ease" }}>
              <div style={{ width: "100%", paddingBottom: "155%", position: "relative", borderRadius: "3px 4px 4px 3px", overflow: "hidden", boxShadow: hoveredIdx === i ? "6px 8px 30px rgba(0,0,0,0.5), inset -3px 0 10px rgba(0,0,0,0.3)" : "4px 5px 18px rgba(0,0,0,0.35), inset -2px 0 7px rgba(0,0,0,0.2)" }}>
                <div style={{ position: "absolute", inset: 0 }}>{book.cover}</div>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)", pointerEvents: "none" }} />
              </div>
              <div style={{ marginTop: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: "Lato, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: book.priorityColor, display: "block" }}>{book.priority}</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 700, color: "#1c0a14", lineHeight: 1.25, marginBottom: 3 }}>{book.title}</div>
              <div style={{ fontFamily: "Lato, sans-serif", fontSize: 11, color: "#7a5060", marginBottom: 5 }}>{book.author}</div>
              {hoveredIdx === i && (
                <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "#4a2030", lineHeight: 1.55, borderTop: `2px solid ${book.priorityColor}`, paddingTop: 6 }}>{book.hook}</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, padding: "20px 24px", background: "#ede5d8", borderRadius: 12, borderLeft: "4px solid #8b1a4a" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: "#4a2030", lineHeight: 1.7, margin: 0 }}>
            "The most urgent action item from your entire reading history: read <strong>The Nightingale</strong> by Kristin Hannah. You've read 412 books and somehow not this one. Fix it immediately." 📚
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "stats", label: "📊 Overview", subtitle: "Charts & Data" },
  { id: "themes", label: "🎭 By Theme", subtitle: "7 Genres" },
  { id: "tbr", label: "📚 TBR Pile", subtitle: "12 Picks" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div style={{ fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* SHARED HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1c0a14 0%, #2a0d24 50%, #1a0a2e 100%)", padding: "1.5rem 2rem 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,74,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontFamily: "Lato, sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#9a6080", marginBottom: 6 }}>Chelsea Taylor · Reading Life</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 700, color: "#f0d8ff", marginBottom: "1.5rem" }}>
            412 Books &amp; Counting
          </h1>

          {/* TAB BAR */}
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 20px", borderRadius: "10px 10px 0 0", border: "none", background: isActive ? (tab.id === "tbr" ? "#f5f0e8" : "#0c0810") : "transparent", color: isActive ? (tab.id === "tbr" ? "#1c0a14" : "#f0e8f4") : "#7a5080", cursor: "pointer", fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: "clamp(11px, 2vw, 14px)", letterSpacing: 0.5, transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span>{tab.label}</span>
                  <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.6, fontWeight: 400 }}>{tab.subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "stats" && <VisualDashboard />}
      {activeTab === "themes" && <LiteraryThemes />}
      {activeTab === "tbr" && <TBRPile />}
    </div>
  );
}
