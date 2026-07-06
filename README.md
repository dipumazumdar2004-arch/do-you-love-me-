# ❤️ Do You Love Me? - Romantic Love Proposal Website ❤️

An interactive, funny, and beautiful single-page website built with HTML, CSS, and vanilla JavaScript. Perfect for sending a playful love proposal to your significant other!

---

## ✨ Features

* 🌸 **Pastel Pink & Red Theme**: Beautiful rounded layout with glassmorphism card designs.
* 🎈 **Continuous Canvas Animations**: Performance-optimized animated floating hearts in the background.
* 💔 **The Runaway "NO" Button**: 
  * Shrinks on every click, while changing text prompts dynamically.
  * Grows the **YES** button until it occupies the card.
  * Dodges the mouse cursor (runs away) when hovered after a few attempts.
* 🍕 **Custom Reactions**:
  * Shows her picture (`images/her.jpg`) on clicking "NO" to look cute/funny.
  * Shows your picture (`images/me.jpg`) on entering the celebration screen.
* 🎉 **YES Celebration Screen**:
  * Multi-colored confetti burst canvas.
  * Orbiting hearts rotating around your profile picture.
  * Pop-up romantic quotes that fade in/out across the screen.
* 🎵 **Programmatic Audio Synth**: Programmatically synthesizes game-like bubble pop sounds, background melody, and celebration arpeggios using the **Web Audio API** (works 100% offline, zero audio loading lag!).

---

## 📂 File Structure

```text
├── index.html       # Main HTML Page
├── style.css        # Animations and Styling
├── script.js        # Scurrying logic, particle canvas, synth, and triggers
└── images/          # Image Folder
    ├── her.jpg      # Girlfriend's photo (shown on NO click)
    └── me.jpg       # Boyfriend's photo (shown on YES click)
```

---

## 🚀 How to Customize

1. **Change Photos**:
   * Replace `images/her.jpg` with a photo of your girlfriend.
   * Replace `images/me.jpg` with a photo of yourself.
   * Keep the same file names (`her.jpg` and `me.jpg`) or update their references in `index.html`.

2. **Edit Text Messages**:
   * You can edit the text sequence that appears on clicking **NO** inside `script.js` by updating the `proposalTitles` and `proposalSubtitles` arrays.

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

To share the proposal link with her, you can host it for free on **GitHub Pages** in just 1 minute:

1. Create a **New Repository** on GitHub (e.g., `do-you-love-me`).
2. Upload all the files (`index.html`, `style.css`, `script.js`, and the `images` folder) directly to the repository.
3. Go to **Settings** in your GitHub repository.
4. Click on **Pages** in the left sidebar under the "Code and automation" section.
5. Under **Build and deployment**, set the Source to **Deploy from a branch**.
6. Select the **main** (or **master**) branch and click **Save**.
7. Wait a few seconds, and GitHub will provide you with a live link (e.g., `https://username.github.io/do-you-love-me/`) to share with her!
