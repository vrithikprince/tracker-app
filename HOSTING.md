# Hosting Instructions for Tracker App

This guide explains how to host your Tracker application for free using GitHub Pages.

## Prerequisites
- A GitHub account
- Git installed on your computer

## Step 1: Prepare the Project

1. Open `vite.config.ts` and add the `base` property with your repository name.
   ```ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // REPLACE 'your-repo-name' with your actual repository name
   })
   ```

2. Install the `gh-pages` package:
   ```bash
   npm install gh-pages --save-dev
   ```

3. Update `package.json` scripts. Add these two lines to the `scripts` section:
   ```json
   "scripts": {
     // ... existing scripts
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

## Step 2: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and create a new repository (e.g., `tracker-app`).
2. Do not initialize with README, .gitignore, or License (keep it empty).

## Step 3: Push Code to GitHub

Open your terminal in the project folder (`D:\Tracker`) and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tracker-app.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` and `tracker-app` with your actual details)*

## Step 4: Deploy

Run the deploy script:

```bash
npm run deploy
```

This command will:
1. Build your project.
2. Upload the `dist` folder to a `gh-pages` branch on your repository.

## Step 5: Access Your Site

1. Go to your repository settings on GitHub.
2. Scroll down to "Pages" (or look in the sidebar).
3. Your site should be live at: `https://YOUR_USERNAME.github.io/tracker-app/`

## Alternative: Vercel (Easier)

1. Go to [Vercel.com](https://vercel.com) and sign up with GitHub.
2. Click "Add New Project".
3. Select your `tracker-app` repository.
4. Click "Deploy".
5. Vercel handles everything automatically (no need to change `vite.config.ts` or install `gh-pages`).