Remove the "Showing X of Y evaluations" / "Zobrazeno X z Y hodnocení" counter line from `src/components/EvaluationsGallery.tsx` (lines 426–433).

Keep the empty-state message ("No evaluations match your search." / "Žádné formuláře neodpovídají vyhledávání.") so users still get feedback when a search returns nothing — render it as the same `<p>` only when `filtered.length === 0`.

No other changes.