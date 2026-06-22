# Baby Registry (Next.js)

A gift registry where guests pick an item and choose to give the **full**, **75%**, **half**, or **quarter** price. Every reservation is saved with the guest's name, phone, item, and amount, viewable by you at `/admin`.

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
```
Production:
```bash
npm run build && npm run start
```

## Your private admin dashboard
- `/admin` — your view of who picked what, with a **Download CSV** button.

**It's password protected.** Only someone who knows your password can open it. Anyone else who visits `/admin` just sees a login box and never the data. The reservation data API and CSV export are locked too, so the info can't be reached by guessing URLs either.

### Set your password
Open the file `.env.local` in the project and change this line to your own secret:
```
ADMIN_PASSWORD=changeme
```
Save it and restart the app. That's the only place the password lives — it's never in the public code. When you deploy online, set `ADMIN_PASSWORD` as an environment variable in your host's dashboard (e.g. Vercel → Settings → Environment Variables) instead of the file.

To sign out, use the **Log out** button on the dashboard.

## Where the data lives — Google Sheets
Every reservation is saved as a row in a Google Sheet you own, and your `/admin` page reads from that same sheet. This works on Vercel (no file storage needed).

### Connect Google Sheets (one-time, ~5 minutes)
1. Create a new Google Sheet (sheets.new). This is where reservations will appear.
2. In the sheet, open **Extensions ▸ Apps Script**.
3. Delete whatever code is there, and paste in the contents of **`google-apps-script.gs`** (included in this project).
4. Near the top of that script, change `SECRET` from the placeholder to your own private string (any random text). Remember it.
5. Click **Deploy ▸ New deployment**. For type choose **Web app**. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
   Click **Deploy**, approve the permissions prompt, and copy the **Web app URL** it gives you (ends in `/exec`).
6. Put these two values in your environment:
   - `SHEETS_WEBHOOK_URL` = the Web app URL you copied
   - `SHEETS_SECRET` = the exact same `SECRET` string from step 4

Locally that goes in `.env.local`. On Vercel, add both under **Project ▸ Settings ▸ Environment Variables**, then redeploy.

That's it. New reservations append to a "Reservations" tab in your sheet automatically. You can read them right in Google Sheets, or in the app's `/admin` page.

> If you ever change the script, you must **Deploy ▸ Manage deployments ▸ Edit ▸ redeploy** for the change to take effect.

## Swap in real photos
The item images are in `public/items/*.svg` and the hero baby is `public/baby.svg`. Replace any of them with your own `.jpg`/`.png`, then update the `img` path for that item in `app/items.js`. Example: drop `public/items/bassinet.jpg` and set `img: "/items/bassinet.jpg"`.

## Edit items / prices
All items, prices, and the four contribution tiers live in `app/items.js`.

