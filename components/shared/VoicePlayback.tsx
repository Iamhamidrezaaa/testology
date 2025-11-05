"use client";

import React, { useState } from 'react';

interface VoicePlaybackProps {
  text: string;
  title?: string;
}

export function VoicePlayback({ text, title }: VoicePlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      // توقف پخش قبلی
      window.speechSynthesis.cancel();

      // ساخت utterance جدید
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR'; // فارسی
      utterance.rate = 0.9; // سرعت
      utterance.pitch = 1; // لحن

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert('مرورگر شما از خواندن صوتی پشتیبانی نمی‌کند');
    }
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔊</span>
          <div>
            <div className="font-medium text-gray-800 dark:text-white">
              خواندن صوتی
            </div>
            {title && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {title}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={speak}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>▶️</span>
              <span>پخش</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resume}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  ▶️ ادامه
                </button>
              ) : (
                <button
                  onClick={pause}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                >
                  ⏸️ مکث
                </button>
              )}
              <button
                onClick={stop}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                ⏹️ توقف
              </button>
            </>
          )}
        </div>
      </div>

      {isPlaying && (
        <div className="mt-3">
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            در حال پخش...
          </p>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        💡 این ویژگی برای افراد با نیازهای ویژه بینایی طراحی شده است
      </p>
    </div>
  );
}

export default VoicePlayback;
















