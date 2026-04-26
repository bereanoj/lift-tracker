"use client";

import React, { useMemo, useState } from "react";
import { Plus, Trash2, Dumbbell, TrendingUp } from "lucide-react";

const starterExercises = [
  "Bench Press",
  "Overhead Press",
  "Barbell Row",
  "Lat Pulldown",
  "Squat",
  "Romanian Deadlift",
  "Leg Press",
  "Hamstring Curl",
];

export default function LiftTrackerApp() {
  const [exercise, setExercise] = useState("Bench Press");
  const [customExercise, setCustomExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  const selectedExercise = customExercise.trim() || exercise;

  const addSet = () => {
    if (!selectedExercise || !weight || !reps) return;

    const newSet = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      exercise: selectedExercise,
      weight: Number(weight),
      reps: Number(reps),
      estimatedOneRepMax: Math.round(Number(weight) * (1 + Number(reps) / 30)),
    };

    setLogs([newSet, ...logs]);
    setWeight("");
    setReps("");
  };

  const deleteSet = (id: string) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  const bestByExercise = useMemo(() => {
    return logs.reduce((acc, log) => {
      const currentBest = acc[log.exercise];
      if (!currentBest || log.estimatedOneRepMax > currentBest.estimatedOneRepMax) {
        acc[log.exercise] = log;
      }
      return acc;
    }, {} as Record<string, any>);
  }, [logs]);

  const recentForSelected = logs
    .filter((log) => log.exercise === selectedExercise)
    .slice(0, 5);

  const bestSelected = bestByExercise[selectedExercise];

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-sm">
            <Dumbbell size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lift Tracker</h1>
            <p className="text-slate-600">Log sets. Beat last time. No useless fluff.</p>
          </div>
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Exercise</label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white p-2"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                >
                  {starterExercises.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Custom exercise</label>
                <input
                  placeholder="Optional"
                  value={customExercise}
                  onChange={(e) => setCustomExercise(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Weight</label>
                <input
                  type="number"
                  placeholder="185"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Reps</label>
                <input
                  type="number"
                  placeholder="8"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={addSet}
                  className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-medium text-white"
                >
                  <Plus className="mr-2" size={18} /> Log Set
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp size={20} />
              <h2 className="text-xl font-semibold">Current Exercise</h2>
            </div>

            <p className="text-sm text-slate-600">{selectedExercise}</p>

            {bestSelected ? (
              <div className="mt-4 rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-600">Best estimated 1RM</p>
                <p className="text-3xl font-bold">{bestSelected.estimatedOneRepMax} lb</p>
                <p className="text-sm text-slate-600">
                  From {bestSelected.weight} x {bestSelected.reps}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-slate-500">No sets logged yet.</p>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">Recent Sets</h2>

            <div className="space-y-2">
              {recentForSelected.length === 0 ? (
                <p className="text-slate-500">Nothing yet. Log your first set.</p>
              ) : (
                recentForSelected.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {log.weight} lb x {log.reps}
                      </p>
                      <p className="text-sm text-slate-500">
                        Est. 1RM: {log.estimatedOneRepMax} lb
                      </p>
                    </div>

                    <button
                      onClick={() => deleteSet(log.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">All Logs</h2>

          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-slate-500">Your training history will show up here.</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-5 items-center rounded-xl bg-slate-50 p-3 text-sm"
                >
                  <span>{log.date}</span>
                  <span className="font-medium">{log.exercise}</span>
                  <span>{log.weight} lb</span>
                  <span>{log.reps} reps</span>
                  <span>1RM: {log.estimatedOneRepMax}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}