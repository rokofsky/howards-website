## Plan

1. **Make editing obvious in the admin UI**
   - In `src/pages/RokofAdmin.tsx`, replace the icon-only prompt edit control with a clearly labeled **Edit** button next to **Delete**.
   - Keep the existing edit dialog, but ensure it opens reliably for each prompt row.

2. **Improve prompt save behavior**
   - Keep edits local while the dialog is open.
   - On save, optimistically update the displayed prompt after a successful database response so the change is immediately visible.
   - Show a clear error toast if saving fails.

3. **Fix the real CRUD blocker**
   - The database currently only allows reading `prompts`; INSERT/UPDATE/DELETE are blocked by row-level permissions.
   - Add policies/grants so logged-in/admin-authenticated users can create, update, and delete prompts.

4. **Validate**
   - Confirm the edit button is visible in the Manage Prompts section.
   - Confirm the edit dialog saves updates without permission errors.