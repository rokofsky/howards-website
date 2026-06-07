The prompt edit UI was added to `src/pages/RokofAdmin.tsx`, which only renders on `/rokofsky-admin` — not on `/story-sandbox` where you are currently. Nothing is broken in code; you just need to open the admin route.

To confirm and remove the confusion, the plan:

1. Open `/rokofsky-admin` (or `/cz/rokofsky-admin`), log in with the admin password, scroll to the "Manage Prompts" section — the Edit/Delete buttons are already there on each row.
2. To make the section easier to find, move "Manage Prompts" above "Manage Blog Posts" in `src/pages/RokofAdmin.tsx` so it is the first content block after the header.
3. No changes to `StorySandbox` and no other files touched.

If you instead want editing surfaced inside the Story Sandbox page itself (gated by admin login), say the word and I’ll plan that instead.