"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Search,
    Shield,
    AlertTriangle,
    Clock,
    Loader2,
} from "lucide-react";

// Plan type
interface Plan {
    id: string;
    slug: string;
    name: string;
    description: string;
    coverageType: string;
    termType: string;
    basePrice: number;
    isActive: boolean;
}

// Coverage type display
const coverageLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    EXTENDED_WARRANTY: { label: "Uzatılmış Garanti", color: "bg-blue-100 text-blue-700", icon: Clock },
    ACCIDENTAL_DAMAGE: { label: "Kazaen Hasar", color: "bg-orange-100 text-orange-700", icon: AlertTriangle },
    FULL_COVERAGE: { label: "Tam Koruma", color: "bg-green-100 text-green-700", icon: Shield },
    THEFT_LOSS: { label: "Hırsızlık-Kayıp", color: "bg-red-100 text-red-700", icon: AlertTriangle },
};

// Modal component
function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        coverageType: "EXTENDED_WARRANTY",
        termType: "YEARLY",
        basePrice: 0,
        isActive: true,
    });

    // Load plans
    useEffect(() => {
        const loadPlans = async () => {
            try {
                const response = await fetch("/api/admin/plans");
                if (response.ok) {
                    const data = await response.json();
                    setPlans(data);
                } else {
                    // Use demo data if API not ready
                    setPlans([
                        { id: "1", slug: "uzatilmis-garanti", name: "Uzatılmış Garanti", description: "Garanti süresini uzatın", coverageType: "EXTENDED_WARRANTY", termType: "YEARLY", basePrice: 1000, isActive: true },
                        { id: "2", slug: "kazaen-hasar", name: "Kazaen Hasar", description: "Kazaya karşı koruma", coverageType: "ACCIDENTAL_DAMAGE", termType: "YEARLY", basePrice: 1500, isActive: true },
                        { id: "3", slug: "tam-koruma", name: "Tam Koruma", description: "Kapsamlı koruma paketi", coverageType: "FULL_COVERAGE", termType: "YEARLY", basePrice: 2000, isActive: true },
                        { id: "4", slug: "hirsizlik-kayip", name: "Hırsızlık-Kayıp", description: "Hırsızlık ve kayıp teminatı", coverageType: "THEFT_LOSS", termType: "YEARLY", basePrice: 1800, isActive: false },
                    ]);
                }
            } catch {
                // Use demo data on error
                setPlans([
                    { id: "1", slug: "uzatilmis-garanti", name: "Uzatılmış Garanti", description: "Garanti süresini uzatın", coverageType: "EXTENDED_WARRANTY", termType: "YEARLY", basePrice: 1000, isActive: true },
                    { id: "2", slug: "kazaen-hasar", name: "Kazaen Hasar", description: "Kazaya karşı koruma", coverageType: "ACCIDENTAL_DAMAGE", termType: "YEARLY", basePrice: 1500, isActive: true },
                    { id: "3", slug: "tam-koruma", name: "Tam Koruma", description: "Kapsamlı koruma paketi", coverageType: "FULL_COVERAGE", termType: "YEARLY", basePrice: 2000, isActive: true },
                    { id: "4", slug: "hirsizlik-kayip", name: "Hırsızlık-Kayıp", description: "Hırsızlık ve kayıp teminatı", coverageType: "THEFT_LOSS", termType: "YEARLY", basePrice: 1800, isActive: false },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        loadPlans();
    }, []);

    // Filter plans
    const filteredPlans = plans.filter(
        (plan) =>
            plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Open modal for new plan
    const handleAddNew = () => {
        setEditingPlan(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            coverageType: "EXTENDED_WARRANTY",
            termType: "YEARLY",
            basePrice: 0,
            isActive: true,
        });
        setIsModalOpen(true);
    };

    // Open modal for editing
    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            slug: plan.slug,
            description: plan.description,
            coverageType: plan.coverageType,
            termType: plan.termType,
            basePrice: plan.basePrice,
            isActive: plan.isActive,
        });
        setIsModalOpen(true);
    };

    // Save plan
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Implement actual API call
            if (editingPlan) {
                // Update existing
                setPlans(plans.map(p =>
                    p.id === editingPlan.id
                        ? { ...p, ...formData }
                        : p
                ));
            } else {
                // Create new
                const newPlan: Plan = {
                    id: Date.now().toString(),
                    ...formData,
                };
                setPlans([...plans, newPlan]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Delete plan
    const handleDelete = async (id: string) => {
        if (!confirm("Bu planı silmek istediğinize emin misiniz?")) return;

        try {
            // TODO: Implement actual API call
            setPlans(plans.filter(p => p.id !== id));
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // Toggle status
    const handleToggleStatus = async (id: string) => {
        setPlans(plans.map(p =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
        ));
    };

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sigorta Planları</h2>
                    <p className="text-gray-500 mt-1">
                        Toplam {plans.length} plan • {plans.filter(p => p.isActive).length} aktif
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Yeni Plan</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Plan ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teminat Türü</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fiyat</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPlans.map((plan) => {
                            const coverage = coverageLabels[plan.coverageType] || { label: plan.coverageType, color: "bg-gray-100 text-gray-700", icon: Shield };
                            const Icon = coverage.icon;

                            return (
                                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{plan.name}</p>
                                            <p className="text-sm text-gray-500">{plan.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${coverage.color}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                            {coverage.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">₺{plan.basePrice.toLocaleString("tr-TR")}</span>
                                        <span className="text-gray-500 text-sm">/yıl</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(plan.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${plan.isActive
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                        >
                                            {plan.isActive ? "Aktif" : "Pasif"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(plan)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredPlans.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Plan bulunamadı</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPlan ? "Planı Düzenle" : "Yeni Plan Ekle"}
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Adı</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teminat Türü</label>
                            <select
                                value={formData.coverageType}
                                onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="EXTENDED_WARRANTY">Uzatılmış Garanti</option>
                                <option value="ACCIDENTAL_DAMAGE">Kazaen Hasar</option>
                                <option value="FULL_COVERAGE">Tam Koruma</option>
                                <option value="THEFT_LOSS">Hırsızlık-Kayıp</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Süre</label>
                            <select
                                value={formData.termType}
                                onChange={(e) => setFormData({ ...formData, termType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="MONTHLY">Aylık</option>
                                <option value="YEARLY">Yıllık</option>
                                <option value="ONE_TIME">Tek Seferlik</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temel Fiyat (₺)</label>
                        <input
                            type="number"
                            value={formData.basePrice}
                            onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
