"use client";
import { useState } from "react";
import Link from "next/link";
import AIC_TabUserAnalytics from "./tabs/UserAnalytics";
import AIC_TabAIHealth from "./tabs/AIHealth";
import AIC_TabMoodMap from "./tabs/MoodMap";
import AIC_TabLearning from "./tabs/Learning";
import CollectiveMap from "./tabs/CollectiveMap";
import SelfAwareness from "./tabs/SelfAwareness";
import EthicsMonitor from "./tabs/EthicsMonitor";

export default function AICenter() {
  const [tab, setTab] = useState<"user"|"health"|"mood"|"learn"|"collective"|"self"|"ethics">("user");

  const TabButton = ({k, label}:{k:any,label:string}) => (
    <button onClick={()=>setTab(k)} className={`px-3 py-2 rounded-xl border ${tab===k?'bg-blue-600 text-white':'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'}`}>
      {label}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">AI Center — Testology</h1>
        <div className="flex gap-3">
          <Link href="/demo" className="text-sm text-blue-600 underline">🎥 مشاهده نمای زنده (Demo Mode)</Link>
          <Link href="/dashboard" className="text-sm underline">برگشت به داشبورد</Link>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <TabButton k="user" label="User Analytics" />
        <TabButton k="health" label="AI Health" />
        <TabButton k="mood" label="Mood Map" />
        <TabButton k="learn" label="Learning Engine" />
        <TabButton k="collective" label="Collective Mind" />
        <TabButton k="self" label="Self Awareness" />
        <TabButton k="ethics" label="Ethical Monitor" />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-gray-900/60">
        {tab==="user" && <AIC_TabUserAnalytics />}
        {tab==="health" && <AIC_TabAIHealth />}
        {tab==="mood" && <AIC_TabMoodMap />}
        {tab==="learn" && <AIC_TabLearning />}
        {tab==="collective" && <CollectiveMap />}
        {tab==="self" && <SelfAwareness />}
        {tab==="ethics" && <EthicsMonitor />}
      </div>
    </div>
  );
}
