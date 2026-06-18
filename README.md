# Persona Diary 📔🔐

> A modern, local-first digital diary built with a relentless focus on absolute privacy. Your thoughts actually belong to you.

## 🧠 The Philosophy
In a world of surveillance capitalism and fleeting social feeds, there's a growing hunger for private, intentional spaces. **Persona Diary** isn’t just another notes app slapping a lock screen on your data. Every word stays encrypted, every mood is meticulously tracked, and absolutely no one—not even the platform—can read what you write. 

No cloud snooping. No ads mining your sadness. Just you and your thoughts.

---

## ✨ Features

### 🛡️ Security-First Architecture
*   **Military-Grade Cryptography:** Passwords and PINs are hashed using PBKDF2-SHA256 (150,000 iterations) with unique per-user salts.
*   **Biometric Access:** Seamless WebAuthn unlock (Face ID, Touch ID, Windows Hello).
*   **Brute-Force Protection:** 4-digit PIN lock with escalating cooldowns (30s → 60s → 120s → 300s).
*   **Air-Tight Privacy:** Multi-user isolation ensures entries never leak between sessions. Auto-lock triggers upon idle detection.

### ✍️ Built for Real Writers
*   **Rich Text Editor:** Fully customizable typography with 6 curated fonts (Inter, Playfair Display, Caveat, etc.) and a seamless emoji picker.
*   **Frictionless Input:** Speech-to-text dictation and text-to-speech reading capabilities via the Web Speech API.
*   **Handwriting Canvas:** Pressure-sensitive stylus support featuring shape tools (rectangles, ellipses, arrows, lines) and instant sketch-to-entry saving.

### 📊 Self-Awareness, Visualized
*   **Emotional Landscape:** Track your days across 7 emotional states with beautifully color-coded calendars.
*   **Deep Analytics:** Monitor your writing streaks, average word counts, dominant moods, and happiness ratios at a glance.
*   **Neobashism Aesthetic:** 6 warm, switchable color themes (Amber, Teal, Coral, Purple, Blue, Gray) designed to be cozy, minimal, and human.

---

## 💻 Tech Stack

*   **Framework:** [React 19](https://react.dev/) & [TanStack Start](https://tanstack.com/start/latest)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Security & APIs:** WebAuthn (Biometrics), Web Speech API (Dictation), Canvas API
*   **Storage:** Local-first architecture (`localStorage`) with per-user encrypted isolation.

