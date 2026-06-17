import { useEffect, useMemo, useRef, useState } from "react";
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

/* ============================================================
   FALLBACK SEED VOCABULARY (used if remote fetch fails)
   ============================================================ */
const FALLBACK_SEEDS = {
  character: ["A retired astronaut"],
  incident: [],
  constraint: ["while pretending everything is fine"],
  setting: [],
} as const;

const FALLBACK_ONE_LINERS = ["A character lies to protect someone — show the cost."];

const FALLBACK_SHEET3 = ["The weather suddenty changes."];

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
      { key: "intro", title: "1. Introduction", hint: "Set the world and the hero." },
      { key: "escalation", title: "2. Escalation", hint: "Rising stakes, obstacles, allies." },
      { key: "denouement", title: "3. Denouement", hint: "Climax and turning point." },
      { key: "resolution", title: "4. Resolution", hint: "What changed? What's the lesson?" },
    ],
  },
} as const;

type StructureKey = keyof typeof STRUCTURES;
const STORAGE_KEY = "story-sandbox:v1";

type Category = "character" | "incident" | "constraint";
type Prompts = Record<Category, string>;

const CATEGORY_META: { key: Category; label: string; tone: string; box: ElementBox }[] = [
  { key: "character", label: "Character", tone: "from-primary/20 to-primary/5 border-primary/30", box: "character" },
  { key: "incident", label: "By the way", tone: "from-primary/20 to-primary/5 border-primary/30", box: "incident" },
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

// Fisher-Yates shuffle — returns a new shuffled copy
const fisherYates = <T,>(input: T[]): T[] => {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

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
    constraint: null,
  });
  const [oneLinerRow, setOneLinerRow] = useState<PromptRow | null>(null);

  const [prompts, setPrompts] = useState<Prompts>(() => ({
    character: initialSandbox[0]?.character ?? "",
    incident: initialSandbox[0]?.incident ?? "",
    constraint: "",
  }));
  const [editing, setEditing] = useState<Category | null>(null);
  const [animKeys, setAnimKeys] = useState<Record<Category, number>>({ character: 0, incident: 0, constraint: 0 });
  const [oneLinerAnimKey, setOneLinerAnimKey] = useState(0);

  const [structure, setStructure] = useState<StructureKey>("3-act");
  const [scratch, setScratch] = useState<Record<string, string>>({});
  const prevPrompts = useRef<Partial<Record<Category, { row: SandboxRow; text: string }>>>({});
  const [hasPrev, setHasPrev] = useState<Record<Category, boolean>>({
    character: false,
    incident: false,
    constraint: false,
  });

  // --- Per-box vote counts: key = `${sheetKey}:${id}:${box}` ---
  const [voteCounts, setVoteCounts] = useState<Record<string, { up: number; down: number }>>({});

  // --- Admin inline editing ---
  const [isAdmin, setIsAdmin] = useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("admin_authenticated") === "true",
  );
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [addingNew, setAddingNew] = useState<Record<string, boolean>>({});
  const [savingField, setSavingField] = useState<Record<string, boolean>>({});

  const PLACEHOLDER_CHAR = "[Pending Admin Character]";
  const PLACEHOLDER_INC = "[Pending Admin Incident]";

  const isRowValidFor = (row: SandboxRow | PromptRow | null | undefined, cat: string): boolean => {
    if (!row) return false;
    const v = getFieldValue(row as unknown as Record<string, unknown>, cat).trim();
    if (!v) return false;
    if (v === PLACEHOLDER_CHAR || v === PLACEHOLDER_INC) return false;
    return true;
  };

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
  // --- Fetch all prompts from Supabase, grouped by sheet_key ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("prompts").select("*");
      if (cancelled) return;
      if (error) {
        console.error("Failed to load prompts from Supabase, using fallbacks", error);
      } else if (data) {
        const sandboxRows = data.filter((r) => r.sheet_key === "sandbox") as unknown as SandboxRow[];
        const oneLinerRows = data.filter((r) => r.sheet_key === "oneLiners") as unknown as PromptRow[];
        const sheet3Rows = data.filter((r) => r.sheet_key === "sheet3") as unknown as PromptRow[];

        if (sandboxRows.length > 0) {
          setAllSandboxPrompts(sandboxRows);
          const pickFor = (cat: Category) => {
            let row = sandboxRows[Math.floor(Math.random() * sandboxRows.length)];
            if (!isAdmin) {
              let tries = 0;
              while (row && !isRowValidFor(row, cat) && tries < 50) {
                row = sandboxRows[Math.floor(Math.random() * sandboxRows.length)];
                tries++;
              }
            }
            return row;
          };
          const c = pickFor("character");
          const i = pickFor("incident");
          setCardRows({ character: c, incident: i, constraint: undefined });
          setPrompts((p) => ({
            character: getFieldValue(c as unknown as Record<string, unknown>, "character") || p.character,
            incident: getFieldValue(i as unknown as Record<string, unknown>, "incident") || p.incident,
            constraint: p.constraint,
          }));
        }
        if (oneLinerRows.length > 0) {
          setAllOneLiners(oneLinerRows);
          let pick = oneLinerRows[Math.floor(Math.random() * oneLinerRows.length)];
          if (!isAdmin) {
            let tries = 0;
            while (pick && !isRowValidFor(pick, "oneLiners") && tries < 50) {
              pick = oneLinerRows[Math.floor(Math.random() * oneLinerRows.length)];
              tries++;
            }
          }
          setOneLinerRow(pick);
        }

        if (sheet3Rows.length > 0) {
          setAllSheet3Prompts(sheet3Rows);
          setSheet3Row(sheet3Rows[Math.floor(Math.random() * sheet3Rows.length)]);
        }
      }
      setSandboxLoading(false);
      setOneLinersLoading(false);
      setSheet3Loading(false);
    })();
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

  // --- Strict field lookup matching exact Supabase column names ---
  const getFieldValue = (row: Record<string, unknown> | null | undefined, cat: string): string => {
    if (!row) return "";
    let col: string | null = null;
    switch (cat) {
      case "character":
        col = "character";
        break;
      case "incident":
        col = "incident";
        break;
      case "constraint":
        col = "constraint_text";
        break;
      case "oneLiners":
      case "generic":
        col = "one_liner";
        break;
      case "sheet3":
      case "text":
        col = "text";
        break;
      default:
        return "";
    }
    const v = (row as Record<string, unknown>)[col];
    if (typeof v === "string" && v.trim()) return v.trim();
    return "";
  };

  // --- Independent shuffle handlers ---
  const undoShuffle = (cat: Category) => {
    const prev = prevPrompts.current[cat];
    if (!prev) return;
    setCardRows((p) => ({ ...p, [cat]: prev.row }));
    setPrompts((p) => ({ ...p, [cat]: prev.text }));
    setAnimKeys((k) => ({ ...k, [cat]: k[cat] + 1 }));
    delete prevPrompts.current[cat];
    setHasPrev((p) => ({ ...p, [cat]: false }));
  };

  // --- Shuffled queues (Fisher-Yates playlist style) ---
  // Stores indices into the source pool, plus the current pointer.
  type QueueState = { indices: number[]; idx: number; lastId: string | number | null };
  const characterQueueRef = useRef<QueueState>({ indices: [], idx: 0, lastId: null });
  const incidentQueueRef = useRef<QueueState>({ indices: [], idx: 0, lastId: null });
  const oneLinerQueueRef = useRef<QueueState>({ indices: [], idx: 0, lastId: null });

  const queueRefForCat = (cat: Category) =>
    cat === "character" ? characterQueueRef : cat === "incident" ? incidentQueueRef : characterQueueRef;

  // Build a Fisher-Yates queue of valid indices for the given pool/category.
  // Ensures the first item is not the same as `lastId` (no consecutive dup) when possible.
  const buildQueue = (pool: Array<SandboxRow | PromptRow>, cat: string, lastId: string | number | null): number[] => {
    const valid: number[] = [];
    for (let i = 0; i < pool.length; i++) {
      if (isAdmin || isRowValidFor(pool[i], cat)) valid.push(i);
    }
    if (valid.length === 0) return [];
    const shuffled = fisherYates(valid);
    if (shuffled.length > 1 && lastId != null && pool[shuffled[0]]?.id === lastId) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
  };

  // Reset queues whenever the underlying pools change.
  useEffect(() => {
    characterQueueRef.current = { indices: [], idx: 0, lastId: characterQueueRef.current.lastId };
    incidentQueueRef.current = { indices: [], idx: 0, lastId: incidentQueueRef.current.lastId };
  }, [allSandboxPrompts]);
  useEffect(() => {
    oneLinerQueueRef.current = { indices: [], idx: 0, lastId: oneLinerQueueRef.current.lastId };
  }, [allOneLiners]);

  const shuffleCard = (cat: Category, poolOverride?: SandboxRow[]) => {
    const pool = poolOverride ?? allSandboxPrompts;
    if (!pool.length) return;
    const qRef = queueRefForCat(cat);
    let q = qRef.current;
    // (Re)build queue if empty, exhausted, or pool override provided
    if (poolOverride || q.indices.length === 0 || q.idx >= q.indices.length) {
      const indices = buildQueue(pool, cat, q.lastId);
      if (indices.length === 0) return;
      q = { indices, idx: 0, lastId: q.lastId };
    }
    const rowIdx = q.indices[q.idx];
    const row = pool[rowIdx];
    if (!row) return;
    qRef.current = { indices: q.indices, idx: q.idx + 1, lastId: row.id ?? null };

    prevPrompts.current[cat] = { row: cardRows[cat]!, text: prompts[cat] };
    setHasPrev((p) => ({ ...p, [cat]: true }));
    setCardRows((prev) => ({ ...prev, [cat]: row }));
    const text = getFieldValue(row as unknown as Record<string, unknown>, cat);
    setPrompts((p) => ({ ...p, [cat]: text || p[cat] }));
    setAnimKeys((prev) => ({ ...prev, [cat]: prev[cat] + 1 }));
    setDrafts((d) => {
      const n = { ...d };
      delete n[cat];
      return n;
    });
    setAddingNew((a) => ({ ...a, [cat]: false }));
  };

  const shuffleOneLiner = (poolOverride?: PromptRow[]) => {
    const pool = poolOverride ?? allOneLiners;
    if (!pool.length) return;
    let q = oneLinerQueueRef.current;
    if (poolOverride || q.indices.length === 0 || q.idx >= q.indices.length) {
      const indices = buildQueue(pool, "oneLiners", q.lastId);
      if (indices.length === 0) return;
      q = { indices, idx: 0, lastId: q.lastId };
    }
    const row = pool[q.indices[q.idx]];
    if (!row) return;
    oneLinerQueueRef.current = { indices: q.indices, idx: q.idx + 1, lastId: row.id ?? null };

    setOneLinerRow(row);
    setOneLinerAnimKey((k) => k + 1);
    setDrafts((d) => {
      const n = { ...d };
      delete n.oneLiner;
      return n;
    });
    setAddingNew((a) => ({ ...a, oneLiner: false }));
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

    void supabase
      .rpc("increment_vote", {
        p_sheet_key: sheetKey,
        p_row_id: String(id),
        p_element_box: elementBox,
        p_vote: current === vote ? (vote === "up" ? "nullify_up" : "nullify_down") : vote,
        p_previous: current ?? "",
      })
      .then(() => {
        supabase
          .from("votes")
          .select("*")
          .then(({ data }) => {
            if (!data) return;
            const counts: Record<string, { up: number; down: number }> = {};
            data.forEach((row) => {
              const key = `${row.sheet_key}:${row.row_id}:${row.element_box}`;
              counts[key] = { up: row.up_count, down: row.down_count };
            });
            setVoteCounts(counts);
          });
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

  const oneLinerText = getFieldValue(oneLinerRow as unknown as Record<string, unknown>, "oneLiners");

  // --- Admin helpers ---
  const COLUMN_FOR: Record<string, string> = {
    character: "character",
    incident: "incident",
    oneLiner: "one_liner",
  };

  const currentValueFor = (slot: "character" | "incident" | "oneLiner"): string => {
    if (slot === "oneLiner") return oneLinerText;
    return prompts[slot];
  };

  const draftValueFor = (slot: "character" | "incident" | "oneLiner"): string => {
    if (addingNew[slot]) return drafts[slot] ?? "";
    return drafts[slot] !== undefined ? drafts[slot] : currentValueFor(slot);
  };

  const isDirty = (slot: "character" | "incident" | "oneLiner"): boolean => {
    if (addingNew[slot]) return (drafts[slot] ?? "").trim().length > 0;
    return drafts[slot] !== undefined && drafts[slot] !== currentValueFor(slot);
  };

  const saveField = async (slot: "character" | "incident" | "oneLiner") => {
    const value = (drafts[slot] ?? "").trim();
    if (!value) return;
    setSavingField((s) => ({ ...s, [slot]: true }));
    const col = COLUMN_FOR[slot];
    try {
      const adminToken = localStorage.getItem("admin_session_token") ?? "";
      if (addingNew[slot]) {
        let insertPayload: Record<string, unknown>;
        if (slot === "character") {
          insertPayload = { sheet_key: "sandbox", character: value, incident: PLACEHOLDER_INC };
        } else if (slot === "incident") {
          insertPayload = { sheet_key: "sandbox", incident: value, character: PLACEHOLDER_CHAR };
        } else {
          insertPayload = { sheet_key: "oneLiners", one_liner: value };
        }
        const insertRes = await fetch(`https://mgujrwuiftjmgnwnlels.supabase.co/functions/v1/manage-prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "insert", prompt: insertPayload, token: adminToken }),
        });
        const insertJson = await insertRes.json();
        if (!insertRes.ok || insertJson.error) {
          console.error("Insert failed", insertJson.error);
          return;
        }
        const data = insertJson.data;
        const error = null;
        if (error) {
          console.error("Insert failed", error);
          return;
        }
        if (slot === "oneLiner") {
          const newRow = data as unknown as PromptRow;
          setAllOneLiners((prev) => [...prev, newRow]);
          setOneLinerRow(newRow);
          setOneLinerAnimKey((k) => k + 1);
        } else {
          const newRow = data as unknown as SandboxRow;
          setAllSandboxPrompts((prev) => [...prev, newRow]);
          setCardRows((prev) => ({ ...prev, [slot]: newRow }));
          setPrompts((p) => ({ ...p, [slot]: value }));
          setAnimKeys((prev) => ({ ...prev, [slot]: prev[slot] + 1 }));
        }
        setAddingNew((a) => ({ ...a, [slot]: false }));
      } else {
        const rowId = slot === "oneLiner" ? oneLinerRow?.id : cardRows[slot as Category]?.id;
        if (!rowId) return;
        const updateRes = await fetch(`https://mgujrwuiftjmgnwnlels.supabase.co/functions/v1/manage-prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update", prompt: { id: rowId, [col]: value }, token: adminToken }),
        });
        const updateJson = await updateRes.json();
        if (!updateRes.ok || updateJson.error) {
          console.error("Update failed", updateJson.error);
          return;
        }
        if (slot === "oneLiner") {
          setOneLinerRow((prev) => (prev ? ({ ...prev, [col]: value } as PromptRow) : prev));
          setAllOneLiners((prev) => prev.map((r) => (r.id === rowId ? ({ ...r, [col]: value } as PromptRow) : r)));
        } else {
          setCardRows((prev) => ({
            ...prev,
            [slot]: prev[slot as Category]
              ? ({ ...(prev[slot as Category] as SandboxRow), [col]: value } as SandboxRow)
              : prev[slot as Category],
          }));
          setAllSandboxPrompts((prev) =>
            prev.map((r) => (r.id === rowId ? ({ ...r, [col]: value } as SandboxRow) : r)),
          );
          setPrompts((p) => ({ ...p, [slot]: value }));
        }
      }
      setDrafts((d) => {
        const n = { ...d };
        delete n[slot];
        return n;
      });
    } finally {
      setSavingField((s) => ({ ...s, [slot]: false }));
    }
  };

  const deleteCurrent = async (slot: "character" | "incident" | "oneLiner") => {
    if (!window.confirm("Go ahead dude, delete it")) return;
    const rowId = slot === "oneLiner" ? oneLinerRow?.id : cardRows[slot as Category]?.id;
    if (!rowId) return;
    const { error } = await supabase.from("prompts").delete().eq("id", String(rowId));
    if (error) {
      console.error("Delete failed", error);
      return;
    }
    if (slot === "oneLiner") {
      const remaining = allOneLiners.filter((r) => r.id !== rowId);
      setAllOneLiners(remaining);
      shuffleOneLiner(remaining);
    } else {
      const remaining = allSandboxPrompts.filter((r) => r.id !== rowId);
      setAllSandboxPrompts(remaining);
      shuffleCard(slot as Category, remaining);
    }
  };

  const startAddNew = (slot: "character" | "incident" | "oneLiner") => {
    setAddingNew((a) => ({ ...a, [slot]: true }));
    setDrafts((d) => ({ ...d, [slot]: "" }));
  };

  const cancelAddNew = (slot: "character" | "incident" | "oneLiner") => {
    setAddingNew((a) => ({ ...a, [slot]: false }));
    setDrafts((d) => {
      const n = { ...d };
      delete n[slot];
      return n;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">Story Sandbox</h2>
        <p className="text-muted-foreground max-w-xl mx-auto whitespace-pre-line">
          Create your own story! Shuffle the prompts to find one you want, or scroll below and pick a structure and fill
          in the boxes - it's as easy as that.{"\n"}
          You can vote up👍 or down👎 as you shuffle.{"\n"}
          Save your story on your computer. I don't keep any data except the anonymous votes.
        </p>
      </header>

      {/* Prompt Generator (Sandbox / Sheet1) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              <span className="inline-block w-[280px]">{/* ADJUST WIDTH HERE TO ALIGN HINTS */}Prompts</span>
            </h3>
            <span className="text-lg font-semibold flex items-center gap-1">
              <Shuffle className="w-4 h-4" style={{ pointerEvents: "none" }} />
              Shuffle to the next card
            </span>
          </div>
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
                    {showShuffle && hasPrev[key as Category] && (
                      <button
                        type="button"
                        onClick={() => undoShuffle(key as Category)}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                      >
                        ↩
                      </button>
                    )}
                  </div>
                </div>

                {isConstraint ? (
                  <textarea
                    value={scratch["sandbox:constraint"] ?? ""}
                    onChange={(e) => setScratch((prev) => ({ ...prev, "sandbox:constraint": e.target.value }))}
                    onFocus={(e) => {
                      const target = e.target;
                      setTimeout(() => {
                        target.scrollIntoView({ behavior: "smooth", block: "center" });
                      }, 300);
                    }}
                    placeholder="Whatever tickles your fancy…"
                    className="border-none focus:ring-0 focus:outline-none resize-none bg-transparent w-full flex-1 text-base font-medium leading-snug"
                  />
                ) : isAdmin ? (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={draftValueFor(key as "character" | "incident")}
                      onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                      placeholder={addingNew[key] ? `New ${label.toLowerCase()}…` : `Edit ${label.toLowerCase()}…`}
                      className="border-none focus:ring-0 focus:outline-none resize-none bg-transparent w-full flex-1 text-base font-medium leading-snug p-0"
                      rows={3}
                    />
                    {isDirty(key as "character" | "incident") && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => saveField(key as "character" | "incident")}
                          disabled={savingField[key]}
                          className="text-sm text-primary hover:underline disabled:opacity-50"
                        >
                          {savingField[key] ? "Saving…" : "Save"}
                        </button>
                        {addingNew[key] && (
                          <button
                            onClick={() => cancelAddNew(key as "character" | "incident")}
                            className="text-sm text-muted-foreground hover:underline ml-2"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
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
                ) : value && value.trim() ? (
                  <p className="text-base font-medium leading-snug">{value}</p>
                ) : (
                  <p className="text-base italic text-muted-foreground leading-snug">Coming soon</p>
                )}

                {!isConstraint && !sandboxLoading && (
                  <div className="mt-3 flex items-center justify-between gap-2">
                    {isAdmin ? (
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => startAddNew(key as "character" | "incident")}
                          className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                        >
                          Add new
                        </button>
                        {!addingNew[key] && cardRows[key]?.id && (
                          <button
                            type="button"
                            onClick={() => deleteCurrent(key as "character" | "incident")}
                            className="text-muted-foreground hover:text-destructive underline underline-offset-2"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ) : (
                      <span />
                    )}
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
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              <span className="inline-block w-[280px]">
                {/* ADJUST WIDTH HERE TO ALIGN HINTS */}One size fits all prompts
              </span>
            </h3>
            <span className="text-lg font-semibold flex items-center gap-1">
              <Shuffle className="w-4 h-4" style={{ pointerEvents: "none" }} />
              Shuffle to the next card
            </span>
          </div>
        </div>
        <Card
          key={`oneliner-${oneLinerAnimKey}`}
          className="relative p-4 min-h-[140px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 animate-fade-in-up"
        >
          {oneLinersLoading ? (
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          ) : isAdmin ? (
            <div className="w-full flex flex-col items-center gap-2">
              <textarea
                value={draftValueFor("oneLiner")}
                onChange={(e) => setDrafts((d) => ({ ...d, oneLiner: e.target.value }))}
                placeholder={addingNew.oneLiner ? "New one-liner…" : "Edit one-liner…"}
                className="border-none focus:ring-0 focus:outline-none resize-none bg-transparent w-full text-base md:text-lg font-medium text-center leading-snug p-0"
                rows={2}
              />
              {isDirty("oneLiner") && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => saveField("oneLiner")}
                    disabled={savingField.oneLiner}
                    className="text-sm text-primary hover:underline disabled:opacity-50"
                  >
                    {savingField.oneLiner ? "Saving…" : "Save"}
                  </button>
                  {addingNew.oneLiner && (
                    <button
                      onClick={() => cancelAddNew("oneLiner")}
                      className="text-sm text-muted-foreground hover:underline ml-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : oneLinerText ? (
            <p className="text-base md:text-lg font-medium text-center leading-snug">{oneLinerText}</p>
          ) : (
            <p className="text-base md:text-lg italic text-muted-foreground text-center leading-snug">Coming soon</p>
          )}
          <div className="flex items-center justify-center w-full gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => startAddNew("oneLiner")}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Add new
                </button>
                {!addingNew.oneLiner && oneLinerRow?.id && (
                  <button
                    type="button"
                    onClick={() => deleteCurrent("oneLiner")}
                    className="text-muted-foreground hover:text-destructive underline underline-offset-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2 mx-auto">
              <button
                type="button"
                onClick={() => shuffleOneLiner()}
                disabled={!allOneLiners.length}
                className="text-foreground hover:opacity-70 transition-opacity"
                aria-label="Shuffle one-liner"
              >
                <Shuffle className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <VoteThumbs sheetKey="oneLiners" id={oneLinerRow?.id} box="generic" />
            </div>
          </div>
        </Card>
      </section>

      {/* Structure Selector + Save Story (aligned horizontally) */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Choose from two structures:</h3>

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
        <h3 className="text-lg font-semibold">Scratchpad - fill in the main plot points below:</h3>
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
