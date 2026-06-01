import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Server, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const SUPABASE_URL = "https://mgujrwuiftjmgnwnlels.supabase.co";
const PROJECT_REF = "mgujrwuiftjmgnwnlels";

interface QueryResult {
  status: "idle" | "running" | "success" | "error";
  data?: unknown[];
  error?: string;
  count?: number;
  durationMs?: number;
}

export default function Diagnostics() {
  const [sessionsResult, setSessionsResult] = useState<QueryResult>({ status: "idle" });
  const [promptsResult, setPromptsResult] = useState<QueryResult>({ status: "idle" });
  const [votesResult, setVotesResult] = useState<QueryResult>({ status: "idle" });

  const runTestQuery = async (
    table: string,
    setter: React.Dispatch<React.SetStateAction<QueryResult>>
  ) => {
    setter({ status: "running" });
    const start = performance.now();
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select("*", { count: "exact", head: false })
        .limit(5);

      const duration = Math.round(performance.now() - start);

      if (error) {
        setter({ status: "error", error: error.message, durationMs: duration });
      } else {
        setter({
          status: "success",
          data: data || [],
          count: data?.length || 0,
          durationMs: duration,
        });
      }
    } catch (err: any) {
      setter({ status: "error", error: err?.message || "Unexpected error", durationMs: Math.round(performance.now() - start) });
    }
  };

  const runAll = () => {
    runTestQuery("storytelling_sessions", setSessionsResult);
    runTestQuery("prompts", setPromptsResult);
    runTestQuery("votes", setVotesResult);
  };

  useEffect(() => {
    runAll();
  }, []);

  const renderResult = (label: string, result: QueryResult) => {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              {label}
            </CardTitle>
            <Badge
              variant={
                result.status === "success"
                  ? "default"
                  : result.status === "error"
                  ? "destructive"
                  : "secondary"
              }
            >
              {result.status === "idle"
                ? "Idle"
                : result.status === "running"
                ? "Running..."
                : result.status === "success"
                ? "OK"
                : "Error"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {result.status === "running" && (
            <p className="text-muted-foreground animate-pulse">Querying…</p>
          )}
          {result.status === "error" && (
            <div className="flex items-start gap-2 text-destructive">
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="break-words">{result.error}</span>
            </div>
          )}
          {result.status === "success" && (
            <>
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{result.count} rows returned</span>
              </div>
              {result.durationMs !== undefined && (
                <p className="text-muted-foreground">Latency: {result.durationMs}ms</p>
              )}
              {result.data && result.data.length > 0 && (
                <pre className="mt-3 max-h-60 overflow-auto rounded bg-muted p-3 text-xs text-foreground">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Diagnostics</h1>
            <Button variant="outline" size="sm" onClick={runAll} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Re-run Tests
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                Active Supabase Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Project Ref</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{PROJECT_REF}</code>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">URL</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{SUPABASE_URL}</code>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Connected
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderResult("storytelling_sessions", sessionsResult)}
            {renderResult("prompts", promptsResult)}
            {renderResult("votes", votesResult)}
          </div>

          {(sessionsResult.status === "error" ||
            promptsResult.status === "error" ||
            votesResult.status === "error") && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">One or more queries failed.</p>
                <p className="text-muted-foreground mt-1">
                  Check the cards above for details. Common causes: missing RLS grants, wrong table name, or network issues.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
