"use client"

import { AppProvider, useApp } from "../context/AppContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

function AuthGuard({ children }: { children: React.ReactNode }) {
	const { profile } = useApp()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		if (!profile.onboardingComplete && pathname !== "/tracker/setup") {
			router.replace("/tracker/setup")
		}
	}, [profile.onboardingComplete, pathname, router])

	return <>{children}</>
}

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
	return (
		<AppProvider>
			<AuthGuard>
				<div className="min-h-screen bg-bg-dark text-white">
					{children}
				</div>
			</AuthGuard>
		</AppProvider>
	)
}
