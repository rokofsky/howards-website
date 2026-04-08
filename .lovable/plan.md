

# Webinar grid: always 3 columns

## Current state
The webinar list on the Online Webinars service page (`src/pages/ServiceDetail.tsx`, line 129) uses:
```
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
```
This means 1 column on phones, 2 on tablets, 3 on desktop.

## Change
Update to **3 columns at all sizes**, with compact cards on mobile — same approach as the services grid:

### File: `src/pages/ServiceDetail.tsx`
- Change grid classes from `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` to `grid-cols-3 gap-2 md:gap-4`
- Make card padding responsive: `p-2 md:p-5`
- Make title smaller on mobile: `text-xs md:text-base`
- Hide description on mobile (not enough space): `hidden md:block`
- Make the "Inquire" button smaller on mobile: `text-xs md:text-sm`

One file, responsive class changes only.

