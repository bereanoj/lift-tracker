import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [logs, setLogs] = useState([]);

  const selectedExercise = customExercise.trim() || exercise;

  const addSet = () => {
    if (!selectedExercise || !weight || !reps) return;

    const newSet = {
      id: crypto.randomUUID(),
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

  const deleteSet = (id) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  const bestByExercise = useMemo(() => {
    return logs.reduce((acc, log) => {
      const currentBest = acc[log.exercise];
      if (!currentBest || log.estimatedOneRepMax > currentBest.estimatedOneRepMax) {
        acc[log.exercise] = log;
      }
      return acc;
    }, {});
  }, [logs]);

  const recentForSelected = logs.filter((log) => log.exercise === selectedExercise).slice(0, 5);
  const bestSelected = bestByExercise[selectedExercise];

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
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

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="space-y-4 p-5">
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
                <Input
                  placeholder="Optional"
                  value={customExercise}
                  onChange={(e) => setCustomExercise(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Weight</label>
                <Input
                  type="number"
                  placeholder="185"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Reps</label>
                <Input
                  type="number"
                  placeholder="8"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addSet} className="w-full rounded-xl">
                  <Plus className="mr-2" size={18} /> Log Set
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
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
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <h2 className="mb-3 text-xl font-semibold">Recent Sets</h2>
              <div className="space-y-2">
                {recentForSelected.length === 0 ? (
                  <p className="text-slate-500">Nothing yet. Log your first set.</p>
                ) : (
                  recentForSelected.map((log) => (
                    <div key={log.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                      <div>
                        <p className="font-medium">{log.weight} lb x {log.reps}</p>
                        <p className="text-sm text-slate-500">Est. 1RM: {log.estimatedOneRepMax} lb</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteSet(log.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <h2 className="mb-3 text-xl font-semibold">All Logs</h2>
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-slate-500">Your training history will show up here.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="grid grid-cols-5 items-center rounded-xl bg-white p-3 text-sm shadow-sm">
                    <span>{log.date}</span>
                    <span className="font-medium">{log.exercise}</span>
                    <span>{log.weight} lb</span>
                    <span>{log.reps} reps</span>
                    <span>1RM: {log.estimatedOneRepMax}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
