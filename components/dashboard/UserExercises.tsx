"use client";
import { useEffect, useState } from "react";
import Card from "../shared/Card";

export default function UserExercises() {
  const [exercises, setExercises] = useState("");

  useEffect(() => {
    fetch("/api/user/latest-exercises")
      .then(res => res.json())
      .then(data => setExercises(data?.exercises || "تمرینی وجود ندارد."));
  }, []);

  return (
    <Card title="تمرین‌های شخصی‌سازی‌شده برای شما">
      <div className="whitespace-pre-line text-gray-700 text-sm">{exercises}</div>
    </Card>
  );
} 