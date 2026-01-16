/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import * as PDF from '@react-pdf/renderer';

// Define styles
const styles = PDF.StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#111418',
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#0a3d62',
        paddingBottom: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0a3d62',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111418',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0a3d62',
        marginBottom: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    label: {
        width: '40%',
        color: '#64748b',
    },
    value: {
        width: '60%',
        fontWeight: 'bold',
    },
    highlight: {
        backgroundColor: '#fff7ed',
        padding: 12,
        borderRadius: 4,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#f97316',
    },
    highlightText: {
        fontSize: 11,
        color: '#c2410c',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    },
    footerText: {
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'center',
    },
});

export interface PolicyScheduleData {
    policyId: string;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    userName: string;
    userEmail: string;
    userPhone?: string;
    userAddress?: string;
    deviceBrand: string;
    deviceModel: string;
    deviceCategory: string;
    deviceValue: number;
    serialNumber?: string;
    purchaseDate?: Date;
    planName: string;
    coverageType: string;
    premium: number;
    paymentMode: 'subscription' | 'one_time';
    deductible?: number;
    maxClaims?: number;
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(date);
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        phone: 'Akıllı Telefon',
        laptop: 'Laptop',
        tablet: 'Tablet',
        watch: 'Akıllı Saat',
        console: 'Oyun Konsolu',
        other: 'Diğer',
    };
    return labels[category] || category;
}

function getCoverageLabel(type: string): string {
    const labels: Record<string, string> = {
        EXTENDED_WARRANTY: 'Uzatılmış Garanti',
        ACCIDENTAL_DAMAGE: 'Kazaen Hasar',
        FULL_COVERAGE: 'Tam Koruma',
        THEFT_LOSS: 'Hırsızlık',
    };
    return labels[type] || type;
}

// Helper to create elements without JSX
const h = React.createElement;

function createPolicyScheduleDocument(data: PolicyScheduleData): React.ReactElement {
    const { Document, Page, Text, View } = PDF;

    return h(Document, null,
        h(Page, { size: 'A4', style: styles.page },
            // Header
            h(View, { style: styles.header },
                h(Text, { style: styles.logo }, 'WAYPLA'),
                h(Text, { style: styles.subtitle }, 'Elektronik Cihaz Koruma Platformu')
            ),
            // Title
            h(Text, { style: styles.title }, 'POLİÇE ÇİZELGESİ'),
            // Policy Info
            h(View, { style: styles.section },
                h(Text, { style: styles.sectionTitle }, 'Poliçe Bilgileri'),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Poliçe Numarası'),
                    h(Text, { style: styles.value }, data.policyId)
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Düzenleme Tarihi'),
                    h(Text, { style: styles.value }, formatDate(data.createdAt))
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Başlangıç Tarihi'),
                    h(Text, { style: styles.value }, formatDate(data.startDate))
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Bitiş Tarihi'),
                    h(Text, { style: styles.value }, formatDate(data.endDate))
                )
            ),
            // User Info
            h(View, { style: styles.section },
                h(Text, { style: styles.sectionTitle }, 'Sigortalı Bilgileri'),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Ad Soyad'),
                    h(Text, { style: styles.value }, data.userName)
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'E-posta'),
                    h(Text, { style: styles.value }, data.userEmail)
                )
            ),
            // Device Info
            h(View, { style: styles.section },
                h(Text, { style: styles.sectionTitle }, 'Cihaz Bilgileri'),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Cihaz Tipi'),
                    h(Text, { style: styles.value }, getCategoryLabel(data.deviceCategory))
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Marka / Model'),
                    h(Text, { style: styles.value }, `${data.deviceBrand} ${data.deviceModel}`)
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Cihaz Bedeli'),
                    h(Text, { style: styles.value }, formatCurrency(data.deviceValue))
                )
            ),
            // Plan Info
            h(View, { style: styles.section },
                h(Text, { style: styles.sectionTitle }, 'Teminat Bilgileri'),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Plan'),
                    h(Text, { style: styles.value }, data.planName)
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Teminat Türü'),
                    h(Text, { style: styles.value }, getCoverageLabel(data.coverageType))
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Prim'),
                    h(Text, { style: styles.value }, formatCurrency(data.premium))
                ),
                h(View, { style: styles.row },
                    h(Text, { style: styles.label }, 'Ödeme Şekli'),
                    h(Text, { style: styles.value }, data.paymentMode === 'subscription' ? 'Aylık Abonelik' : 'Tek Seferlik')
                )
            ),
            // Important Notice
            h(View, { style: styles.highlight },
                h(Text, { style: styles.highlightText },
                    'Hasar durumunda hesabınızdan online başvuru yapabilir veya 0216 555 00 00 numaralı destek hattımızı arayabilirsiniz.'
                )
            ),
            // Footer
            h(View, { style: styles.footer },
                h(Text, { style: styles.footerText },
                    `Bu belge ${formatDate(new Date())} tarihinde Waypla tarafından otomatik olarak oluşturulmuştur.`
                ),
                h(Text, { style: styles.footerText },
                    'Waypla Elektronik Cihaz Koruma Hizmetleri | www.waypla.com | destek@waypla.com'
                )
            )
        )
    );
}

/**
 * Generate a Policy Schedule PDF as a Buffer
 */
export async function generatePolicySchedulePDF(data: PolicyScheduleData): Promise<Buffer> {
    const document = createPolicyScheduleDocument(data);
    const pdfBuffer = await renderToBuffer(document as any);
    return pdfBuffer;
}

/**
 * Generate a Policy Schedule PDF and return as base64 string
 */
export async function generatePolicyScheduleBase64(data: PolicyScheduleData): Promise<string> {
    const buffer = await generatePolicySchedulePDF(data);
    return buffer.toString('base64');
}
