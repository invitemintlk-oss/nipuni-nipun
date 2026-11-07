/**
 * Google Apps Script web-app URL that saves RSVPs and wishes to the
 * Nipuni & Nipun Google Sheet. See google-apps-script/SETUP.md.
 *
 * Paste the "/exec" URL from Deploy ▸ New deployment below, or set
 * VITE_GOOGLE_APPS_SCRIPT_URL in a .env file / your hosting settings.
 */
const PASTED_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwVDaKqhKjT2D-gMCc1HHOP3YRAZSL1b2FsQcbeRCZTRSJDaCw6qv67-OuoPBIDaqiemQ/exec';

export const GOOGLE_SCRIPT_URL: string =
  import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || PASTED_SCRIPT_URL;
