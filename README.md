<img width="720" height="857" alt="1000140958" src="https://github.com/user-attachments/assets/0e211504-7625-431e-9a2f-c6f546185043" />
<img width="720" height="878" alt="1000140957" src="https://github.com/user-attachments/assets/beb80e2c-9373-454d-bada-68d9a53fd02c" />
<img width="720" height="874" alt="1000140959" src="https://github.com/user-attachments/assets/84ddd09c-c82e-4992-a41e-031a9155c432" />
<img width="720" height="1396" alt="1000140956" src="https://github.com/user-attachments/assets/bb3671d3-2b93-4338-a5b8-578f37ca7bc9" />
<img width="720" height="583" alt="1000140960" src="https://github.com/user-attachments/assets/369cb2af-5a97-4fbb-ae6b-f7b30e37b158" />
<img width="425" height="483" alt="1000140961" src="https://github.com/user-attachments/assets/f2b589f8-f241-4cb8-804f-75a3f3dbdf08" />
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

