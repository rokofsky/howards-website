import { useEffect, useMemo, useState } from "react";
import { Shuffle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const readUserVotes = (): Record<string, "up" | "down"> => {
  try {
    const raw = localStorage.getItem("userVotes");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const SANDBOX_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxW9PeACm4LoKxSOY890qmC6py8EU0F64KbwYFCTHc0OL-ZsW7eLdpsprUBIU3Tzcfi/exec";
const ONELINERS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyws1eFpbD395kEuaMwriiGiOhGy6_Cgt-PPC4bURowx5UpVfXgwucxrIwsq8ERrcI/exec";
const SHEET3_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw4R91CvvhMg7Fz7CxkxeDIS89VUEt4lNp8HB5oYm88mbCmg-eSuIeyhDMS7YWnA8o/exec";

const SUPABASE_PROXY = "https://mgujrwuiftjmgnwnlels.supabase.co/functions/v1/sheets-proxy";

const extractArray = (data: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const k of keys) {
      const v = record[k];
      if (Array.isArray(v)) return v;
    }
    for (const container of ["data", "rows", "result", "payload"]) {
      const nested = record[container];
      if (Array.isArray(nested)) return nested;
      if (nested && typeof nested === "object") {
        for (const k of keys) {
          const v = (nested as Record<string, unknown>)[k];
          if (Array.isArray(v)) return v;
        }
      }
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
type Prompts = Record<Category, string>;

const CATEGORY_META: { key: Category; label: string; tone: string; box: ElementBox }[] = [
  { key: "character", label: "Character", tone: "from-petrol/20 to-petrol/5 border-petrol/30", box: "character" },
  { key: "incident", label: "By the way", tone: "from-gold/25 to-gold/5 border-gold/40", box: "incident" },
  { key: "constraint", label: "Add here", tone: "from-primary/20 to-primary/5 border-primary/30", box: "constraint" },
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
  const [, setSheet3Loading] = useState(true);
  const [, setSheet3Row] = useState<PromptRow | null>(null);

  // --- Independent active rows / cycle keys ---
  const initialSandbox = useMemo(() => buildFallbackSandbox(), []);
  const [cardRows, setCardRows] = useState<Record<Category, SandboxRow | null>>({
    character: initialSandbox[0] ?? null,
    incident: initialSandbox[0] ?? null,
    constraint: initialSandbox[0] ?? null,
  });
  const [oneLinerRow, setOneLinerRow] = useState<PromptRow | null>(null);

  const [prompts, setPrompts] = useState<Prompts>(() => ({
    character: initialSandbox[0]?.character ?? "",
    incident: initialSandbox[0]?.incident ?? "",
    constraint: initialSandbox[0]?.constraint ?? "",
  }));
  const [editing, setEditing] = useState<Category | null>(null);
  const [animKeys, setAnimKeys] = useState<Record<Category, number>>({ character: 0, incident: 0, constraint: 0 });
  const [oneLinerAnimKey, setOneLinerAnimKey] = useState(0);

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
  // --- THREE INDEPENDENT FETCH PIPELINES (one per Google Apps Script endpoint) ---
  useEffect(() => {
    let cancelled = false;

    const loadOne = async <T,>(
      SCRIPT_URL: string,
      label: string,
      keys: string[],
      apply: (rows: T[]) => void,
      done: () => void,
    ) => {
      try {
        const res = await fetch(`${SUPABASE_PROXY}?url=${encodeURIComponent(SCRIPT_URL)}`, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawData = await res.json();
        console.log("Data loaded for " + label + " (" + SCRIPT_URL + ")", rawData);

        // --- THE FIX ---
        // If rawData is already a flat array, use it directly! Otherwise, use extractArray fallback.
        const actualData = Array.isArray(rawData) ? rawData : (extractArray(rawData, keys) as T[]);

        console.log("Rows mapped for " + label, actualData);
        if (cancelled) return;
        if (actualData && actualData.length > 0) {
          apply(actualData);
        }
      } catch (err) {
        console.error("Fetch failed for " + label + " (" + SCRIPT_URL + "), using FALLBACK_SEEDS", err);
      } finally {
        if (!cancelled) done();
      }
    };

    loadOne<SandboxRow>(
      SANDBOX_SCRIPT_URL,
      "sandbox",
      ["sheet1", "sandboxPrompts", "sandbox"],
      (rows) => {
        setAllSandboxPrompts(rows);
        if (rows && rows.length > 0) {
          console.log("Raw character row sample:", rows[0]);
          const pick = () => rows[Math.floor(Math.random() * rows.length)];
          const c = pick();
          const i = pick();
          const k = pick();
          setCardRows({ character: c, incident: i, constraint: k });
          const cText = getFieldValue(c as unknown as Record<string, unknown>, "character");
          const iText = getFieldValue(i as unknown as Record<string, unknown>, "incident");
          const kText = getFieldValue(k as unknown as Record<string, unknown>, "constraint");
          setPrompts((p) => ({
            character: cText || p.character,
            incident: iText || p.incident,
            constraint: kText || p.constraint,
          }));
        }
      },
      () => setSandboxLoading(false),
    );

    loadOne<PromptRow>(
      ONELINERS_SCRIPT_URL,
      "oneLiners",
      ["sheet2", "oneLiners", "oneLinerPrompts"],
      (rows) => {
        setAllOneLiners(rows);
        if (rows && rows.length > 0) {
          setOneLinerRow(rows[Math.floor(Math.random() * rows.length)]);
        }
      },
      () => setOneLinersLoading(false),
    );

    loadOne<PromptRow>(
      SHEET3_SCRIPT_URL,
      "sheet3",
      ["sheet3", "sheet3", "sheet3"],
      (rows) => {
        setAllSheet3Prompts(rows);
        if (rows && rows.length > 0) {
          setSheet3Row(rows[Math.floor(Math.random() * rows.length)]);
        }
      },
      () => setSheet3Loading(false),
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // Seed voteCounts from Supabase 'votes' table so global tallies are visible
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("votes").select("sheet_key,row_id,element_box,up_count,down_count");
      if (cancelled || error || !data) return;
      const seeded: Record<string, { up: number; down: number }> = {};
      for (const r of data as Array<{
        sheet_key: string;
        row_id: string;
        element_box: string;
        up_count: number;
        down_count: number;
      }>) {
        seeded[`${r.sheet_key}:${r.row_id}:${r.element_box}`] = {
          up: r.up_count ?? 0,
          down: r.down_count ?? 0,
        };
      }
      setVoteCounts((prev) => ({ ...seeded, ...prev }));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist UI state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ prompts, structure, scratch }));
  }, [prompts, structure, scratch]);

  // --- Robust case-insensitive field lookup (handles "Character", "character ", "CHARACTER", etc.) ---
  const getFieldValue = (row: Record<string, unknown> | null | undefined, cat: Category): string => {
    if (!row) return "Loading character prompt...";
    const direct =
      (row as Record<string, unknown>)[cat] ??
      (row as Record<string, unknown>)[cat.charAt(0).toUpperCase() + cat.slice(1)];
    if (typeof direct === "string" && direct.trim()) return direct.trim();
    const matchKey = Object.keys(row).find((k) => k.toLowerCase().includes(cat));
    if (matchKey) {
      const v = (row as Record<string, unknown>)[matchKey];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    console.error("Available row keys:", Object.keys(row));
    return cat === "character" ? "Loading character prompt..." : "";
  };

  // --- Independent shuffle handlers ---
  const shuffleCard = (cat: Category) => {
    const row = pickRandom(allSandboxPrompts);
    if (!row) return;
    setCardRows((prev) => ({ ...prev, [cat]: row }));
    const text = getFieldValue(row as unknown as Record<string, unknown>, cat);
    setPrompts((p) => ({ ...p, [cat]: text || p[cat] }));
    setAnimKeys((prev) => ({ ...prev, [cat]: prev[cat] + 1 }));
  };

  const shuffleOneLiner = () => {
    const row = pickRandom(allOneLiners);
    if (!row) return;
    setOneLinerRow(row);
    setOneLinerAnimKey((k) => k + 1);
  };

  // --- Voting: instant local state update, then async Supabase upsert ---
  const handleVote = (
    sheetKey: SheetKey,
    id: string | number | undefined,
    elementBox: ElementBox,
    vote: "up" | "down",
  ) => {
    if (id === undefined || id === null || id === "") return;

    const storeKey = `${sheetKey}:${id}:${elementBox}`;
    const votes = readUserVotes();
    const current = votes[storeKey];

    // 1) SYNCHRONOUS state update first — never blocked by network
    let nextCounts = { up: 0, down: 0 };
    setVoteCounts((prev) => {
      const cur = prev[storeKey] ?? { up: 0, down: 0 };
      const next = { ...cur };
      if (current) next[current] = Math.max(0, next[current] - 1);
      if (current !== vote) next[vote] = next[vote] + 1;
      nextCounts = next;
      return { ...prev, [storeKey]: next };
    });

    // 2) localStorage immediately after
    if (current === vote) delete votes[storeKey];
    else votes[storeKey] = vote;
    localStorage.setItem("userVotes", JSON.stringify(votes));
    console.log("Calling increment_vote rpc:", { sheetKey, id, elementBox, vote, current });
    void (supabase.rpc as any)(
      "increment_vote",
      {
        p_sheet_key: sheetKey,
        p_row_id: String(id),
        p_element_box: elementBox,
        p_vote: current === vote ? `nullify_${vote}` : vote,
        p_previous: current ?? null,
      })
      .then(({ error }) => {
        if (error) console.warn("[StorySandbox] vote rpc failed", error);
      });
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
    const total = counts.up + counts.down;
    const hasAnyVotes = total > 0;
    const disabled = id === undefined || id === null || id === "";
    const userVotes = readUserVotes();
    const stored = Object.prototype.hasOwnProperty.call(userVotes, key) ? userVotes[key] : null;
    const userVote: "up" | "down" | null = stored === "up" || stored === "down" ? stored : null;
    return (
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                className="inline-flex items-center rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-40"
                aria-label={`${total} votes`}
              >
                {total} {total === 1 ? "vote" : "votes"}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">
                {counts.up} Up | {counts.down} Down
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleVote(sheetKey, id, box, "up")}
          className={cn(
            "inline-flex items-center gap-0.5 transition-colors disabled:opacity-40",
            userVote === "up" && counts.up > 0
              ? "text-green-600 font-bold"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Thumbs up"
        >
          <ThumbsUp className={cn("h-3.5 w-3.5", userVote === "up" && counts.up > 0 && "fill-green-600")} />
          <span>{counts.up}</span>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleVote(sheetKey, id, box, "down")}
          className={cn(
            "inline-flex items-center gap-0.5 transition-colors disabled:opacity-40",
            userVote === "down" && counts.down > 0
              ? "text-red-600 font-bold"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Thumbs down"
        >
          <ThumbsDown className={cn("h-3.5 w-3.5", userVote === "down" && counts.down > 0 && "fill-red-600")} />
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

    const additional = (scratch["sandbox:constraint"] ?? "").trim();
    lines.push("[ADDITIONAL]");
    lines.push(additional || "(Empty)");
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
        <p className="text-muted-foreground max-w-xl mx-auto whitespace-pre-line">
          Generate prompts, pick a structure, sketch a micro-story.{"\n"}
          You can vote up or down as you go.{"\n"}
          Save your story stores only on your computer locally. I don't save anything except the anonymous votes.
        </p>
      </header>

      {/* Prompt Generator (Sandbox / Sheet1) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Prompts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {CATEGORY_META.map(({ key, label, tone, box }) => {
            const value = prompts[key];
            const isEditing = editing === key;
            const isConstraint = key === "constraint";
            const showShuffle = key === "character" || key === "incident";
            return (
              <Card
                key={`${key}-${animKeys[key]}`}
                className={cn(
                  "relative p-4 min-h-[140px] h-full flex flex-col justify-between bg-gradient-to-br animate-fade-in-up border",
                  tone,
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    {showShuffle && (
                      <button
                        type="button"
                        onClick={() => shuffleCard(key)}
                        className="text-foreground hover:opacity-70 transition-opacity"
                        aria-label={`Shuffle ${label}`}
                      >
                        <Shuffle className="h-5 w-5" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>

                {isConstraint ? (
                  <textarea
                    value={scratch["sandbox:constraint"] ?? ""}
                    onChange={(e) => setScratch((prev) => ({ ...prev, "sandbox:constraint": e.target.value }))}
                    placeholder="Type your idea here…"
                    className="border-none focus:ring-0 focus:outline-none resize-none bg-transparent w-full flex-1 text-base font-medium leading-snug"
                  />
                ) : isEditing ? (
                  <div className="space-y-2">
                    <Input
                      autoFocus
                      value={value}
                      onChange={(e) => setPrompts((p) => ({ ...p, [key]: e.target.value }))}
                      onBlur={() => setEditing(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") setEditing(null);
                      }}
                      placeholder={`Your own ${label.toLowerCase()}…`}
                    />
                  </div>
                ) : sandboxLoading ? (
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <p className="text-base font-medium leading-snug">{value}</p>
                )}

                {!isConstraint && !sandboxLoading && (
                  <div className="mt-3 flex justify-end">
                    <VoteThumbs sheetKey="sandbox" id={cardRows[key]?.id} box={box} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* One-liner Prompt Generator (Sheet2) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">One size fits all prompts</h3>
          <Button variant="glass" size="sm" onClick={shuffleOneLiner} disabled={!allOneLiners.length}>
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
            className="text-base font-semibold px-6 py-5 text-white hover:opacity-90 mr-[8%]"
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
                onChange={(e) => setScratch((prev) => ({ ...prev, [`${structure}:notes`]: e.target.value }))}
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
                onChange={(e) => setScratch((prev) => ({ ...prev, [`${structure}:notes`]: e.target.value }))}
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
