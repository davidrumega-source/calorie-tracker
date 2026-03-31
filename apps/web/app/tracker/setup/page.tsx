"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp, calculateTDEE, GOAL_ADJUSTMENTS } from "../../context/AppContext"

const ACTIVITY_LABELS = {
	sedentary: "Sedentary (office job)",
	light: "Lightly Active (1-2x/week)",
	moderate: "Moderately Active (3-5x/week)",
	very: "Very Active (6-7x/week)",
	extreme: "Extremely Active (athlete)",
} as const

const GOAL_LABELS = {
	lose: "Lose Weight",
	maintain: "Maintain Weight",
	gain: "Gain Muscle",
} as const

export default function SetupPage() {
	const { setProfile } = useApp()
	const router = useRouter()
	const [step, setStep] = useState(0)

	const [name, setName] = useState("")
	const [age, setAge] = useState(25)
	const [weightKg, setWeightKg] = useState(70)
	const [heightCm, setHeightCm] = useState(170)
	const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "very" | "extreme">("moderate")
	const [goalType, setGoalType] = useState<"lose" | "maintain" | "gain">("maintain")

	const handleFinish = () => {
		const p = { name, age, weightKg, heightCm, activityLevel, goalType }
		const targetCalories = calculateTDEE(p)
		const goal = GOAL_ADJUSTMENTS[goalType]
		setProfile({
			...p,
			targetCalories,
			targetProteinPct: goal.protein,
			targetCarbsPct: goal.carbs,
			targetFatPct: goal.fat,
			onboardingComplete: true,
		})
		router.replace("/tracker")
	}

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<div className="bg-surface rounded-xl p-6 w-full max-w-md">
				{step === 0 && (
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">About You</h1>
						<div>
							<label className="block text-sm text-gray-400 mb-2">Name (optional)</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
								placeholder="Your name"
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-400 mb-2">Age</label>
							<input
								type="number"
								value={age}
								onChange={(e) => setAge(Number(e.target.value))}
								className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
							/>
						</div>
						<button
							onClick={() => setStep(1)}
							className="w-full bg-primary text-bg-dark font-bold py-3 rounded-lg hover:opacity-90 transition"
						>
							Next
						</button>
					</div>
				)}

				{step === 1 && (
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">Body Measurements</h1>
						<div>
							<label className="block text-sm text-gray-400 mb-2">Weight (kg)</label>
							<input
								type="number"
								value={weightKg}
								onChange={(e) => setWeightKg(Number(e.target.value))}
								className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-400 mb-2">Height (cm)</label>
							<input
								type="number"
								value={heightCm}
								onChange={(e) => setHeightCm(Number(e.target.value))}
								className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
							/>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setStep(0)}
								className="flex-1 border border-gray-600 py-3 rounded-lg hover:bg-gray-800 transition"
							>
								Back
							</button>
							<button
								onClick={() => setStep(2)}
								className="flex-1 bg-primary text-bg-dark font-bold py-3 rounded-lg hover:opacity-90 transition"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">Activity Level</h1>
						<div className="space-y-3">
							{Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
								<button
									key={key}
									onClick={() => setActivityLevel(key as typeof activityLevel)}
									className={`w-full text-left px-4 py-3 rounded-lg border transition ${
										activityLevel === key
											? "border-primary bg-primary/10 text-primary"
											: "border-gray-700 hover:border-gray-500"
									}`}
								>
									{label}
								</button>
							))}
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setStep(1)}
								className="flex-1 border border-gray-600 py-3 rounded-lg hover:bg-gray-800 transition"
							>
								Back
							</button>
							<button
								onClick={() => setStep(3)}
								className="flex-1 bg-primary text-bg-dark font-bold py-3 rounded-lg hover:opacity-90 transition"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">Your Goal</h1>
						<div className="space-y-3">
							{Object.entries(GOAL_LABELS).map(([key, label]) => (
								<button
									key={key}
									onClick={() => setGoalType(key as typeof goalType)}
									className={`w-full text-left px-4 py-3 rounded-lg border transition ${
										goalType === key
											? "border-primary bg-primary/10 text-primary"
											: "border-gray-700 hover:border-gray-500"
									}`}
								>
									{label}
								</button>
							))}
						</div>
						<div className="bg-bg-dark rounded-lg p-4 text-center">
							<p className="text-sm text-gray-400">Your daily target</p>
							<p className="text-3xl font-bold text-primary">
								{calculateTDEE({ weightKg, heightCm, age, activityLevel, goalType })} kcal
							</p>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setStep(2)}
								className="flex-1 border border-gray-600 py-3 rounded-lg hover:bg-gray-800 transition"
							>
								Back
							</button>
							<button
								onClick={handleFinish}
								className="flex-1 bg-primary text-bg-dark font-bold py-3 rounded-lg hover:opacity-90 transition"
							>
								Start Tracking
							</button>
						</div>
					</div>
				)}

				<div className="flex justify-center gap-2 mt-6">
					{[0, 1, 2, 3].map((i) => (
						<div
							key={i}
							className={`w-2 h-2 rounded-full transition ${
								i === step ? "bg-primary" : "bg-gray-600"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
