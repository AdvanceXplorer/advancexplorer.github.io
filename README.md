# Akan Selim Research Website

This is a GitHub Pages-ready static personal website for Akan Selim.

## Files

- `index.html` — the full website
- `styles.css` — visual design
- `app.js` — animations and interactive demos
- `assets/Akan_Selim_CV.pdf` — downloadable CV
- `.nojekyll` — tells GitHub Pages to serve files directly

## How to publish on GitHub Pages using only the browser

1. Open your GitHub repository.
2. Make sure the repository name is exactly:

   ```text
   YOUR-GITHUB-USERNAME.github.io
   ```

   Example:

   ```text
   advancexplorer.github.io
   ```

3. Unzip this folder on your computer.
4. In the GitHub repository, click **Add file → Upload files**.
5. Drag all files and folders from this package into GitHub.
6. Click **Commit changes**.
7. Go to **Settings → Pages**.
8. Set:

   ```text
   Source: Deploy from a branch
   Branch: main
   Folder: /root
   ```

9. Open:

   ```text
   https://YOUR-GITHUB-USERNAME.github.io
   ```

## How to edit the text

Open `index.html` and edit the section text directly.

## How to edit the colors

Open `styles.css` and modify the variables at the top, especially:

```css
--bg
--cyan
--amber
--rose
--green
```

## How to edit the interactive demos

Open `app.js`. The demos are separated into functions:

- `covarianceDemo()`
- `densityDemo()`
- `orbitDemo()`
- `correctionDemo()`

Each slider is linked by its HTML `id`.
