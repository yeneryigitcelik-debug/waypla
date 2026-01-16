"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CatalogDevice {
    id: string;
    brand: string;
    model: string;
    storage: string | null;
    category: string;
    marketPrice: number;
    releaseYear: number | null;
    isActive: boolean;
}

const categoryLabels: Record<string, string> = {
    phone: "Telefon",
    laptop: "Laptop",
    tablet: "Tablet",
    watch: "Akıllı Saat",
    console: "Oyun Konsolu",
};

export default function AdminDevicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [devices, setDevices] = useState<CatalogDevice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingDevice, setEditingDevice] = useState<CatalogDevice | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        storage: "",
        category: "phone",
        marketPrice: "",
        releaseYear: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/giris");
        } else if (session?.user.role !== "ADMIN") {
            router.push("/hesabim");
        }
    }, [status, session, router]);

    useEffect(() => {
        loadDevices();
    }, [selectedCategory, selectedBrand]);

    const loadDevices = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory) params.set("category", selectedCategory);
            if (selectedBrand) params.set("brand", selectedBrand);
            params.set("limit", "100");

            const res = await fetch(`/api/catalog?${params}`);
            const data = await res.json();
            if (data.success) {
                setDevices(data.data);
            }
        } catch (error) {
            console.error("Error loading devices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { createCatalogDevice } = await import("@/actions/catalog");
            await createCatalogDevice({
                brand: formData.brand,
                model: formData.model,
                storage: formData.storage || undefined,
                category: formData.category,
                marketPrice: parseFloat(formData.marketPrice),
                releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : undefined,
            });
            setShowAddForm(false);
            setFormData({ brand: "", model: "", storage: "", category: "phone", marketPrice: "", releaseYear: "" });
            loadDevices();
        } catch (error) {
            console.error("Error adding device:", error);
            alert("Cihaz eklenirken hata oluştu");
        }
    };

    const handleUpdatePrice = async (id: string, newPrice: number) => {
        try {
            const { updateCatalogDevice } = await import("@/actions/catalog");
            await updateCatalogDevice({ id, marketPrice: newPrice });
            loadDevices();
        } catch (error) {
            console.error("Error updating price:", error);
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            const { toggleDeviceStatus } = await import("@/actions/catalog");
            await toggleDeviceStatus(id);
            loadDevices();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        return null;
    }

    const uniqueBrands = [...new Set(devices.map(d => d.brand))].sort();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111418]">
            {/* Header */}
            <header className="bg-white dark:bg-[#1a2634] border-b border-gray-200 dark:border-gray-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/admin" className="text-sm text-gray-500 hover:text-accent flex items-center gap-1 mb-2">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Admin Panel
                            </Link>
                            <h1 className="text-2xl font-bold text-primary dark:text-white">Cihaz Kataloğu</h1>
                            <p className="text-sm text-gray-500 mt-1">Sistemdeki cihazları ve fiyatlarını yönetin</p>
                        </div>
                        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Yeni Cihaz
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-10 px-4 rounded-lg bg-white dark:bg-[#1a2634] border border-gray-200 dark:border-gray-700 text-sm"
                    >
                        <option value="">Tüm Kategoriler</option>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="h-10 px-4 rounded-lg bg-white dark:bg-[#1a2634] border border-gray-200 dark:border-gray-700 text-sm"
                    >
                        <option value="">Tüm Markalar</option>
                        {uniqueBrands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <div className="flex-1"></div>
                    <div className="text-sm text-gray-500 flex items-center">
                        Toplam: <strong className="ml-1">{devices.length}</strong> cihaz
                    </div>
                </div>

                {/* Add Device Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle>Yeni Cihaz Ekle</CardTitle>
                                <CardDescription>Sisteme yeni bir cihaz tanımlayın</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddDevice} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Marka</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#22303e]"
                                                placeholder="Apple"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Model</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.model}
                                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#22303e]"
                                                placeholder="iPhone 15 Pro"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Depolama (Opsiyonel)</label>
                                            <input
                                                type="text"
                                                value={formData.storage}
                                                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#22303e]"
                                                placeholder="256GB"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Kategori</label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#22303e]"
                                            >
                                                {Object.entries(categoryLabels).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Piyasa Fiyatı (TRY)</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.marketPrice}
                                                onChange={(e) => setFormData({ ...formData, marketPrice: e.target.value })}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#22303e]"
                                                placeholder="75000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Çıkış Yılı</label>
                                            <input
                                                type="number"
                                                value={formData.releaseYear}
                                                onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#22303e]"
                                                placeholder="2024"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                                            İptal
                                        </Button>
                                        <Button type="submit" className="flex-1">
                                            Ekle
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Device List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
                    </div>
                ) : devices.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-800">
                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">devices</span>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Cihaz bulunamadı</h3>
                        <p className="text-sm text-gray-500 mt-1">Kataloğa yeni cihaz ekleyin</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-[#22303e]">
                                <tr>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Cihaz</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Kategori</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Fiyat</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Yıl</th>
                                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Durum</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {devices.map((device) => (
                                    <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{device.brand} {device.model}</p>
                                                {device.storage && <p className="text-xs text-gray-500">{device.storage}</p>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                                                {categoryLabels[device.category] || device.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingDevice?.id === device.id ? (
                                                <input
                                                    type="number"
                                                    defaultValue={device.marketPrice}
                                                    className="w-28 h-8 px-2 text-sm border rounded"
                                                    onBlur={(e) => {
                                                        handleUpdatePrice(device.id, parseFloat(e.target.value));
                                                        setEditingDevice(null);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleUpdatePrice(device.id, parseFloat((e.target as HTMLInputElement).value));
                                                            setEditingDevice(null);
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => setEditingDevice(device)}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-accent"
                                                >
                                                    {formatPrice(device.marketPrice)}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {device.releaseYear || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(device.id)}
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${device.isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}
                                            >
                                                {device.isActive ? "Aktif" : "Pasif"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-accent">
                                                <span className="material-symbols-outlined text-lg">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
