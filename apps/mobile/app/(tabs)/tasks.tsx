import { Header } from "@/components/Header"
import { ThemedText } from "@/components/ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { borderRadius, paddingTopForHeader } from "@/constants/Theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import React, { useMemo, useState, useCallback } from "react"
import {
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Modal,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Pressable,
} from "react-native"

type Priority = "Urgent" | "Important" | "Normal" | "Optional"

interface Task {
	id: string
	title: string
	priority: Priority
	done: boolean
	createdAt: number
}

const PRIORITY_COLORS: Record<Priority, string> = {
	Urgent: "#EF4444",
	Important: "#F97316",
	Normal: "#5BBEF9",
	Optional: "#6B7280",
}

const PRIORITIES: Priority[] = ["Urgent", "Important", "Normal", "Optional"]

function TaskItem({
	task,
	onToggle,
	onDelete,
}: {
	task: Task
	onToggle: (id: string) => void
	onDelete: (id: string) => void
}) {
	const theme = useThemeColor()

	const styles = useMemo(
		() =>
			StyleSheet.create({
				row: {
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: theme.surface,
					borderRadius,
					padding: 14,
					marginBottom: 10,
					gap: 12,
				},
				checkbox: {
					width: 24,
					height: 24,
					borderRadius: 12,
					borderWidth: 2,
					borderColor: PRIORITY_COLORS[task.priority],
					alignItems: "center",
					justifyContent: "center",
				},
				checkboxDone: {
					backgroundColor: PRIORITY_COLORS[task.priority],
				},
				textContainer: {
					flex: 1,
				},
				titleDone: {
					textDecorationLine: "line-through",
					opacity: 0.5,
				},
				priorityBadge: {
					paddingHorizontal: 8,
					paddingVertical: 2,
					borderRadius: 99,
					backgroundColor: PRIORITY_COLORS[task.priority] + "33",
				},
				priorityText: {
					fontSize: 11,
					fontWeight: "600",
					color: PRIORITY_COLORS[task.priority],
				},
				deleteBtn: {
					padding: 4,
				},
			}),
		[theme, task.priority]
	)

	return (
		<View style={styles.row}>
			<TouchableOpacity
				style={[styles.checkbox, task.done && styles.checkboxDone]}
				onPress={() => onToggle(task.id)}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
			>
				{task.done && (
					<Ionicons name="checkmark" size={14} color="#fff" />
				)}
			</TouchableOpacity>
			<View style={styles.textContainer}>
				<ThemedText
					type="defaultSemiBold"
					style={task.done ? styles.titleDone : undefined}
				>
					{task.title}
				</ThemedText>
				<View style={[styles.priorityBadge, { marginTop: 4, alignSelf: "flex-start" }]}>
					<ThemedText style={styles.priorityText}>{task.priority}</ThemedText>
				</View>
			</View>
			<TouchableOpacity
				style={styles.deleteBtn}
				onPress={() => onDelete(task.id)}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
			>
				<Ionicons name="trash-outline" size={18} color={theme.error} />
			</TouchableOpacity>
		</View>
	)
}

