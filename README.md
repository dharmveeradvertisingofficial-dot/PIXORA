# PIXORA — multi-page creative marketplace

Theme: warm cream `#FFF8E1`, charcoal and gold. Google/email authentication remains configured in `account.html`.

## Files and active behavior
- Multi-page navigation and top-right Plans link; Plans has been removed from the left sidebar.
- Account menu: Get a Plan, Settings, My Collections, Log in / Sign up, and Log out.
- The creator page has a real authenticated upload form using Supabase Storage and a `designs` table.
- `PIXORA-SUPABASE-SETUP.sql` sets up the table, private bucket, and owner-only row/storage policies.

## One-time Supabase step for uploads
1. Open Supabase Dashboard for the existing PIXORA project.
2. Open **SQL Editor**, create a query, paste all of `PIXORA-SUPABASE-SETUP.sql`, and run it.
3. Check **Storage** and confirm the private `design-files` bucket exists.
4. Test upload after signing in through Google.

The upload form supports files up to 25 MB. Supabase policies make each creator's uploaded files private to that creator. Do not expose service-role keys or OAuth client secrets in public files.

## Important limitations
This repository is a static GitHub Pages site. The UI alone cannot safely activate paid checkout, payment-verified downloads, public creator feeds, follow/follower relationships, or persistent saved collections. Those need additional database tables, access policies, and a payment provider/server-side verification (never trust a browser-only payment success flag). The plans page remains a clearly labeled starter/demo until a payment provider is configured. Apple sign-in also requires Apple provider setup in Supabase.

## Publish
Upload the extracted project contents to the root of your GitHub repository and keep the `assets` folder. In GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

Never put admin passwords, Supabase service-role keys, or payment secrets in public frontend files.
