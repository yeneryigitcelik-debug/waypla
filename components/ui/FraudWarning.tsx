"use client";

import { AlertTriangle } from "lucide-react";

interface FraudWarningProps {
    declaredValue: number;
    className?: string;
}

/**
 * Fraud prevention warning component
 * Shown when user declares their own device value
 */
export function FraudWarning({ declaredValue, className = "" }: FraudWarningProps) {
    const formattedValue = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
    }).format(declaredValue);

    return (
        <div className={`bg-amber-50 border border-amber-200 rounded-xl p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-amber-800 mb-1">
                        Önemli Bilgilendirme
                    </h4>
                    <p className="text-sm text-amber-700 leading-relaxed">
                        Beyan ettiğiniz cihaz değeri: <strong>{formattedValue}</strong>
                    </p>
                    <p className="text-sm text-amber-700 leading-relaxed mt-2">
                        Hasar durumunda, ödeme tutarı <strong>cihazın hasar anındaki güncel piyasa değerini</strong> geçemez.
                        Yüksek beyan, sadece prim tutarını artırır; hasar ödemesi gerçek değer üzerinden hesaplanır.
                    </p>
                    <p className="text-xs text-amber-600 mt-3 font-medium">
                        💡 Doğru beyan, hem sizi hem bizi korur.
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Simple fraud notice for forms
 */
export function FraudNotice() {
    return (
        <p className="text-xs text-gray-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Hasar ödemesi, cihazın piyasa değerini geçmez.</span>
        </p>
    );
}
