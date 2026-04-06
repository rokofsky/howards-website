

# Add First Storytelling Session

Insert one row into the `storytelling_sessions` table with the user's provided details.

## Data to insert

| Field | Value |
|-------|-------|
| title | Storytelling |
| description | A round of stories from you and the others with or without feedback! |
| session_date | 2026-04-10 17:30:00+01 (18:30 CET = 17:30 UTC) |
| zoom_link | https://us06web.zoom.us/j/84146763709?pwd=hvMxaUe76a99YRPZQLxFXyoyx6jKRC.1 |
| zoom_meeting_id | 84146763709 |

## Time display note
The card already uses `date-fns` `format()` which renders in the user's local timezone automatically. To also show "CET" as a hint, I'll add a small "(CET)" label next to the time on the card.

## Steps
1. Insert the session row using the database insert tool
2. Update `StorytellingWorkshops.tsx` to append "(CET)" next to the displayed time

