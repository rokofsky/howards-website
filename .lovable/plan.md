

# Add service name to copy email

## Changes (one file: `supabase/functions/send-contact-email/index.ts`)

### 1. Subject line includes service
Change line 135 from:
```
"Copy of your message to Howard Rokofsky"
```
to:
```
`Copy of your message to Howard about ${data.service}`
```

### 2. Show service in copy email body
In `copyHtml()`, add a line after the greeting (line 56) showing the service:
```html
<p style="..."><strong>Re: {service}</strong></p>
```

Two small edits in one file. Redeploy of the edge function.

