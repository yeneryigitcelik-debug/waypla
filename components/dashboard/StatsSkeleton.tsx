export function StatsSkeleton() {
    return (
        <div className="bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
    );
}

export function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <StatsSkeleton key={i} />
            ))}
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <div className="bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            {[...Array(rows)].map((_, i) => (
                <TableRowSkeleton key={i} />
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
            <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
