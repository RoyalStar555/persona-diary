export type Mood = {
  label: string;
  bg: string;
  color: string;
  bdr: string;
};

export const MOODS: Mood[] = [
  { label: "😊 Happy", bg: "#FAEEDA", color: "#412402", bdr: "#FAC775" },
  { label: "🌿 Calm", bg: "#EAF3DE", color: "#173404", bdr: "#C0DD97" },
  { label: "💜 Grateful", bg: "#FBEAF0", color: "#4B1528", bdr: "#F4C0D1" },
  { label: "😤 Stressed", bg: "#FAECE7", color: "#4A1B0C", bdr: "#F5C4B3" },
  { label: "😢 Sad", bg: "#E6F1FB", color: "#042C53", bdr: "#B5D4F4" },
  { label: "🤩 Excited", bg: "#EEEDFE", color: "#26215C", bdr: "#CECBF6" },
  { label: "😴 Tired", bg: "#F1EFE8", color: "#2C2C2A", bdr: "#D3D1C7" },
];

export type Entry = {
  id: string;
  /** ISO date YYYY-MM-DD */
  date?: string;
  day: string;
  mon: string;
  title: string;
  preview: string;
  body: string;
  /** Optional canvas data URL when entry was created from handwriting */
  sketch?: string;
  mood: string;
  moodBg: string;
  moodColor: string;
  moodBdr: string;
  cats: string[];
  catBg: string;
  catColor: string;
};

export const INITIAL_ENTRIES: Entry[] = [
  { id: "1", date: "2026-06-14", day: "14", mon: "Jun", title: "A quiet Sunday morning", preview: "The coffee was warm and the sunlight came through the curtains in that perfect golden angle. I felt immensely grateful for small joys and quiet mornings.", body: "The coffee was warm and the sunlight came through the curtains in that perfect golden angle. I sat there just breathing it all in, feeling immensely grateful for small joys and quiet mornings. There is something sacred about Sunday stillness.", mood: "😊 Happy", moodBg: "#FAEEDA", moodColor: "#412402", moodBdr: "#FAC775", cats: ["Personal"], catBg: "#EAF3DE", catColor: "#173404" },
  { id: "2", date: "2026-06-13", day: "13", mon: "Jun", title: "Project milestone achieved 🎉", preview: "We finally shipped the feature! The team celebrated and I felt this overwhelming sense of pride and relief wash over me.", body: "We finally shipped the feature after three weeks of late nights. The team had cake. I felt this wave of pride and relief that I have not felt in a while.", mood: "🤩 Excited", moodBg: "#EEEDFE", moodColor: "#26215C", moodBdr: "#CECBF6", cats: ["Work"], catBg: "#F1EFE8", catColor: "#2C2C2A" },
  { id: "3", date: "2026-06-12", day: "12", mon: "Jun", title: "Dreamt of the mountains again", preview: "Snow-capped peaks, a wooden cabin, the smell of pine. Perhaps a longing for stillness in a noisy world.", body: "The same recurring dream. Snow-capped peaks, a wooden cabin, the sharp smell of pine. A fire inside. I woke up feeling strangely peaceful.", mood: "💜 Grateful", moodBg: "#FBEAF0", moodColor: "#4B1528", moodBdr: "#F4C0D1", cats: ["Dreams"], catBg: "#FBEAF0", catColor: "#4B1528" },
  { id: "4", date: "2026-06-10", day: "10", mon: "Jun", title: "A walk by the river", preview: "Took an hour off and walked along the riverbank. Two kids throwing stones reminded me of being eight years old.", body: "Took a full hour off and just walked along the riverbank. The geese were out. Two kids throwing flat stones. Reminded me of being eight years old with my dad.", mood: "🌿 Calm", moodBg: "#EAF3DE", moodColor: "#173404", moodBdr: "#C0DD97", cats: ["Travel", "Personal"], catBg: "#E6F1FB", catColor: "#042C53" },
  { id: "5", date: "2026-06-08", day: "08", mon: "Jun", title: "Missing home", preview: "Called mum today. Three months since I last saw her. Her laugh was clear as ever. Warm and hollow at the same time.", body: "Called mum today. Three months since I last saw her. The video call was pixelated but her laugh came through crystal clear.", mood: "💜 Grateful", moodBg: "#FBEAF0", moodColor: "#4B1528", moodBdr: "#F4C0D1", cats: ["Personal"], catBg: "#F1EFE8", catColor: "#2C2C2A" },
];

export type ViewId =
  | "auth" | "dashboard" | "editor" | "entries" | "handwriting" | "calendar"
  | "analytics" | "lock" | "security" | "settings" | "notifications" | "export";