export default function TasksScreen() {
	const theme = useThemeColor()
	const [tasks, setTasks] = useState<Task[]>([])
	const [modalVisible, setModalVisible] = useState(false)
	const [newTitle, setNewTitle] = useState("")
	const [newPriority, setNewPriority] = useState<Priority>("Normal")

	const styles = useMemo(
		() =>
			StyleSheet.create({
				container: {
					flex: 1,
					backgroundColor: theme.background,
				},
				list: {
					padding: 16,
					paddingTop: paddingTopForHeader,
					paddingBottom: 100,
				},
				empty: {
					alignItems: "center",
					marginTop: 60,
					gap: 8,
				},
				fab: {
					position: "absolute",
					bottom: 24,
					right: 24,
					width: 56,
					height: 56,
					borderRadius: 28,
					backgroundColor: theme.primary,
					alignItems: "center",
					justifyContent: "center",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.2,
					shadowRadius: 8,
					elevation: 6,
				},
				overlay: {
					flex: 1,
					backgroundColor: "#00000066",
					justifyContent: "flex-end",
				},
				sheet: {
					backgroundColor: theme.surface,
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					padding: 24,
					gap: 16,
				},
				sheetTitle: {
					fontSize: 18,
					fontWeight: "700",
					color: theme.text,
					marginBottom: 4,
				},
				input: {
					backgroundColor: theme.onSurface,
					borderRadius,
					padding: 14,
					fontSize: 16,
					color: theme.text,
				},
				priorityRow: {
					flexDirection: "row",
					gap: 8,
					flexWrap: "wrap",
				},
				priorityChip: {
					paddingHorizontal: 14,
					paddingVertical: 8,
					borderRadius: 99,
					borderWidth: 1.5,
				},
				addBtn: {
					backgroundColor: theme.primary,
					borderRadius,
					padding: 16,
					alignItems: "center",
					marginTop: 4,
				},
				addBtnText: {
					color: "#fff",
					fontWeight: "700",
					fontSize: 16,
				},
				cancelBtn: {
					alignItems: "center",
					padding: 12,
				},
			}),
		[theme]
	)

	const toggleTask = useCallback((id: string) => {
		setTasks((prev) =>
			prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
		)
	}, [])

	const deleteTask = useCallback((id: string) => {
		setTasks((prev) => prev.filter((t) => t.id !== id))
	}, [])

	const addTask = useCallback(() => {
		const trimmed = newTitle.trim()
		if (!trimmed) return
		setTasks((prev) => [
			{
				id: Date.now().toString(),
				title: trimmed,
				priority: newPriority,
				done: false,
				createdAt: Date.now(),
			},
			...prev,
		])
		setNewTitle("")
		setNewPriority("Normal")
		setModalVisible(false)
	}, [newTitle, newPriority])

	const renderItem = useCallback(
		({ item }: { item: Task }) => (
			<TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
		),
		[toggleTask, deleteTask]
	)

	const pending = tasks.filter((t) => !t.done).length
	const headerTitle = pending > 0 ? `Tasks (${pending} left)` : "Tasks"

	return (
		<View style={styles.container}>
			<Header title={headerTitle} />
			<FlatList
				data={tasks}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				renderItem={renderItem}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Ionicons
							name="checkmark-done-circle-outline"
							size={48}
							color={theme.primary}
						/>
						<ThemedText type="subtitleLight">
							No tasks yet. Tap + to add one!
						</ThemedText>
					</View>
				}
			/>

			<TouchableOpacity
				style={styles.fab}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.85}
			>
				<Ionicons name="add" size={32} color="#fff" />
			</TouchableOpacity>

			<Modal
				visible={modalVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setModalVisible(false)}
			>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<Pressable
						style={styles.overlay}
						onPress={() => setModalVisible(false)}
					>
						<Pressable onPress={(e) => e.stopPropagation()}>
							<View style={styles.sheet}>
								<ThemedText style={styles.sheetTitle}>New Task</ThemedText>

								<TextInput
									style={styles.input}
									placeholder="What do you need to do?"
									placeholderTextColor={theme.text + "66"}
									value={newTitle}
									onChangeText={setNewTitle}
									autoFocus
									returnKeyType="done"
									onSubmitEditing={addTask}
								/>

								<View style={styles.priorityRow}>
									{PRIORITIES.map((p) => (
										<TouchableOpacity
											key={p}
											style={[
												styles.priorityChip,
												{
													borderColor: PRIORITY_COLORS[p],
													backgroundColor:
														newPriority === p
															? PRIORITY_COLORS[p] + "33"
															: "transparent",
												},
											]}
											onPress={() => setNewPriority(p)}
										>
											<ThemedText
												style={{
													color: PRIORITY_COLORS[p],
													fontWeight: "600",
													fontSize: 13,
												}}
											>
												{p}
											</ThemedText>
										</TouchableOpacity>
									))}
								</View>

								<TouchableOpacity
									style={[
										styles.addBtn,
										!newTitle.trim() && { opacity: 0.5 },
									]}
									onPress={addTask}
									disabled={!newTitle.trim()}
								>
									<ThemedText style={styles.addBtnText}>
										Add Task
									</ThemedText>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.cancelBtn}
									onPress={() => setModalVisible(false)}
								>
									<ThemedText type="subtitleLight">Cancel</ThemedText>
								</TouchableOpacity>
							</View>
						</Pressable>
					</Pressable>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	)
}
