"use client"

import { useState } from "react"
import { useApp } from "../../context/AppContext"

const COMMON_FOODS = [
	{ name: "Chicken Breast (grilled)", cal: 165, p: 31, c: 0, f: 3.6 },
	{ name: "Rice (white, cooked)", cal: 130, p: 2.7, c: 28, f: 0.3 },
	{ name: "Egg (boiled)", cal: 155, p: 13, c: 1.1, f: 11 },
	{ name: "Banana", cal: 89, p: 1.1, c: 23, f: 0.3 },
	{ name: "Apple", cal: 52, p: 0.3, c: 14, f: 0.2 },
	{ name: "Bread (white)", cal: 265, p: 9, c: 49, f: 3.2 },
	{ name: "Pasta (cooked)", cal: 131, p: 5, c: 25, f: 1.1 },
	{ name: "Salmon (baked)", cal: 208, p: 20, c: 0, f: 13 },
	{ name: "Oatmeal (cooked)", cal: 68, p: 2.4, c: 12, f: 1.4 },
	{ name: "Greek Yogurt", cal: 59, p: 10, c: 3.6, f: 0.4 },
	{ name: "Avocado", cal: 160, p: 2, c: 9, f: 15 },
	{ name: "Sweet Potato (baked)", cal: 90, p: 2, c: 21, f: 0.1 },
	{ name: "Broccoli (steamed)", cal: 35, p: 2.4, c: 7, f: 0.4 },
	{ name: "Almonds", cal: 579, p: 21, c: 22, f: 50 },
	{ name: "Milk (whole)", cal: 61, p: 3.2, c: 4.8, f: 3.3 },
	{ name: "Cheese (cheddar)", cal: 403, p: 25, c: 1.3, f: 33 },
	{ name: "Beef Steak", cal: 271, p: 26, c: 0, f: 18 },
	{ name: "Tuna (canned)", cal: 116, p: 26, c: 0, f: 0.8 },
	{ name: "Potato (boiled)", cal: 87, p: 1.9, c: 20, f: 0.1 },
	{ name: "Orange", cal: 47, p: 0.9, c: 12, f: 0.1 },
	{ name: "Peanut Butter", cal: 588, p: 25, c: 20, f: 50 },
	{ name: "Cottage Cheese", cal: 98, p: 11, c: 3.4, f: 4.3 },
	{ name: "Protein Shake", cal: 120, p: 24, c: 3, f: 1.5 },
	{ name: "Salad (mixed greens)", cal: 20, p: 1.5, c: 3.5, f: 0.2 },
]

interface AddFoodModalProps {
	mealType: 1 | 2 | 3 | 4
	date: string
	onClose: () => void
}

