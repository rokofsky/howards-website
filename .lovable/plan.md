

# Update footer: admin links + "Howard" links to Bio

## Changes in `src/components/Footer.tsx`

1. **"Howard" link** → links to `/bio` ("Who is Howard") instead of `/admin/sessions`
2. **Add two admin links** below the footer description paragraph:
   - "Manage Storytelling" → `/admin/sessions`
   - "Manage Webinars" → `/admin/webinars`
3. **Make admin links invisible** to regular visitors: styled with near-zero opacity (`text-primary-foreground/[0.08]`) and no hover change — effectively invisible unless you know where to look
4. **Password protected** — both admin pages already require a password to access. The admin session will persist (using `sessionStorage`) until you explicitly log out or restart your computer/close all browser tabs.

### File changed
- `src/components/Footer.tsx`

