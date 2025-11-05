"use client";
import { useEffect, useState } from "react";
import Card from "../shared/Card";

export default function GptRecommendations() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/user/latest-recommendation")
      .then(res => res.json())
      .then(data => setContent(data?.content || "توصیه‌ای یافت نشد."));
  }, []);

  return (
    <Card title="تست‌های پیشنهادی GPT پس از غربالگری">
      <div className="whitespace-pre-line text-sm text-gray-700">{content}</div>
    </Card>
  );
} 