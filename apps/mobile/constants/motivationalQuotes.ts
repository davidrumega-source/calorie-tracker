export const MOTIVATIONAL_QUOTES = [
	{
		text: "The only bad workout is the one that didn't happen.",
		author: "Unknown",
	},
	{
		text: "Take care of your body. It's the only place you have to live.",
		author: "Jim Rohn",
	},
	{
		text: "Success is the sum of small efforts repeated day in and day out.",
		author: "Robert Collier",
	},
	{
		text: "The secret of getting ahead is getting started.",
		author: "Mark Twain",
	},
	{
		text: "Don't stop when you're tired. Stop when you're done.",
		author: "Unknown",
	},
	{
		text: "Your body can stand almost anything. It's your mind that you have to convince.",
		author: "Unknown",
	},
	{
		text: "It does not matter how slowly you go as long as you do not stop.",
		author: "Confucius",
	},
	{
		text: "The pain you feel today will be the strength you feel tomorrow.",
		author: "Unknown",
	},
	{
		text: "A journey of a thousand miles begins with a single step.",
		author: "Lao Tzu",
	},
	{
		text: "You don't have to be great to start, but you have to start to be great.",
		author: "Zig Ziglar",
	},
	{
		text: "Discipline is choosing between what you want now and what you want most.",
		author: "Abraham Lincoln",
	},
	{
		text: "The body achieves what the mind believes.",
		author: "Napoleon Hill",
	},
	{
		text: "Small daily improvements are the key to staggering long-term results.",
		author: "Unknown",
	},
	{
		text: "Motivation is what gets you started. Habit is what keeps you going.",
		author: "Jim Ryun",
	},
	{
		text: "If it doesn't challenge you, it doesn't change you.",
		author: "Fred DeVito",
	},
	{
		text: "Strive for progress, not perfection.",
		author: "Unknown",
	},
	{
		text: "Health is not about the weight you lose, but about the life you gain.",
		author: "Unknown",
	},
	{
		text: "Every healthy meal is a vote for the body you want.",
		author: "Unknown",
	},
	{
		text: "Believe you can and you're halfway there.",
		author: "Theodore Roosevelt",
	},
	{
		text: "What you eat in private, you wear in public.",
		author: "Unknown",
	},
	{
		text: "Strength does not come from the body. It comes from the will.",
		author: "Unknown",
	},
	{
		text: "You are what you eat, so don't be fast, cheap, easy, or fake.",
		author: "Unknown",
	},
	{
		text: "The greatest wealth is health.",
		author: "Virgil",
	},
	{
		text: "Don't wish for it. Work for it.",
		author: "Unknown",
	},
	{
		text: "When you feel like quitting, think about why you started.",
		author: "Unknown",
	},
	{
		text: "A healthy outside starts from the inside.",
		author: "Robert Urich",
	},
	{
		text: "Fall seven times, stand up eight.",
		author: "Japanese Proverb",
	},
	{
		text: "Your health is an investment, not an expense.",
		author: "Unknown",
	},
	{
		text: "Push yourself, because no one else is going to do it for you.",
		author: "Unknown",
	},
	{
		text: "Champions keep playing until they get it right.",
		author: "Billie Jean King",
	},
	{
		text: "One workout at a time. One meal at a time. One day at a time.",
		author: "Unknown",
	},
]

export function getQuoteForDate(date: Date): (typeof MOTIVATIONAL_QUOTES)[0] {
	const dayOfYear = Math.floor(
		(date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
			(1000 * 60 * 60 * 24)
	)
	return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]
}
