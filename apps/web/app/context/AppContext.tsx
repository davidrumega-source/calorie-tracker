"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export interface UserProfile {
	name: string
	age: number
	weightKg: number
	heightCm: number
	activityLevel: "sedentary" | "light" | "moderate" | "very" | "extreme"
	goalType: "lose" | "maintain" | "gain"
	targetCalories: number
	targetProteinPct: number
	targetCarbsPct: number
	targetFatPct: number
	onboardingComplete: boolean
}

export interface FoodEntry {
	id: string
	name: string
	calories: number
	protein: number
	carbs: number
	fat: number
	quantity: number
	mealType: 1 | 2 | 3 | 4
	date: string
}

export interface DailyTask {
	id: string
	title: string
	icon: string
	completed: boolean
}

interface AppState {
	profile: UserProfile
	entries: FoodEntry[]
	tasks: Record<string, DailyTask[]>
	setProfile: (p: Partial<UserProfile>) => void
	addEntry: (e: Omit<FoodEntry, "id">) => void
	deleteEntry: (id: string) => void
	toggleTask: (date: string, taskId: string) => void
	getEntriesForDate: (date: string) => FoodEntry[]
	getTasksForDate: (date: string) => DailyTask[]
}

const DEFAULT_TASKS = [
	{ title: "Drink 2L water", icon: "💧" },
	{ title: "Exercise 30 min", icon: "💪" },
	{ title: "Eat vegetables", icon: "🥗" },
	{ title: "Take vitamins", icon: "💊" },
	{ title: "Walk 10,000 steps", icon: "🚶" },
	{ title: "Sleep 8 hours", icon: "🌙" },
]

const ACTIVITY_MULTIPLIERS = {
	sedentary: 1.2,
	light: 1.375,
	moderate: 1.55,
	very: 1.725,
	extreme: 1.9,
}

export const GOAL_ADJUSTMENTS = {
	lose: { offset: -500, protein: 35, carbs: 40, fat: 25 },
	maintain: { offset: 0, protein: 25, carbs: 50, fat: 25 },
	gain: { offset: 300, protein: 30, carbs: 45, fat: 25 },
}

export function calculateTDEE(profile: Partial<UserProfile>): number {
	const { weightKg = 70, heightCm = 170, age = 25, activityLevel = "moderate", goalType = "maintain" } = profile
	const bmrMale = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
	const bmrFemale = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
	const bmr = (bmrMale + bmrFemale) / 2
	const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel]
	return Math.max(1200, Math.round(tdee + GOAL_ADJUSTMENTS[goalType].offset))
}

const defaultProfile: UserProfile = {
	name: "",
	age: 25,
	weightKg: 70,
	heightCm: 170,
	activityLevel: "moderate",
	goalType: "maintain",
	targetCalories: 2200,
	targetProteinPct: 25,
	targetCarbsPct: 50,
	targetFatPct: 25,
	onboardingComplete: false,
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
	const [profile, setProfileState] = useState<UserProfile>(defaultProfile)
	const [entries, setEntries] = useState<FoodEntry[]>([])
	const [tasks, setTasks] = useState<Record<string, DailyTask[]>>({})
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		const savedProfile = localStorage.getItem("ct_profile")
		const savedEntries = localStorage.getItem("ct_entries")
		const savedTasks = localStorage.getItem("ct_tasks")
		if (savedProfile) setProfileState(JSON.parse(savedProfile))
		if (savedEntries) setEntries(JSON.parse(savedEntries))
		if (savedTasks) setTasks(JSON.parse(savedTasks))
		setLoaded(true)
	}, [])

	useEffect(() => {
		if (!loaded) return
		localStorage.setItem("ct_profile", JSON.stringify(profile))
	}, [profile, loaded])

	useEffect(() => {
		if (!loaded) return
		localStorage.setItem("ct_entries", JSON.stringify(entries))
	}, [entries, loaded])

	useEffect(() => {
		if (!loaded) return
		localStorage.setItem("ct_tasks", JSON.stringify(tasks))
	}, [tasks, loaded])

	const setProfile = (p: Partial<UserProfile>) => {
		setProfileState((prev) => ({ ...prev, ...p }))
	}

	const addEntry = (e: Omit<FoodEntry, "id">) => {
		setEntries((prev) => [...prev, { ...e, id: crypto.randomUUID() }])
	}

	const deleteEntry = (id: string) => {
		setEntries((prev) => prev.filter((e) => e.id !== id))
	}

	const getEntriesForDate = (date: string) => entries.filter((e) => e.date === date)

	const getTasksForDate = (date: string): DailyTask[] => {
		if (!tasks[date]) {
			const newTasks = DEFAULT_TASKS.map((t, i) => ({
				id: `${date}-${i}`,
				title: t.title,
				icon: t.icon,
				completed: false,
			}))
			setTasks((prev) => ({ ...prev, [date]: newTasks }))
			return newTasks
		}
		return tasks[date]
	}

	const toggleTask = (date: string, taskId: string) => {
		setTasks((prev) => ({
			...prev,
			[date]: (prev[date] || []).map((t) =>
				t.id === taskId ? { ...t, completed: !t.completed } : t
			),
		}))
	}

	if (!loaded) return null

	return (
		<AppContext.Provider
			value={{ profile, entries, tasks, setProfile, addEntry, deleteEntry, toggleTask, getEntriesForDate, getTasksForDate }}
		>
			{children}
		</AppContext.Provider>
	)
}

export function useApp() {
	const ctx = useContext(AppContext)
	if (!ctx) throw new Error("useApp must be used within AppProvider")
	return ctx
}
