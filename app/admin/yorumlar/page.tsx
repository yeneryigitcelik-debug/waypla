"use client";

import { useEffect, useState } from "react";
import {
    Star,
    Check,
    X,
    Trash2,
    Search,
    Filter,
    Loader2,
    User,
    Clock,
} from "lucide-react";

// Review type
interface Review {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    rating: number;
    comment: string;
    isPublished: boolean;
    createdAt: string;
}

// Star rating display
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                />
            ))}
        </div>
    );
}

// Status filter options
const statusFilters = [
    { value: "all", label: "Tümü" },
    { value: "pending", label: "Bekleyenler" },
    { value: "published", label: "Yayındakiler" },
];

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Load reviews
    useEffect(() => {
        const loadReviews = async () => {
            try {
                const response = await fetch("/api/admin/reviews");
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                } else {
                    // Demo data
                    setReviews([
                        {
                            id: "1",
                            userId: "u1",
                            userName: "Ahmet Yılmaz",
                            userEmail: "ahmet@example.com",
                            rating: 5,
                            comment: "Müthiş bir hizmet! iPhone'um ekran kırığıyla gittiğinde 2 gün içinde orijinal parça ile tamir edildi. Kesinlikle tavsiye ederim.",
                            isPublished: true,
                            createdAt: "2024-01-15T10:30:00Z",
                        },
                        {
                            id: "2",
                            userId: "u2",
                            userName: "Zeynep Kaya",
                            userEmail: "zeynep@example.com",
                            rating: 4,
                            comment: "Hasar süreci çok hızlı işledi. Tek eksik, başvuru formunda daha fazla açıklama olabilirdi.",
                            isPublished: false,
                            createdAt: "2024-01-14T14:20:00Z",
                        },
                        {
                            id: "3",
                            userId: "u3",
                            userName: "Mehmet Demir",
                            userEmail: "mehmet@example.com",
                            rating: 5,
                            comment: "MacBook'um su hasarından sonra 3 gün içinde teslim edildi. Harika!",
                            isPublished: false,
                            createdAt: "2024-01-13T09:15:00Z",
                        },
                        {
                            id: "4",
                            userId: "u4",
                            userName: "Elif Çelik",
                            userEmail: "elif@example.com",
                            rating: 3,
                            comment: "Servis süresi biraz uzun sürdü ama sonuç tatmin edici.",
                            isPublished: true,
                            createdAt: "2024-01-12T16:45:00Z",
                        },
                        {
                            id: "5",
                            userId: "u5",
                            userName: "Can Öztürk",
                            userEmail: "can@example.com",
                            rating: 5,
                            comment: "Fiyat/performans oranı çok iyi. Garanti uzatma paketi aldım ve memnunum.",
                            isPublished: false,
                            createdAt: "2024-01-11T11:00:00Z",
                        },
                    ]);
                }
            } catch {
                // Demo data on error
                setReviews([
                    {
                        id: "1",
                        userId: "u1",
                        userName: "Ahmet Yılmaz",
                        userEmail: "ahmet@example.com",
                        rating: 5,
                        comment: "Müthiş bir hizmet! iPhone'um ekran kırığıyla gittiğinde 2 gün içinde orijinal parça ile tamir edildi.",
                        isPublished: true,
                        createdAt: "2024-01-15T10:30:00Z",
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        loadReviews();
    }, []);

    // Filter reviews
    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "pending" && !review.isPublished) ||
            (statusFilter === "published" && review.isPublished);

        return matchesSearch && matchesStatus;
    });

    // Approve review
    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setReviews(reviews.map(r =>
                r.id === id ? { ...r, isPublished: true } : r
            ));
        } catch (error) {
            console.error("Approve error:", error);
        } finally {
            setProcessingId(null);
        }
    };

    // Reject review (unpublish)
    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setReviews(reviews.map(r =>
                r.id === id ? { ...r, isPublished: false } : r
            ));
        } catch (error) {
            console.error("Reject error:", error);
        } finally {
            setProcessingId(null);
        }
    };

    // Delete review
    const handleDelete = async (id: string) => {
        if (!confirm("Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?")) return;

        setProcessingId(id);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setReviews(reviews.filter(r => r.id !== id));
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setProcessingId(null);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Stats
    const pendingCount = reviews.filter(r => !r.isPublished).length;
    const publishedCount = reviews.filter(r => r.isPublished).length;
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Yorum Yönetimi</h2>
                <p className="text-gray-500 mt-1">
                    Kullanıcı yorumlarını inceleyin ve yayınlayın
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ortalama Puan</p>
                            <p className="text-xl font-bold text-gray-900">{avgRating}/5</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Onay Bekleyenler</p>
                            <p className="text-xl font-bold text-orange-600">{pendingCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Yayındakiler</p>
                            <p className="text-xl font-bold text-green-600">{publishedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Yorum veya kullanıcı ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {statusFilters.map((filter) => (
                            <option key={filter.value} value={filter.value}>
                                {filter.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <div
                        key={review.id}
                        className={`bg-white rounded-xl border p-6 transition-all ${review.isPublished
                                ? "border-gray-200"
                                : "border-orange-200 bg-orange-50/50"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* User avatar */}
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-gray-400" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5">{review.userEmail}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!review.isPublished && (
                                            <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                                Onay Bekliyor
                                            </span>
                                        )}
                                        <span className="text-sm text-gray-400">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>

                                <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4">
                                    {!review.isPublished ? (
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            disabled={processingId === review.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {processingId === review.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            )}
                                            <span>Onayla</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleReject(review.id)}
                                            disabled={processingId === review.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            {processingId === review.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <X className="w-4 h-4" />
                                            )}
                                            <span>Yayından Kaldır</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        disabled={processingId === review.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Sil</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredReviews.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">Yorum bulunamadı</p>
                    </div>
                )}
            </div>
        </div>
    );
}
