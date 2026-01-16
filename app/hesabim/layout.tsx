import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#101822]">
            <DashboardSidebar />
            <main className="flex-1 min-h-screen">
                {children}
            </main>
        </div>
    );
}
