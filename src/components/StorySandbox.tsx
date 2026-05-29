import { useEffect, useMemo, useState } from "react";
import { Shuffle, Plus, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzWso-MMMvfENkt_10n4qgrwTtUjRbZSf9nlDzVe8r7RS4g0bEeftbAQjC8_fCJQM/exec";

export default function StorySandbox() {
/* ============================================================
   SEED VOCABULARY — fetched from Sheety with hardcoded fallback
   ============================================================ */

const SHEETY_URL =
  "https://api.sheety.co/086a2eae49353df7574b77bca2c248de/storySandboxSeedInputs/storySandboxSeedInputs";
const SEEDS_CACHE_KEY = "story-sandbox:seeds:v1";

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

type SeedSet = {
  character: string[];
  incident: string[];
  constraint: string[];
  setting: string[];
};


/* ============================================================
   STRUCTURES — edit/extend freely
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

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

type Category = "character" | "incident" | "constraint";
type Prompts = Record<Category, string> & { custom: string };

const initialPrompts = (seeds: SeedSet): Prompts => ({
  character: pick(seeds.character) ?? "",
  incident: pick(seeds.incident) ?? "",
  constraint: pick(seeds.constraint) ?? "",
  custom: "",
});

const CATEGORY_META: { key: Category | "custom"; label: string; tone: string }[] = [
  { key: "character", label: "Character", tone: "from-petrol/20 to-petrol/5 border-petrol/30" },
  { key: "incident", label: "Incident", tone: "from-gold/25 to-gold/5 border-gold/40" },
  { key: "constraint", label: "Constraint", tone: "from-primary/20 to-primary/5 border-primary/30" },
  { key: "custom", label: "Custom", tone: "from-muted to-background border-dashed border-muted-foreground/40" },
];

const FALLBACK: SeedSet = {
  character: [...FALLBACK_SEEDS.character],
  incident: [...FALLBACK_SEEDS.incident],
  constraint: [...FALLBACK_SEEDS.constraint],
  setting: [...FALLBACK_SEEDS.setting],
};

const parseSheetyRows = (rows: unknown): SeedSet | null => {
  if (!Array.isArray(rows)) return null;
  const out: SeedSet = { character: [], incident: [], constraint: [], setting: [] };
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    (["character", "incident", "constraint", "setting"] as const).forEach((k) => {
      const v = r[k];
      if (typeof v === "string" && v.trim()) out[k].push(v.trim());
    });
  }
  if (!out.character.length && !out.incident.length && !out.constraint.length) return null;
  // Backfill any empty category from fallback so shuffle never breaks
  (["character", "incident", "constraint", "setting"] as const).forEach((k) => {
    if (!out[k].length) out[k] = [...FALLBACK[k]];
  });
  return out;
};

export default function StorySandbox() {
  const [seeds, setSeeds] = useState<SeedSet>(FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompts>(() => initialPrompts(FALLBACK));
  const [editing, setEditing] = useState<Category | "custom" | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [structure, setStructure] = useState<StructureKey>("3-act");
  const [scratch, setScratch] = useState<Record<string, string>>({});
  const [allOneLiners, setAllOneLiners] = useState<string[]>([]);
  const [oneLinerPrompt, setOneLinerPrompt] = useState<string>("");
  const [oneLinerAnimKey, setOneLinerAnimKey] = useState(0);


  // Hydrate UI state + cached seeds from localStorage, then fetch fresh from Sheety
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

    let cached: SeedSet | null = null;
    try {
      const rawSeeds = localStorage.getItem(SEEDS_CACHE_KEY);
      if (rawSeeds) {
        const parsed = JSON.parse(rawSeeds);
        if (parsed && Array.isArray(parsed.character)) {
          cached = parsed as SeedSet;
          setSeeds(cached);
          setIsLoading(false);
        }
      }
    } catch {
      /* ignore */
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(SHEETY_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const parsed = parseSheetyRows(json?.storySandboxSeedInputs);
        if (parsed && !cancelled) {
          setSeeds(parsed);
          try {
            localStorage.setItem(SEEDS_CACHE_KEY, JSON.stringify(parsed));
          } catch {
            /* ignore */
          }
        }
      } catch (err) {
        console.warn("[StorySandbox] Sheety fetch failed, using fallback seeds.", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch one-liner prompts from Sheety
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          "https://api.sheety.co/086a2eae49353df7574b77bca2c248de/storyPromptsOneLiners/sheet1",
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const rows = Array.isArray(json?.sheet1) ? json.sheet1 : [];
        const lines: string[] = [];
        for (const row of rows) {
          if (!row || typeof row !== "object") continue;
          const r = row as Record<string, unknown>;
          const v =
            r.prompt ??
            r.oneLiner ??
            r.text ??
            Object.values(r).find((x) => typeof x === "string" && (x as string).trim() && x !== r.id);
          if (typeof v === "string" && v.trim()) lines.push(v.trim());
        }
        if (!cancelled && lines.length) {
          setAllOneLiners(lines);
          setOneLinerPrompt(lines[Math.floor(Math.random() * lines.length)]);
        }
      } catch (err) {
        console.warn("[StorySandbox] One-liner fetch failed.", err);
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

  const shuffle = () => {
    setPrompts((p) => ({
      character: pick(seeds.character) ?? p.character,
      incident: pick(seeds.incident) ?? p.incident,
      constraint: pick(seeds.constraint) ?? p.constraint,
      custom: p.custom,
    }));
    setAnimKey((k) => k + 1);
  };

  const shuffleOneLiner = () => {
    if (!allOneLiners.length) return;
    setOneLinerPrompt(allOneLiners[Math.floor(Math.random() * allOneLiners.length)]);
    setOneLinerAnimKey((k) => k + 1);
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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">Story Sandbox</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Generate prompts, pick a structure, sketch a micro-story.
        </p>
      </header>

      {/* Prompt Generator */}


      {/* Prompt Generator */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Prompts</h3>
          <Button variant="glass" size="sm" onClick={shuffle}>
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_META.map(({ key, label, tone }) => {
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
              </Card>
            );
          })}
        </div>
      </section>

      {/* One-liner Prompt Generator */}
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
          className="relative p-4 min-h-[140px] flex items-center justify-center bg-gradient-to-br from-gold/20 to-petrol/10 border border-gold/30 animate-fade-in-up"
        >
          <p className="text-base md:text-lg font-medium text-center leading-snug">
            {oneLinerPrompt || (allOneLiners.length ? "Hit shuffle." : "Loading prompts…")}
          </p>
        </Card>
      </section>

      {/* Structure Selector */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Structure</h3>

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

      <div className="flex justify-end pt-4">
        <Button variant="glass" size="sm" onClick={handleSaveStory}>
          Save Story
        </Button>
      </div>

    </div>

  );
}
