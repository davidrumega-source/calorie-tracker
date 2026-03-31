"use client"

import { useState, useMemo } from "react"
import { useApp } from "../context/AppContext"
import { AddFoodModal } from "./components/AddFoodModal"

const MEAL_LABELS = { 1: "Breakfast", 2: "Lunch", 3: "Dinner", 4: "Snacks" } as const
const MEAL_ICONS = { 1: "☀️", 2: "🍽️", 3: "🌙", 4: "🍿" } as const

const QUOTES = [
	{ text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
	{ text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
	{ text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
	{ text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
	{ text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
	{ text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
	{ text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
	{ text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
	{ text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
	{ text: "Strive for progress, not perfection.", author: "Unknown" },
	{ text: "Every healthy meal is a vote for the body you want.", author: "Unknown" },
	{ text: "The greatest wealth is health.", author: "Virgil" },
]

function toISO(d: Date) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function getQuote(date: Date) {
	const day = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
	return QUOTES[day % QUOTES.length]
}

export default function TrackerPage() {
	const { profile, getEntriesForDate, getTasksForDate, toggleTask, deleteEntry } = useApp()
	const [currentDate, setCurrentDate] = useState(new Date())
	const [showAddFood, setShowAddFood] = useState<1 | 2 | 3 | 4 | null>(null)

	const dateStr = toISO(currentDate)
	const isToday = toISO(new Date()) === dateStr
	const entries = getEntriesForDate(dateStr)
	const tasks = getTasksForDate(dateStr)
	const quote = useMemo(() => getQuote(currentDate), [currentDate])

	const totals = useMemo(() => {
		return entries.reduce(
			(acc, e) => ({
				calories: acc.calories + e.calories,
				protein: acc.protein + e.protein,
				carbs: acc.carbs + e.carbs,
				fat: acc.fat + e.fat,
			}),
			{ calories: 0, protein: 0, carbs: 0, fat: 0 }
		)
	}, [entries])

	const targetProtein = (profile.targetCalories * profile.targetProteinPct) / 100 / 4
	const targetCarbs = (profile.targetCalories * profile.targetCarbsPct) / 100 / 4
	const targetFat = (profile.targetCalories * profile.targetFatPct) / 100 / 9
	const remaining = profile.targetCalories - totals.calories
	const caloriePct = Math.min(100, (totals.calories / profile.targetCalories) * 100)

	const completedTasks = tasks.filter((t) => t.completed).length

	const prevDay = () => {
		const d = new Date(currentDate)
		d.setDate(d.getDate() - 1)
		setCurrentDate(d)
	}
	const nextDay = () => {
		if (isToday) return
		const d = new Date(currentDate)
		d.setDate(d.getDate() + 1)
		setCurrentDate(d)
	}

	const formatDate = (d: Date) => {
		if (isToday) return "Today"
		return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
	}

	return (
		<div className="max-w-lg mx-auto px-4 pb-8">
			{/* Header */}
			<div className="flex items-center justify-between py-4 sticky top-0 bg-bg-dark z-10">
				<button onClick={prevDay} className="p-2 hover:bg-surface rounded-lg transition">
					<span className="text-xl">&#8249;</span>
				</button>
				<h1 className="text-lg font-bold">{formatDate(currentDate)}</h1>
				<button
					onClick={nextDay}
					disabled={isToday}
					className={`p-2 rounded-lg transition ${isToday ? "opacity-30" : "hover:bg-surface"}`}
				>
					<span className="text-xl">&#8250;</span>
				</button>
			</div>

			{/* Motivational Quote */}
			<div className="bg-surface rounded-xl p-4 border-l-4 border-primary flex gap-3 mb-4">
				<span className="text-xl mt-0.5">🔥</span>
				<div>
					<p className="text-sm italic text-gray-300">"{quote.text}"</p>
					<p className="text-xs text-gray-500 mt-1">- {quote.author}</p>
				</div>
			</div>

			{/* Calorie Summary */}
			<div className="bg-surface rounded-xl p-5 mb-4">
				<div className="flex items-center justify-between mb-4">
					<div className="text-center">
						<p className="text-2xl font-bold">{Math.round(totals.calories)}</p>
						<p className="text-xs text-gray-400">Eaten</p>
					</div>
					<div className="text-center">
						<div className="relative w-24 h-24">
							<svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
								<circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="8" />
								<circle
									cx="50" cy="50" r="42" fill="none"
									stroke={caloriePct > 100 ? "#EF4444" : "#5BBEF9"}
									strokeWidth="8"
									strokeLinecap="round"
									strokeDasharray={`${caloriePct * 2.64} 264`}
								/>
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<p className="text-lg font-bold">{Math.abs(Math.round(remaining))}</p>
								<p className="text-[10px] text-gray-400">{remaining >= 0 ? "Remaining" : "Over"}</p>
							</div>
						</div>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold">{profile.targetCalories}</p>
						<p className="text-xs text-gray-400">Target</p>
					</div>
				</div>

				{/* Macros */}
				<div className="grid grid-cols-3 gap-4">
					<MacroBar label="Carbs" eaten={totals.carbs} target={targetCarbs} color="#5BBEF9" />
					<MacroBar label="Protein" eaten={totals.protein} target={targetProtein} color="#22C55E" />
					<MacroBar label="Fat" eaten={totals.fat} target={targetFat} color="#F59E0B" />
				</div>
			</div>

			{/* Daily Tasks */}
			<div className="mb-4">
				<div className="flex justify-between items-center mb-2">
					<h2 className="font-bold">Daily Tasks</h2>
					<span className="text-sm text-gray-400">{completedTasks}/{tasks.length}</span>
				</div>
				<div className="bg-surface rounded-xl p-4">
					<div className="w-full h-1.5 bg-gray-700 rounded-full mb-4">
						<div
							className="h-1.5 bg-green-500 rounded-full transition-all duration-300"
							style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
						/>
					</div>
					<div className="space-y-1">
						{tasks.map((task) => (
							<button
								key={task.id}
								onClick={() => toggleTask(dateStr, task.id)}
								className="w-full flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-bg-dark/50 transition text-left"
							>
								<div
									className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
										task.completed ? "bg-green-500 border-green-500" : "border-gray-600"
									}`}
								>
									{task.completed && <span className="text-white text-xs">✓</span>}
								</div>
								<span className="text-base">{task.icon}</span>
								<span className={`text-sm transition ${task.completed ? "line-through opacity-50" : ""}`}>
									{task.title}
								</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Meals */}
			{([1, 2, 3, 4] as const).map((mealType) => {
				const mealEntries = entries.filter((e) => e.mealType === mealType)
				const mealCalories = mealEntries.reduce((s, e) => s + e.calories, 0)
				return (
					<div key={mealType} className="mb-3">
						<div className="bg-surface rounded-xl p-4">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<span>{MEAL_ICONS[mealType]}</span>
									<h3 className="font-bold">{MEAL_LABELS[mealType]}</h3>
								</div>
								<span className="text-sm text-gray-400">{Math.round(mealCalories)} kcal</span>
							</div>
							{mealEntries.length > 0 && (
								<div className="space-y-2 mb-3">
									{mealEntries.map((entry) => (
										<div key={entry.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-bg-dark/50">
											<div>
												<p className="text-sm">{entry.name}</p>
												<p className="text-xs text-gray-500">{entry.quantity}g</p>
											</div>
											<div className="flex items-center gap-3">
												<span className="text-sm text-gray-300">{Math.round(entry.calories)} kcal</span>
												<button
													onClick={() => deleteEntry(entry.id)}
													className="text-red-400 hover:text-red-300 text-xs p-1"
												>
													✕
												</button>
											</div>
										</div>
									))}
								</div>
							)}
							<button
								onClick={() => setShowAddFood(mealType)}
								className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-gray-400 hover:border-primary hover:text-primary transition"
							>
								+ Add Food
							</button>
						</div>
					</div>
				)
			})}

			{showAddFood && (
				<AddFoodModal
					mealType={showAddFood}
					date={dateStr}
					onClose={() => setShowAddFood(null)}
				/>
			)}
		</div>
	)
}

function MacroBar({ label, eaten, target, color }: { label: string; eaten: number; target: number; color: string }) {
	const pct = Math.min(100, (eaten / target) * 100)
	return (
		<div className="text-center">
			<p className="text-xs text-gray-400 mb-1">{label}</p>
			<div className="w-full h-1.5 bg-gray-700 rounded-full mb-1">
				<div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
			</div>
			<p className="text-xs font-medium">{Math.round(eaten)} / {Math.round(target)}g</p>
		</div>
	)
}