export function AddFoodModal({ mealType, date, onClose }: AddFoodModalProps) {
	const { addEntry } = useApp()
	const [search, setSearch] = useState("")
	const [tab, setTab] = useState<"search" | "custom">("search")

	// Custom entry state
	const [customName, setCustomName] = useState("")
	const [customCal, setCustomCal] = useState("")
	const [customProtein, setCustomProtein] = useState("")
	const [customCarbs, setCustomCarbs] = useState("")
	const [customFat, setCustomFat] = useState("")
	const [customQty, setCustomQty] = useState("100")

	const filtered = COMMON_FOODS.filter((f) =>
		f.name.toLowerCase().includes(search.toLowerCase())
	)

	const [selectedFood, setSelectedFood] = useState<typeof COMMON_FOODS[0] | null>(null)
	const [quantity, setQuantity] = useState("100")

	const handleAddSelected = () => {
		if (!selectedFood) return
		const q = Number(quantity) || 100
		const multiplier = q / 100
		addEntry({
			name: selectedFood.name,
			calories: selectedFood.cal * multiplier,
			protein: selectedFood.p * multiplier,
			carbs: selectedFood.c * multiplier,
			fat: selectedFood.f * multiplier,
			quantity: q,
			mealType,
			date,
		})
		onClose()
	}

	const handleAddCustom = () => {
		if (!customName) return
		addEntry({
			name: customName,
			calories: Number(customCal) || 0,
			protein: Number(customProtein) || 0,
			carbs: Number(customCarbs) || 0,
			fat: Number(customFat) || 0,
			quantity: Number(customQty) || 100,
			mealType,
			date,
		})
		onClose()
	}

	const MEAL_LABELS = { 1: "Breakfast", 2: "Lunch", 3: "Dinner", 4: "Snacks" } as const

	return (
		<div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
			<div className="bg-surface w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<h2 className="font-bold text-lg">Add to {MEAL_LABELS[mealType]}</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-white text-xl p-1">✕</button>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-gray-700">
					<button
						onClick={() => setTab("search")}
						className={`flex-1 py-3 text-sm font-medium transition ${
							tab === "search" ? "text-primary border-b-2 border-primary" : "text-gray-400"
						}`}
					>
						Search Food
					</button>
					<button
						onClick={() => setTab("custom")}
						className={`flex-1 py-3 text-sm font-medium transition ${
							tab === "custom" ? "text-primary border-b-2 border-primary" : "text-gray-400"
						}`}
					>
						Custom Entry
					</button>
				</div>

				<div className="overflow-y-auto flex-1 p-4">
					{tab === "search" && !selectedFood && (
						<>
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search foods..."
								className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none mb-3"
								autoFocus
							/>
							<div className="space-y-1">
								{filtered.map((food) => (
									<button
										key={food.name}
										onClick={() => setSelectedFood(food)}
										className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-bg-dark/50 transition text-left"
									>
										<div>
											<p className="text-sm font-medium">{food.name}</p>
											<p className="text-xs text-gray-500">P: {food.p}g  C: {food.c}g  F: {food.f}g</p>
										</div>
										<span className="text-sm text-primary font-medium">{food.cal} kcal</span>
									</button>
								))}
								{filtered.length === 0 && (
									<p className="text-center text-gray-500 py-4 text-sm">No foods found. Try custom entry.</p>
								)}
							</div>
						</>
					)}

					{tab === "search" && selectedFood && (
						<div className="space-y-4">
							<button onClick={() => setSelectedFood(null)} className="text-primary text-sm">&larr; Back to search</button>
							<div className="bg-bg-dark rounded-lg p-4 text-center">
								<h3 className="font-bold">{selectedFood.name}</h3>
								<p className="text-3xl font-bold text-primary mt-2">
									{Math.round(selectedFood.cal * (Number(quantity) || 100) / 100)} kcal
								</p>
								<p className="text-xs text-gray-400 mt-1">per {quantity || 100}g</p>
							</div>
							<div>
								<label className="block text-sm text-gray-400 mb-1">Quantity (g)</label>
								<input
									type="number"
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
								/>
							</div>
							<div className="grid grid-cols-3 gap-2 text-center text-sm">
								<div className="bg-bg-dark rounded-lg p-2">
									<p className="text-gray-400">Protein</p>
									<p className="font-bold">{(selectedFood.p * (Number(quantity) || 100) / 100).toFixed(1)}g</p>
								</div>
								<div className="bg-bg-dark rounded-lg p-2">
									<p className="text-gray-400">Carbs</p>
									<p className="font-bold">{(selectedFood.c * (Number(quantity) || 100) / 100).toFixed(1)}g</p>
								</div>
								<div className="bg-bg-dark rounded-lg p-2">
									<p className="text-gray-400">Fat</p>
									<p className="font-bold">{(selectedFood.f * (Number(quantity) || 100) / 100).toFixed(1)}g</p>
								</div>
							</div>
							<button
								onClick={handleAddSelected}
								className="w-full bg-primary text-bg-dark font-bold py-3 rounded-lg hover:opacity-90 transition"
							>
								Add to {MEAL_LABELS[mealType]}
							</button>
						</div>
					)}

					{tab === "custom" && (
						<div className="space-y-3">
							<div>
								<label className="block text-sm text-gray-400 mb-1">Food Name</label>
								<input
									type="text"
									value={customName}
									onChange={(e) => setCustomName(e.target.value)}
									placeholder="e.g. Homemade soup"
									className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
									autoFocus
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm text-gray-400 mb-1">Calories (kcal)</label>
									<input type="number" value={customCal} onChange={(e) => setCustomCal(e.target.value)} placeholder="0" className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
								</div>
								<div>
									<label className="block text-sm text-gray-400 mb-1">Quantity (g)</label>
									<input type="number" value={customQty} onChange={(e) => setCustomQty(e.target.value)} placeholder="100" className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-3">
								<div>
									<label className="block text-sm text-gray-400 mb-1">Protein (g)</label>
									<input type="number" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} placeholder="0" className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
								</div>
								<div>
									<label className="block text-sm text-gray-400 mb-1">Carbs (g)</label>
									<input type="number" value={customCarbs} onChange={(e) => setCustomCarbs(e.target.value)} placeholder="0" className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
								</div>
								<div>
									<label className="block text-sm text-gray-400 mb-1">Fat (g)</label>
									<input type="number" value={customFat} onChange={(e) => setCustomFat(e.target.value)} placeholder="0" className="w-full bg-bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
								</div>
							</div>
							<button
								onClick={handleAddCustom}
								disabled={!customName}
								className="w-full bg-primary text-bg-dark font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40"
							>
								Add to {MEAL_LABELS[mealType]}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
