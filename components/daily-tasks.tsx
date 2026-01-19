"use client"

import { useState } from "react"

export default function DailyTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete morning meditation", completed: false },
    { id: 2, title: "Review your goals for today", completed: false },
    { id: 3, title: "Exercise for 30 minutes", completed: false },
    { id: 4, title: "Take breaks throughout the day", completed: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-blue-100 dark:border-slate-700">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Morning Checklist</h3>
          <p className="text-slate-600 dark:text-slate-400">
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>

        {/* Tasks list */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <label
              key={task.id}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 rounded border-2 border-blue-400 cursor-pointer accent-blue-500"
              />
              <span
                className={`text-lg transition-all ${
                  task.completed
                    ? "line-through text-slate-400 dark:text-slate-600"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {task.title}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
