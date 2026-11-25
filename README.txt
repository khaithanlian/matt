# Bible Reader website

This is a static Bible-reading website generated from your SQLite database.

## Files
- `index.html` — website page
- `styles.css` — layout and appearance
- `app.js` — book/chapter navigation and search
- `bible.json` — Bible content extracted from `bible.db`
- `service-worker.js` — offline cache after the first successful visit
- `manifest.webmanifest` — installable web-app metadata

## Preview on your computer
Do not open `index.html` by double-clicking it, because browsers may block loading the JSON file.
1. Install Python 3 if it is not already installed.
2. Open Command Prompt in this folder.
3. Run: `python -m http.server 8000`
4. Open `http://localhost:8000` in your browser.

The website can then be stopped with Ctrl+C in Command Prompt.

## Publish free with GitHub Pages
1. Sign in to GitHub and create a new **public** repository, for example `my-bible`.
2. Extract this ZIP file.
3. Upload all files and folders inside the extracted folder to the repository's root (not the ZIP itself).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then save.
7. GitHub will provide your website address after publishing.

## Offline use
The service worker caches the site and Bible data after the first successful visit over HTTPS (GitHub Pages uses HTTPS). Open the site once while online; subsequent visits can work offline on the same browser/device.

## Adding more Bible books later
When you add books to `bible.db`, regenerate `bible.json` from the updated database and upload the replacement `bible.json` to your website. The website navigation automatically lists all books found in that JSON file.

## Important
This build contains only the data present in the uploaded database: Mattithyah, 28 chapters, 1,070 verses and 18 section headings. It does not contain Mark or other books yet.
