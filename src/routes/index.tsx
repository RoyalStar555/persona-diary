import { createFileRoute } from "@tanstack/react-router";
import { DiaryApp } from "@/components/diary/DiaryApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyDiary — Your Personal Journal" },
      { name: "description", content: "A warm, secure personal diary with rich text, mood tracking, handwriting canvas, and analytics." },
      { property: "og:title", content: "MyDiary — Your Personal Journal" },
      { property: "og:description", content: "A warm, secure personal diary with rich text, mood tracking, handwriting canvas, and analytics." },
      { property: "og:url", content: "https://persona-diary.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://persona-diary.lovable.app/" }],
  }),
  component: DiaryApp,
});
