import Link from "next/link";

interface StatsCardProps {
    href: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
    value: number | string;
    trend?: { value: number; isPositive: boolean };
}

export function StatsCard({
    href,
    icon,
    iconBg,
    iconColor,
    title,
    subtitle,
    value,
    trend
}: StatsCardProps) {
    return (
        <Link href={href} className="group">
            <div className="h-full bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-accent dark:hover:border-accent hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-accent group-hover:translate-x-1 transition-all">
                        arrow_forward
                    </span>
                </div>
                <h3 className="text-lg font-bold text-primary dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{subtitle}</p>
                <div className="flex items-end justify-between">
                    <p className="text-4xl font-black text-primary dark:text-white">{value}</p>
                    {trend && (
                        <span className={`text-sm font-bold flex items-center gap-1 ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                            <span className="material-symbols-outlined text-base">
                                {trend.isPositive ? "trending_up" : "trending_down"}
                            </span>
                            {trend.value}%
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
