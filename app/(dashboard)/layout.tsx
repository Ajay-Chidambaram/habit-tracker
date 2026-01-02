import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SWRProvider } from "@/lib/swr-config"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SWRProvider>
      <div className="flex h-screen bg-bg-base text-text-primary overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
          <MobileNav />
        </div>
      </div>
    </SWRProvider>
  )
}
