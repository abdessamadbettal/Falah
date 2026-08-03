"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { useDict } from "@/components/locale";
import { ToolShell } from "@/components/ui/tool-shell";
import { cardCls, inputCls } from "@/components/ui/styles";
import { useMounted } from "@/components/ui/use-mounted";

export default function Client() {
  const d = useDict();
  const k = d.tools.tasbeeh;
  const isMounted = useMounted();

  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState<number>(33);
  const [preset, setPreset] = useState<string>("subhanallah");
  const [customPreset, setCustomPreset] = useState("");
  const [customGoal, setCustomGoal] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dailyHistory, setDailyHistory] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("falah:tasbeeh");
      if (saved) {
        const p = JSON.parse(saved);
        // Using setTimeout to prevent React 18 cascading render warnings during hydration
        setTimeout(() => {
          if (p.count !== undefined) setCount(p.count);
          if (p.goal !== undefined) setGoal(p.goal);
          if (p.preset) setPreset(p.preset);
          if (p.customPreset) setCustomPreset(p.customPreset);
          if (p.totalCount !== undefined) setTotalCount(p.totalCount);
          if (p.dailyHistory) setDailyHistory(p.dailyHistory);
        }, 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(
      "falah:tasbeeh",
      JSON.stringify({ count, goal, preset, customPreset, totalCount, dailyHistory })
    );
  }, [count, goal, preset, customPreset, totalCount, dailyHistory, isMounted]);

  const handleTap = () => {
    if (goal > 0 && count >= goal) return; // Reached goal, stop counting unless reset
    
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount((prev) => prev + 1);
    
    const todayStr = new Date().toISOString().split("T")[0];
    setDailyHistory((prev) => ({
      ...prev,
      [todayStr]: (prev[todayStr] || 0) + 1,
    }));
    
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      if (goal > 0 && newCount === goal) {
        // Long vibration when goal is reached
        window.navigator.vibrate(200);
      } else {
        // Short tactile tap
        window.navigator.vibrate(40);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([30, 50, 30]);
    }
  };

  const isGoalReached = goal > 0 && count >= goal;
  const progress = goal > 0 ? Math.min(100, (count / goal) * 100) : 0;

  const currentPresetName =
    preset === "custom"
      ? customPreset || k.custom
      : preset === "subhanallah"
      ? k.subhanallah
      : preset === "alhamdulillah"
      ? k.alhamdulillah
      : k.allahuAkbar;

  const calculateStreak = (history: Record<string, number>) => {
    let streak = 0;
    const dDate = new Date();
    const todayStr = dDate.toISOString().split("T")[0];
    
    // If no dhikr today, check if they had a streak up to yesterday
    if (!history[todayStr]) {
      dDate.setDate(dDate.getDate() - 1);
    }
    
    while (true) {
      const dateStr = dDate.toISOString().split("T")[0];
      if (history[dateStr] && history[dateStr] > 0) {
        streak++;
        dDate.setDate(dDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const dDate = new Date();
    dDate.setDate(dDate.getDate() - (6 - i));
    return dDate.toISOString().split("T")[0];
  });
  const maxDaily = Math.max(...last7Days.map(dStr => dailyHistory[dStr] || 0), 1);

  if (!isMounted) {
    return (
      <ToolShell icon="ph:fingerprint" title={k.title} side={k.side} intro={k.intro}>
        <div className="flex min-h-[400px] items-center justify-center">
          <Icon icon="ph:spinner-gap" className="size-8 animate-spin text-zinc-400" />
        </div>
      </ToolShell>
    );
  }

  return (
    <ToolShell icon="ph:fingerprint" title={k.title} side={k.side} intro={k.intro}>
      <div className="mx-auto max-w-md space-y-6">
        
        {/* Settings Panel */}
        <div className={`${cardCls} overflow-hidden`}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex w-full items-center justify-between p-4 text-start font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Icon icon="ph:faders" className="size-5" />
              <span>{k.presets} & {k.target}</span>
            </div>
            <Icon 
              icon="ph:caret-down" 
              className={`size-5 transition-transform ${isEditing ? "rotate-180" : ""}`} 
            />
          </button>
          
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-zinc-200 p-4 dark:border-zinc-800 space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{k.presets}</label>
                  <select
                    className={inputCls}
                    value={preset}
                    onChange={(e) => {
                      setPreset(e.target.value);
                      setCount(0); // reset count on change
                    }}
                  >
                    <option value="subhanallah">{k.subhanallah}</option>
                    <option value="alhamdulillah">{k.alhamdulillah}</option>
                    <option value="allahuAkbar">{k.allahuAkbar}</option>
                    <option value="custom">{k.custom}</option>
                  </select>
                  {preset === "custom" && (
                    <input
                      type="text"
                      className={`${inputCls} mt-2`}
                      placeholder={k.custom}
                      value={customPreset}
                      onChange={(e) => setCustomPreset(e.target.value)}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{k.target}</label>
                  <select
                    className={inputCls}
                    value={goal === 33 || goal === 100 || goal === 0 ? goal.toString() : "custom"}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v !== "custom") {
                        setGoal(parseInt(v, 10));
                        setCustomGoal("");
                      } else {
                        setGoal(customGoal ? parseInt(customGoal, 10) : 1000);
                      }
                    }}
                  >
                    <option value="33">33</option>
                    <option value="100">100</option>
                    <option value="0">{k.freeForm}</option>
                    <option value="custom">{k.custom}</option>
                  </select>
                  {![0, 33, 100].includes(goal) && (
                    <input
                      type="number"
                      min="1"
                      className={`${inputCls} mt-2`}
                      placeholder={k.target}
                      value={customGoal || goal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomGoal(val);
                        if (val) setGoal(parseInt(val, 10));
                      }}
                    />
                  )}
                </div>

                {/* Stats & History */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <span>{k.history}</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
                      <Icon icon="ph:fire-fill" className="size-4" />
                      {calculateStreak(dailyHistory)} {k.streak}
                    </span>
                  </div>
                  
                  {/* 7-day Bar Chart */}
                  <div className="flex h-24 items-end justify-between gap-1.5 pt-2">
                    {last7Days.map((dateStr) => {
                      const dayCount = dailyHistory[dateStr] || 0;
                      const heightPct = Math.max((dayCount / maxDaily) * 100, dayCount > 0 ? 5 : 0);
                      const isToday = dateStr === new Date().toISOString().split("T")[0];
                      const dayName = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'narrow' });
                      
                      return (
                        <div key={dateStr} className="flex flex-1 flex-col items-center gap-2 group relative">
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-zinc-900 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity whitespace-nowrap z-10 dark:bg-white dark:text-zinc-900">
                            {dayCount}
                          </div>
                          
                          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-sm h-full flex items-end">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPct}%` }}
                              className={`w-full rounded-sm transition-colors ${isToday ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-emerald-200 dark:bg-emerald-900/50'}`}
                            />
                          </div>
                          <span className={`text-[10px] font-medium uppercase ${isToday ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`}>
                            {dayName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Counter UI */}
        <div className={isFullScreen ? "fixed inset-0 z-50 flex flex-col items-center justify-center space-y-10 bg-white p-6 dark:bg-zinc-950" : `${cardCls} p-6 sm:p-10 flex flex-col items-center justify-center space-y-10 relative overflow-hidden`}>
          
          {/* Header Info & Full Screen Toggle */}
          <div className="flex w-full items-start justify-between">
            <div className={`text-center space-y-1 ${isFullScreen ? "flex-1" : "w-full"}`}>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {currentPresetName}
              </h2>
              {goal > 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400">
                  {k.target}: {goal}
                </p>
              ) : (
                <p className="text-zinc-500 dark:text-zinc-400">
                  {k.freeForm}
                </p>
              )}
            </div>
            
            {/* Full Screen Toggle Button (Only show in top corner if full screen) */}
            {isFullScreen && (
              <button
                onClick={() => setIsFullScreen(false)}
                className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label={k.exitFullScreen}
              >
                <Icon icon="ph:corners-in" className="size-6" />
              </button>
            )}
          </div>

          {/* Big Circular Tap Area */}
          <div className="relative">
            {/* SVG Ring Progress */}
            {goal > 0 && (
              <svg className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  className="fill-none stroke-zinc-100 dark:stroke-zinc-800/50"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  className={`fill-none transition-all duration-300 ease-out ${
                    isGoalReached ? "stroke-emerald-500" : "stroke-emerald-600 dark:stroke-emerald-500"
                  }`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="300"
                  strokeDashoffset={300 - (300 * progress) / 100}
                />
              </svg>
            )}

            <motion.button
              whileTap={!isGoalReached ? { scale: 0.93 } : {}}
              onClick={handleTap}
              className={`relative z-10 flex size-64 select-none flex-col items-center justify-center rounded-full shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-500/20 active:shadow-md ${
                isGoalReached
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 cursor-default"
                  : "bg-white text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              }`}
              style={{ touchAction: "manipulation" }}
              aria-label={k.count}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="text-7xl font-bold tabular-nums tracking-tight"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
              
              {isGoalReached && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400"
                >
                  {k.goalReached}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Bottom Actions */}
          <div className="flex w-full items-center justify-between">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {k.total}: <span className="text-zinc-900 dark:text-zinc-100">{totalCount}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!isFullScreen && (
                <button
                  onClick={() => setIsFullScreen(true)}
                  className="rounded-full p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  aria-label={k.fullScreen}
                  title={k.fullScreen}
                >
                  <Icon icon="ph:corners-out" className="size-5" />
                </button>
              )}
              <button
                onClick={handleReset}
                disabled={count === 0}
                className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  count === 0
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800/50 dark:text-zinc-600"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                <Icon icon="ph:arrow-counter-clockwise" className={`size-4 ${count > 0 ? "group-active:-rotate-45 transition-transform" : ""}`} />
                <span>{k.reset}</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </ToolShell>
  );
}
