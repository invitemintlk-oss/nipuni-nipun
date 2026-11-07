# Connect RSVP & Wishes to Google Sheets

Sheet: https://docs.google.com/spreadsheets/d/1BkEj4knXmH_H2v_ca9XjGOIW0HTztQRm3Ie8G9lQVYA/edit

## 1. Add the script
1. Open the sheet above (signed in as the sheet owner).
2. **Extensions ▸ Apps Script**.
3. Delete everything in `Code.gs` and paste the full contents of `google-apps-script/code.gs`.
4. Click **Save**.

## 2. Create the tabs (one time)
1. In the function dropdown at the top, choose **setup**, then click **Run**.
2. Approve the permission prompt (Advanced ▸ Go to project ▸ Allow).
3. The sheet now has two tabs with headers:
   - **RSVP**: Timestamp, Full Name, Guests, Dietary Notes, Event, Language
   - **WISH**: Timestamp, Name, Message, Event, Language, Show

## 3. Deploy as a web app
1. **Deploy ▸ New deployment** ▸ gear icon ▸ **Web app**.
2. Execute as: **Me**.
3. Who has access: **Anyone**.
4. **Deploy**, then copy the **Web app URL** (ends in `/exec`).
5. Open the URL in a browser. You should see
   `{"ok":true,"message":"Nipuni & Nipun wedding endpoint is running."}`

## 4. Put the URL in the site
Either:
- paste it into `src/config.ts` → `const PASTED_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';`
- or set `VITE_GOOGLE_APPS_SCRIPT_URL=<url>` in `.env` / your hosting's environment variables.

Then rebuild / redeploy the site.

## Managing wishes
Every wish appears on the site while its **Show** cell is `YES`. Change it to `NO` to hide a wish.

## Updating the script later
After editing the script, use **Deploy ▸ Manage deployments ▸ Edit ▸ Version: New version ▸ Deploy**.
That keeps the same URL. A *New deployment* would give you a different URL.
