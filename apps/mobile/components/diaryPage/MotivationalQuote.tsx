import React, { useMemo } from "react"
import { View, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { borderRadius } from "@/constants/Theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { getQuoteForDate } from "@/constants/motivationalQuotes"

interface MotivationalQuoteProps {
	date: Date
}

export const MotivationalQuote = ({ date }: MotivationalQuoteProps) => {
	const theme = useThemeColor()
	const quote = useMemo(() => getQuoteForDate(date), [date])

	const styles = useMemo(
		() =>
			StyleSheet.create({
				wrapper: {
					width: "100%",
					marginTop: 16,
				},
				card: {
					width: "100%",
					backgroundColor: theme.surface,
					borderRadius: borderRadius,
					padding: 16,
					flexDirection: "row",
					alignItems: "flex-start",
					gap: 12,
					borderLeftWidth: 3,
					borderLeftColor: theme.primary,
				},
				textContainer: {
					flex: 1,
				},
				quoteText: {
					fontStyle: "italic",
					lineHeight: 22,
				},
				authorText: {
					marginTop: 8,
					opacity: 0.6,
				},
			}),
		[theme]
	)

	return (
		<View style={styles.wrapper}>
			<View style={styles.card}>
				<Ionicons
					name="flame-outline"
					size={22}
					color={theme.primary}
					style={{ marginTop: 2 }}
				/>
				<View style={styles.textContainer}>
					<ThemedText type="default" style={styles.quoteText}>
						"{quote.text}"
					</ThemedText>
					<ThemedText type="subtitleLight" style={styles.authorText}>
						- {quote.author}
					</ThemedText>
				</View>
			</View>
		</View>
	)
}
