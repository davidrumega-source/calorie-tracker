import { useCallback, useEffect, useState } from "react"
import { useDiaryContext } from "@/providers/DatabaseProvider"
import { useFocusEffect } from "expo-router"

export interface DailyTask {
	id: number
	title: string
	icon: string
	date: string
	completed: boolean
}

interface DbDailyTask {
	id: number
	title: string
	icon: string
	date: string
	completed: number
}

const DEFAULT_TASKS = [
	{ title: "Drink 2L water", icon: "water-outline" },
	{ title: "Exercise 30 min", icon: "fitness-outline" },
	{ title: "Eat vegetables", icon: "leaf-outline" },
	{ title: "Take vitamins", icon: "medkit-outline" },
	{ title: "Walk 10,000 steps", icon: "walk-outline" },
	{ title: "Sleep 8 hours", icon: "moon-outline" },
]

function toISODate(date: Date): string {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, "0")
	const d = String(date.getDate()).padStart(2, "0")
	return `${y}-${m}-${d}`
}

export const useDailyTasks = (date: Date) => {
	const { db } = useDiaryContext()
	const [tasks, setTasks] = useState<DailyTask[]>([])

	const dateStr = toISODate(date)

	const ensureTasksForDate = useCallback(async () => {
		if (!db) return

		const existing = await db.getAllAsync<DbDailyTask>(
			"SELECT * FROM daily_tasks WHERE date = ? ORDER BY id ASC",
			[dateStr]
		)

		if (existing.length === 0) {
			for (const task of DEFAULT_TASKS) {
				await db.runAsync(
					"INSERT INTO daily_tasks (title, icon, date, completed) VALUES (?, ?, ?, 0)",
					[task.title, task.icon, dateStr]
				)
			}

			const fresh = await db.getAllAsync<DbDailyTask>(
				"SELECT * FROM daily_tasks WHERE date = ? ORDER BY id ASC",
				[dateStr]
			)
			setTasks(fresh.map(mapTask))
		} else {
			setTasks(existing.map(mapTask))
		}
	}, [db, dateStr])

	const toggleTask = useCallback(
		async (taskId: number) => {
			if (!db) return

			await db.runAsync(
				"UPDATE daily_tasks SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ?",
				[taskId]
			)

			setTasks((prev) =>
				prev.map((t) =>
					t.id === taskId ? { ...t, completed: !t.completed } : t
				)
			)
		},
		[db]
	)

	useEffect(() => {
		ensureTasksForDate()
	}, [ensureTasksForDate])

	useFocusEffect(ensureTasksForDate)

	const completedCount = tasks.filter((t) => t.completed).length

	return {
		tasks,
		toggleTask,
		completedCount,
		totalCount: tasks.length,
	}
}

function mapTask(row: DbDailyTask): DailyTask {
	return {
		id: row.id,
		title: row.title,
		icon: row.icon,
		date: row.date,
		completed: row.completed === 1,
	}
}
