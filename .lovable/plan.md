

# Fix: Edge function boot error preventing emails

## Problem
The `send-contact-email` edge function crashes on startup because line 1 imports from a non-existent path:
```
import { corsHeaders } from "npm:@supabase/supabase-js@2.49.4/cors";
```
The edge runtime cannot resolve this module, so every call returns a 503 BOOT_ERROR. No emails are sent.

## Fix
Replace the broken import with manually defined CORS headers (the standard approach for older Supabase SDK versions):

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

One line changed in `supabase/functions/send-contact-email/index.ts`. Then redeploy the function.

