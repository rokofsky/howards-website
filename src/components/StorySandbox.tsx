import { useEffect, useMemo, useState } from "react";
import { Shuffle, Plus, X, Pencil, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const SANDBOX_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzWso-MMMvfENkt_10n4qgrwTtUjRbZSf9nlDzVe8r7RS4g0bEeftbAQjC8_fCJQM/exec";
const ONELINERS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzWso-MMMvfENkt_10n4qgrwTtUjRbZSf9nlDzVe8r7RS4g0bEeftbAQjC8_fCJQM/exec";
const SHEET3_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzWso-MMMvfENkt_10n4qgrwTtUjRbZSf9nlDzVe8r7RS4g0bEeftbAQjC8_fCJQM/exec";

const ENDPOINT_FOR: Record<SheetKey, string> = {
  sandbox: SANDBOX_SCRIPT_URL,
  oneLiners: ONELINERS_SCRIPT_URL,
  sheet3: SHEET3_SCRIPT_URL,
};

const gasFetch = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const extractArray = (data: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const k of keys) {
      const v = (data as Record<string, unknown>)[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
};

/* ============================================================
   FALLBACK SEED VOCABULARY (used if remote fetch fails)
   ============================================================ */
const FALLBACK_SEEDS = {
  character: [
    "A retired astronaut",
    "A small-town librarian",
    "A street magician",
    "A burned-out chef",
    "A lighthouse keeper",
    "A teenage chess prodigy",
    "An undercover food critic",
    "A jaded wedding photographer",
  ],
  incident: [
    "loses their keys at midnight",
    "receives a letter 40 years late",
    "finds a stranger asleep on the couch",
    "is mistaken for a celebrity",
    "discovers a hidden door at work",
    "wakes up in the wrong city",
    "inherits a parrot that quotes Nietzsche",
    "must give a speech in 10 minutes",
  ],
  constraint: [
    "without speaking a word",
    "in under five minutes",
    "while it's pouring rain",
    "without using their phone",
    "in front of their ex",
    "during a power outage",
    "with only a paper map",
    "while pretending everything is fine",
  ],
  setting: [
    "in a 24-hour laundromat",
    "on a delayed night train",
    "at a quiet beach off-season",
    "in a half-renovated apartment",
  ],
} as const;

const FALLBACK_ONE_LINERS = [
  "Write the scene right before everything changes.",
  "Tell a story using only dialogue from one phone call.",
  "Describe a goodbye that isn't really goodbye.",
  "A character lies to protect someone — show the cost.",
];

const FALLBACK_SHEET3 = [
  "Open with a sentence that ends in a question.",
  "Set the story during a single song.",
  "Begin and end in the same place — but different.",
  "Let weather change the meaning halfway through.",
];

/* ============================================================
   STRUCTURES
   ============================================================ */
const STRUCTURES = {
  "3-act": {
    label: "3-act story",
    helper: "Setup, confrontation, resolution.",
    sections: [
      { key: "act1", title: "Act 1 — Setup", hint: "Who, where, what's normal?" },
      { key: "act2", title: "Act 2 — Confrontation", hint: "What breaks? What's at stake?" },
      { key: "act3", title: "Act 3 — Resolution", hint: "How does it land?" },
    ],
  },
  adventure: {
    label: "An adventure",
    helper: "Classic arc: call, journey, return.",
    sections: [
      { key: "intro", title: "Introduction", hint: "Set the world and the hero." },
      { key: "escalation", title: "Escalation", hint: "Rising stakes, obstacles, allies." },
      { key: "denouement", title: "Denouement", hint: "Climax and turning point." },
      { key: "resolution", title: "Resolution", hint: "What changed? What's the lesson?" },
    ],
  },
} as const;

type StructureKey = keyof typeof STRUCTURES;
const STORAGE_KEY = "story-sandbox:v1";

type Category = "character" | "incident" | "constraint";
type Prompts = Record<Category, string> & { custom: string };

const CATEGORY_META: { key: Category | "custom"; label: string; tone: string; box: ElementBox }[] = [
  { key: "character", label: "Character", tone: "from-petrol/20 to-petrol/5 border-petrol/30", box: "character" },
  { key: "incident", label: "Incident", tone: "from-gold/25 to-gold/5 border-gold/40", box: "incident" },
  { key: "constraint", label: "Constraint", tone: "from-primary/20 to-primary/5 border-primary/30", box: "constraint" },
  { key: "custom", label: "Custom", tone: "from-muted to-background border-dashed border-muted-foreground/40", box: "untitled" },
];

type SheetKey = "sandbox" | "oneLiners" | "sheet3";
type ElementBox = "character" | "incident" | "constraint" | "untitled" | "generic";

type SandboxRow = {
  id?: string | number;
  character?: string;
  incident?: string;
  constraint?: string;
  setting?: string;
  untitled?: string;
};
type PromptRow = {
  id?: string | number;
  prompt?: string;
  text?: string;
  oneLiner?: string;
};

const pickRandom = <T,>(arr: T[]): T | undefined =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;

const extractText = (r: PromptRow): string => {
  if (typeof r.prompt === "string" && r.prompt.trim()) return r.prompt.trim();
  if (typeof r.oneLiner === "string" && r.oneLiner.trim()) return r.oneLiner.trim();
  if (typeof r.text === "string" && r.text.trim()) return r.text.trim();
  for (const v of Object.values(r)) {
    if (typeof v === "string" && v.trim() && v !== String(r.id)) return v.trim();
  }
  return "";
};

const buildFallbackSandbox = (): SandboxRow[] =>
  FALLBACK_SEEDS.character.map((c, i) => ({
    id: `fb-${i}`,
    character: c,
    incident: FALLBACK_SEEDS.incident[i % FALLBACK_SEEDS.incident.length],
    constraint: FALLBACK_SEEDS.constraint[i % FALLBACK_SEEDS.constraint.length],
    setting: FALLBACK_SEEDS.setting[i % FALLBACK_SEEDS.setting.length],
  }));

const buildFallbackPrompts = (lines: readonly string[]): PromptRow[] =>
  lines.map((p, i) => ({ id: `fb-${i}`, prompt: p }));

export default function StorySandbox() {
  // --- Independent data sources ---
  const [allSandboxPrompts, setAllSandboxPrompts] = useState<SandboxRow[]>(buildFallbackSandbox());
  const [allOneLiners, setAllOneLiners] = useState<PromptRow[]>(buildFallbackPrompts(FALLBACK_ONE_LINERS));
  const [allSheet3Prompts, setAllSheet3Prompts] = useState<PromptRow[]>(buildFallbackPrompts(FALLBACK_SHEET3));

  // --- Independent loading states ---
  const [sandboxLoading, setSandboxLoading] = useState(true);
  const [oneLinersLoading, setOneLinersLoading] = useState(true);
  const [sheet3Loading, setSheet3Loading] = useState(true);

  // --- Independent active rows / cycle keys ---
  const initialSandbox = useMemo(() => buildFallbackSandbox(), []);
  const [sandboxRow, setSandboxRow] = useState<SandboxRow | null>(initialSandbox[0] ?? null);
  const [oneLinerRow, setOneLinerRow] = useState<PromptRow | null>(null);
  const [sheet3Row, setSheet3Row] = useState<PromptRow | null>(null);

  const [prompts, setPrompts] = useState<Prompts>(() => ({
    character: initialSandbox[0]?.character ?? "",
    incident: initialSandbox[0]?.incident ?? "",
    constraint: initialSandbox[0]?.constraint ?? "",
    custom: "",
  }));
  const [editing, setEditing] = useState<Category | "custom" | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [oneLinerAnimKey, setOneLinerAnimKey] = useState(0);
  const [sheet3AnimKey, setSheet3AnimKey] = useState(0);

  const [structure, setStructure] = useState<StructureKey>("3-act");
  const [scratch, setScratch] = useState<Record<string, string>>({});

  // --- Per-box vote counts: key = `${sheetKey}:${id}:${box}` ---
  const [voteCounts, setVoteCounts] = useState<Record<string, { up: number; down: number }>>({});

  // Hydrate persisted UI state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.prompts) setPrompts((p) => ({ ...p, ...parsed.prompts }));
        if (parsed.structure) setStructure(parsed.structure);
        if (parsed.scratch) setScratch(parsed.scratch);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Fetch all tabs from Google Apps Script (single source of truth)
  useEffect(() => {
    let cancelled = false;
  // --- THREE INDEPENDENT FETCH PIPELINES (one per Google Apps Script endpoint) ---
  useEffect(() => {
    let cancelled = false;

    // 1. Sandbox
    (async () => {
      try {
        const data = await gasFetch(SANDBOX_SCRIPT_URL);
        if (cancelled) return;
        const rows = extractArray(data, ["sandboxPrompts", "sandbox", "sheet1", "data", "rows"]) as SandboxRow[];
        if (rows.length) {
          setAllSandboxPrompts(rows);
          const first = rows[0];
          setSandboxRow(first);
          setPrompts((p) => ({
            ...p,
            character: first.character ?? p.character,
            incident: first.incident ?? p.incident,
            constraint: first.constraint ?? p.constraint,
          }));
        }
      } catch (err) {
        console.error("[StorySandbox] Sandbox fetch failed — using fallback seeds.", err);
      } finally {
        if (!cancelled) setSandboxLoading(false);
      }
    })();

    // 2. One-liners
    (async () => {
      try {
        const data = await gasFetch(ONELINERS_SCRIPT_URL);
        if (cancelled) return;
        const rows = extractArray(data, ["oneLiners", "sheet1", "data", "rows"]) as PromptRow[];
        if (rows.length) {
          setAllOneLiners(rows);
          setOneLinerRow(rows[Math.floor(Math.random() * rows.length)]);
        }
      } catch (err) {
        console.error("[StorySandbox] One-liners fetch failed — using fallback seeds.", err);
      } finally {
        if (!cancelled) setOneLinersLoading(false);
      }
    })();

    // 3. Sheet3
    (async () => {
      try {
        const data = await gasFetch(SHEET3_SCRIPT_URL);
        if (cancelled) return;
        const rows = extractArray(data, ["sheet3", "prompts", "sheet1", "data", "rows"]) as PromptRow[];
        if (rows.length) {
          setAllSheet3Prompts(rows);
          setSheet3Row(rows[Math.floor(Math.random() * rows.length)]);
        }
      } catch (err) {
        console.error("[StorySandbox] Sheet3 fetch failed — using fallback seeds.", err);
      } finally {
        if (!cancelled) setSheet3Loading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist UI state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ prompts, structure, scratch }),
    );
  }, [prompts, structure, scratch]);

  // --- Independent shuffle handlers ---
  const shuffle = () => {
    const row = pickRandom(allSandboxPrompts);
    if (!row) return;
    setSandboxRow(row);
    setPrompts((p) => ({
      character: row.character ?? p.character,
      incident: row.incident ?? p.incident,
      constraint: row.constraint ?? p.constraint,
      custom: p.custom,
    }));
    setAnimKey((k) => k + 1);
  };

  const shuffleOneLiner = () => {
    const row = pickRandom(allOneLiners);
    if (!row) return;
    setOneLinerRow(row);
    setOneLinerAnimKey((k) => k + 1);
  };


  // --- Voting ---
  const handleVote = (
    sheetKey: SheetKey,
    id: string | number | undefined,
    elementBox: ElementBox,
    vote: "up" | "down",
  ) => {
    if (id === undefined || id === null || id === "") return;
    const key = `${sheetKey}:${id}:${elementBox}`;
    setVoteCounts((prev) => {
      const cur = prev[key] ?? { up: 0, down: 0 };
      return { ...prev, [key]: { ...cur, [vote]: cur[vote] + 1 } };
    });
    // Fire-and-forget; don't block UI
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ sheetKey, id, vote, elementBox }),
    }).catch((err) => console.warn("[StorySandbox] vote post failed", err));
  };

  const VoteThumbs = ({
    sheetKey,
    id,
    box,
  }: {
    sheetKey: SheetKey;
    id: string | number | undefined;
    box: ElementBox;
  }) => {
    const key = `${sheetKey}:${id}:${box}`;
    const counts = voteCounts[key] ?? { up: 0, down: 0 };
    const disabled = id === undefined || id === null || id === "";
    return (
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleVote(sheetKey, id, box, "up")}
          className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors disabled:opacity-40"
          aria-label="Thumbs up"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{counts.up}</span>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleVote(sheetKey, id, box, "down")}
          className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors disabled:opacity-40"
          aria-label="Thumbs down"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          <span>{counts.down}</span>
        </button>
      </div>
    );
  };

  const current = STRUCTURES[structure];
  const sections = useMemo(() => current.sections, [current]);

  const handleSaveStory = () => {
    const lines: string[] = [
      "=========================================",
      "STORY SANDBOX EXPORT",
      "=========================================",
      "",
    ];
    sections.forEach((s) => {
      const val = (scratch[`${structure}:${s.key}`] ?? "").trim();
      lines.push(`[${s.title.toUpperCase()}]`);
      lines.push(val || "(Empty)");
      lines.push("");
    });
    const notes = (scratch[`${structure}:notes`] ?? "").trim();
    lines.push("[NOTES]");
    lines.push(notes || "(Empty)");
    lines.push("");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-story-sandbox.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const oneLinerText = oneLinerRow ? extractText(oneLinerRow) : "";
  

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">Story Sandbox</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Generate prompts, pick a structure, sketch a micro-story.
        </p>
      </header>

      {/* Prompt Generator (Sandbox / Sheet1) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Prompts</h3>
          <Button variant="glass" size="sm" onClick={shuffle} disabled={sandboxLoading && !allSandboxPrompts.length}>
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_META.map(({ key, label, tone, box }) => {
            const value = prompts[key];
            const isCustomSlot = key === "custom";
            const isEditing = editing === key;
            return (
              <Card
                key={`${key}-${animKey}`}
                className={cn(
                  "relative p-4 min-h-[140px] flex flex-col justify-between bg-gradient-to-br animate-fade-in-up border",
                  tone,
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    {label}
                  </span>
                  {!isEditing && !isCustomSlot && (
                    <button
                      type="button"
                      onClick={() => setEditing(key)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Edit ${label}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      autoFocus
                      value={value}
                      onChange={(e) =>
                        setPrompts((p) => ({ ...p, [key]: e.target.value }))
                      }
                      onBlur={() => setEditing(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") setEditing(null);
                      }}
                      placeholder={`Your own ${label.toLowerCase()}…`}
                    />
                  </div>
                ) : isCustomSlot ? (
                  value ? (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-base font-medium">{value}</p>
                      <button
                        type="button"
                        onClick={() => setPrompts((p) => ({ ...p, custom: "" }))}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Clear custom"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing("custom")}
                      className="flex-1 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors gap-1"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-sm">Add your own</span>
                    </button>
                  )
                ) : (
                  <p className="text-base font-medium leading-snug">{value}</p>
                )}

                <div className="mt-3 flex justify-end">
                  <VoteThumbs sheetKey="sandbox" id={sandboxRow?.id} box={box} />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* One-liner Prompt Generator (Sheet2) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">One size fits all prompts</h3>
          <Button
            variant="glass"
            size="sm"
            onClick={shuffleOneLiner}
            disabled={!allOneLiners.length}
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
        </div>
        <Card
          key={`oneliner-${oneLinerAnimKey}`}
          className="relative p-4 min-h-[140px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gold/20 to-petrol/10 border border-gold/30 animate-fade-in-up"
        >
          <p className="text-base md:text-lg font-medium text-center leading-snug">
            {oneLinerText || (oneLinersLoading ? "Loading prompts…" : "Hit shuffle.")}
          </p>
          <VoteThumbs sheetKey="oneLiners" id={oneLinerRow?.id} box="generic" />
        </Card>
      </section>


      {/* Structure Selector + Save Story (aligned horizontally) */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Structure</h3>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ToggleGroup
            type="single"
            value={structure}
            onValueChange={(v) => v && setStructure(v as StructureKey)}
            className="justify-start flex-wrap"
          >
            {(Object.keys(STRUCTURES) as StructureKey[]).map((k) => (
              <ToggleGroupItem
                key={k}
                value={k}
                variant="outline"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {STRUCTURES[k].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button
            size="lg"
            onClick={handleSaveStory}
            className="text-base font-semibold px-6 py-5 text-white hover:opacity-90"
            style={{ backgroundColor: "#175f87" }}
          >
            Save Story
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{current.helper}</p>
      </section>

      {/* Scratchpad */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Scratchpad</h3>
        <div key={structure} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {sections.map((s) => (
            <div key={s.key} className="space-y-1.5">
              <Label htmlFor={`sb-${s.key}`} className="text-sm font-semibold">
                {s.title}
              </Label>
              <p className="text-xs text-muted-foreground">{s.hint}</p>
              <Textarea
                id={`sb-${s.key}`}
                value={scratch[`${structure}:${s.key}`] ?? ""}
                onChange={(e) =>
                  setScratch((prev) => ({
                    ...prev,
                    [`${structure}:${s.key}`]: e.target.value,
                  }))
                }
                placeholder="Sketch a few lines…"
                rows={5}
              />
            </div>
          ))}
          {structure === "3-act" && (
            <div className="space-y-1.5">
              <Label htmlFor="sb-notes" className="text-sm font-semibold">
                Notes
              </Label>
              <p className="text-xs text-muted-foreground">Anything else worth jotting down.</p>
              <Textarea
                id="sb-notes"
                value={scratch[`${structure}:notes`] ?? ""}
                onChange={(e) =>
                  setScratch((prev) => ({ ...prev, [`${structure}:notes`]: e.target.value }))
                }
                placeholder="Notes…"
                rows={5}
              />
            </div>
          )}
        </div>
        {structure === "adventure" && (
          <div className="animate-fade-in flex justify-center">
            <div className="w-full md:w-1/2 space-y-1.5">
              <Label htmlFor="sb-notes" className="text-sm font-semibold">
                Notes
              </Label>
              <p className="text-xs text-muted-foreground">Anything else worth jotting down.</p>
              <Textarea
                id="sb-notes"
                value={scratch[`${structure}:notes`] ?? ""}
                onChange={(e) =>
                  setScratch((prev) => ({ ...prev, [`${structure}:notes`]: e.target.value }))
                }
                placeholder="Notes…"
                rows={5}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
