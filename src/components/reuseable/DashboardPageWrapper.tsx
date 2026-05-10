import { ReactNode } from "react"

export default function DashboardPageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}
