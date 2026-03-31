import React, { useMemo } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { borderRadius } from "@/constants/Theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { DailyTask } from "@/hooks/useDailyTasks"
import * as Haptics from "expo-haptics"

interface DailyTasksCardProps {
	tasks: DailyTask[]
	completedCount: number
	totalCount: number
	onToggle: (taskId: number) => void
}

export const DailyTasksCard = ({
	tasks,
	completedCount,
	totalCount,
	onToggle,
}: DailyTasksCardProps) => {
	const theme = useThemeColor()

	const progress = totalCount > 0 ? completedCount / totalCount : 0

	const styles = useMemo(
		() =>
			StyleSheet.create({
				wrapper: {
					width: "100%",
					marginTop: 32,
				},
				headerRow: {
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 8,
				},
				card: {
					width: "100%",
					backgroundColor: theme.surface,
					borderRadius: borderRadius,
					padding: 16,
				},
				progressBarBg: {
					width: "100%",
					height: 6,
					backgroundColor: theme.onSurface,
					borderRadius: 3,
					marginBottom: 16,
				},
				progressBarFill: {
					height: 6,
					backgroundColor: theme.success,
					borderRadius: 3,
					width: `${Math.round(progress * 100)}%`,
				},
				taskRow: {
					flexDirection: "row",
					alignItems: "center",
					paddingVertical: 10,
					gap: 12,
				},
				separator: {
					height: 1,
					backgroundColor: theme.onSurface,
				},
				checkCircle: {
					width: 28,
					height: 28,
					borderRadius: 14,
					borderWidth: 2,
					alignItems: "center",
					justifyContent: "center",
				},
				taskTextContainer: {
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					gap: 8,
				},
			}),
		[theme, progress]
	)

	const handleToggle = (taskId: number) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		onToggle(taskId)
	}

	return (
		<View style={styles.wrapper}>
			<View style={styles.headerRow}>
				<ThemedText type="default">Daily Tasks</ThemedText>
				<ThemedText type="subtitleLight">
					{completedCount}/{totalCount}
				</ThemedText>
			</View>
			<View style={styles.card}>
				<View style={styles.progressBarBg}>
					<View style={styles.progressBarFill} />
				</View>
				{tasks.map((task, index) => (
					<React.Fragment key={task.id}>
						{index > 0 && <View style={styles.separator} />}
						<TouchableOpacity
							style={styles.taskRow}
							onPress={() => handleToggle(task.id)}
							activeOpacity={0.6}
						>
							<View
								style={[
									styles.checkCircle,
									{
										borderColor: task.completed
											? theme.success
											: theme.onSurface,
										backgroundColor: task.completed
											? theme.success
											: "transparent",
									},
								]}
							>
								{task.completed && (
									<Ionicons
										name="checkmark"
										size={16}
										color="#FFFFFF"
									/>
								)}
							</View>
							<View style={styles.taskTextContainer}>
								<Ionicons
									name={task.icon as any}
									size={18}
									color={
										task.completed
											? theme.success
											: theme.text
									}
								/>
								<ThemedText
									type="subtitleBold"
									style={{
										opacity: task.completed ? 0.5 : 1,
										textDecorationLine: task.completed
											? "line-through"
											: "none",
									}}
								>
									{task.title}
								</ThemedText>
							</View>
						</TouchableOpacity>
					</React.Fragment>
				))}
			</View>
		</View>
	)
}
