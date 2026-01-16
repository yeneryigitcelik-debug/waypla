/**
 * Landing Page Content Configuration
 * 
 * This file contains all marketing content for the landing page,
 * enabling easy i18n/CMS integration in the future.
 */

export const landingContent = {
    hero: {
        badge: 'waypla güvencesiyle',
        title: 'Teknolojini',
        titleAccent: 'sigortala.',
        description: 'Cihazın güvende, hasar süreci de öyle. waypla ile Türkiye\'nin en kapsamlı elektronik cihaz koruma platformunu keşfedin.',
        ctaButton: 'Hemen Teklif Gör',
        badges: [
            { icon: 'check_circle', text: 'Anında Onay' },
            { icon: 'check_circle', text: '7/24 Destek' },
            { icon: 'check_circle', text: 'Orijinal Parça' },
        ],
        heroImage: {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE57JmgJM9JaPNx9-Lx3tDb2eIXtvyh4ZlOFBdq1XqESVVYYRYCbe5_64wI_McXt0IAdtfdcuz7uNKPeoXj5m7ln56znuoo7B71gIRxGYAyhFje6W0Ar-zVs4eHhBJsrsu_CmccuD7I1OT1YdOxntjmpx7h3GKT-U9eAYmK8L_une2ggxmoEuZdA_DEQHSLUT9qghydoPpoZIKO8qpNV6oY9U9k_UnEE0aVxUc4CTAV3fQkRxVoAN6DGu5ZoXlDNQdLMTH4c90M3p-',
            alt: 'Apple ve Samsung cihazlar yetkili servis güvencesiyle',
            caption: {
                title: 'Apple & Samsung',
                subtitle: 'Yetkili Servis Güvencesiyle',
            },
        },
    },

    trustMetrics: [
        { icon: 'store', value: '1000+', label: 'Yetkili Servis Noktası' },
        { icon: 'schedule', value: '<24 saat', label: 'Ortalama Onay Süresi' },
        { icon: 'verified', value: '%98', label: 'Müşteri Memnuniyeti' },
        { icon: 'handshake', value: 'Apple & Samsung', label: 'Yetkili Servis Ortağı' },
    ],

    dualCta: {
        title: 'Ne Yapmak İstiyorsunuz?',
        subtitle: 'Hızlıca hedefinize ulaşın',
        protect: {
            icon: 'shield',
            title: 'Cihazımı Korumak İstiyorum',
            description: 'Yeni bir koruma planı satın alın ve cihazınızı güvence altına alın.',
            buttonText: 'Teklif Al',
            href: '/teklif',
        },
        claim: {
            icon: 'report_problem',
            title: 'Hasar Bildirmek İstiyorum',
            description: 'Mevcut poliçeniz için hasar kaydı oluşturun. 3 dakikada tamamlayın.',
            buttonText: 'Hasar Bildir',
            href: '/hasar/bildir',
        },
    },

    quickActions: [
        {
            title: 'Hasar Bildir',
            subtitle: '3 dakikada başvur',
            icon: 'report_problem',
            href: '/hasar/bildir',
            variant: 'primary' as const,
        },
        {
            title: 'Hasar Takibi',
            subtitle: 'Talep durumunu gör',
            icon: 'track_changes',
            href: '/hesabim/hasarlar',
            variant: 'purple' as const,
        },
        {
            title: 'Planları İncele',
            subtitle: 'Sana uygun paketler',
            icon: 'article',
            href: '/planlar',
            variant: 'green' as const,
        },
    ],

    deviceCategories: [
        {
            name: 'Akıllı Telefon',
            popular: true,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_BK--b7Qg8WYYxXCgoyIB8bcYfqn-ZUUqt9W85AE_ggMmysI3U6Wu5vlaQXmlNZXjwp7VUUOTmUDo4Osb5WRxG1OjoLAaB7HZQnagrOH2B-Z5aXgDD8xm7vX7BUnJhCA1g3ugxnRhkDCo3G7hWqpsWTI9zNpPFdeFJDpGW3PUM7WOBG9xTCK9RpRJnMsmEod-r6rC992S5dDWgacJ-v4L1JfobFnxjx4-XJiUtd86wDolX8HZWoEU_YY385t2jRaCtcIpKmehXkPt',
            coverage: ['Ekran kırılması', 'Sıvı teması', 'Düşme hasarı'],
        },
        {
            name: 'Laptop',
            popular: false,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA74lmYx1O1vEnP5DJcHoiRepjepvIWIrfZwLPAvYFx8O7mA1G8tGIkcYKby7ejP3qG7i4oMl_J_RXxgmIphhzqfWeDLblkdOTteaD6zUn2wh92lSOcyDvfanTdGZctnX5sSgNLIajijCNA5KJEJpx2WdS-k3zhTgTCGao068t9PmlsxVjgjTHsIOK44svxGjnjremdrNpQJSSpXemaLRoLC9WUmXxUvyhvJc5ZUlHabvhA3gYeIEpIChahX7HkkJEZEzejDoFywiEd',
            coverage: ['Ekran kırılması', 'Klavye arızası', 'Batarya değişimi'],
        },
        {
            name: 'Tablet',
            popular: false,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD120jj1SjIKx_IBOLYk7gPo0XhGhqjlZ5odZNf84vappxWx8VKyJg5ugCDbTu6o5NzkAS8WWQIaJw8hwtUwBooBaHssL1lpXruKtzcEYSOOi7KIdP0qVu1nqD_AQX8vIVTtThzoVMbGOxqt0snHP0hWn30ndydrgssNPC4c6S-uRmgdM1JvnTyYjMSdIl0gR9cyZH04SEjdBDG4RmCPPa_MYauLzsE5-fUUBe7RvloAjz7ZxvbpOHuwcj08nGWzRgl7tKxMjzh-a2b',
            coverage: ['Ekran kırılması', 'Sıvı teması'],
        },
        {
            name: 'Akıllı Saat',
            popular: false,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuNPlhrCtqc3gtBChw3l4pyzlweIZEoxc6BR4voKyO7_EF-yESWDyImJw2OEus22nrBfcZag-3ZeiIFaQGNhUc_X6K0kKfIUyj28tzsAEKE5mqUWt8u-7GltiSnymWEl8AwvJt4s6aJI4Gu_TJ0WxQnqVnHRd-f_92wRc68ujz2Afbib9TUBiIoB2PM9RyqNVoaY8kduNwmGavOH3Bo7AvwavkzT_tTSqtxfs2R9VnFr7HKxP0Zy9-_tBiqc7AiC-z795tIzXyMO2Q',
            coverage: ['Cam kırılması', 'Batarya değişimi'],
        },
        {
            name: 'Oyun Konsolu',
            popular: false,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHcl0-ZF8GDUMExq2e8XOoDQvxBrFIBoGIovuqgPGxZcvCZGkaGF5znwenKk_52VVtkCvNZJ7N4kGQN2nSe7-LbWsPeCRd-xp5Gr584VBslrwOOvdFSsbm8TDoOnIWWtPb1WBEqttXARpiuSluHeBBSLgE0aG3wcw45jCRECYKETlNZWDJEhv9J0osXkkKyXSTeBfVUtUAvxXyLOFcJkFoVZg9TlSSQgC6iI5VA2q-MzIFrdydkOovogPVMSe0atjh8Ztaf__VHLhG',
            coverage: ['Mekanik arıza', 'Disk okuyucu'],
        },
    ],

    coveragePlans: [
        {
            id: 'extended_warranty',
            name: 'Uzatılmış Garanti',
            price: 49,
            description: 'Üretici garantisi bittikten sonra başlar.',
            icon: 'schedule',
            popular: false,
            features: ['+1 veya +2 yıl ek süre', 'Mekanik arızalar', 'Elektriksel arızalar'],
            buttonText: 'İncele',
            href: '/planlar',
        },
        {
            id: 'accidental_damage',
            name: 'Kazaen Hasar',
            price: 99,
            description: 'Günlük kazalara karşı tam güvence.',
            icon: 'warning',
            popular: true,
            features: ['Ekran kırılması', 'Sıvı teması', 'Düşme ve çarpma', 'Orijinal parça değişimi'],
            buttonText: 'Hemen Al',
            href: '/teklif',
        },
        {
            id: 'full_coverage',
            name: 'Tam Koruma',
            price: 149,
            description: 'Hırsızlık dahil en kapsamlı paket.',
            icon: 'shield',
            popular: false,
            features: ['Kazaen Hasar kapsamı', 'Uzatılmış Garanti kapsamı', 'Hırsızlık koruması'],
            buttonText: 'İncele',
            href: '/planlar',
        },
    ],

    howItWorks: {
        title: 'Nasıl Çalışır?',
        steps: [
            {
                num: '1',
                title: 'Cihazını Seç',
                description: 'Korumak istediğin elektronik cihazın marka ve modelini sisteme gir.',
                icon: 'smartphone',
            },
            {
                num: '2',
                title: 'Paketi Belirle',
                description: 'İhtiyaçlarına en uygun koruma paketini seç ve ödemeni güvenle tamamla.',
                icon: 'verified_user',
            },
            {
                num: '3',
                title: 'Hasar Bildir',
                description: 'Hasar durumunda tek tıkla talep oluştur, 24 saat içinde geri dönüş al.',
                icon: 'report_problem',
            },
        ],
    },

    formLabels: {
        deviceType: 'Cihaz Tipi',
        deviceValue: 'Cihaz Bedeli (TL)',
        deviceTypePlaceholder: 'Seçin',
        deviceValuePlaceholder: 'Örn: 45000',
        deviceTypes: [
            { value: 'phone', label: 'Akıllı Telefon' },
            { value: 'laptop', label: 'Laptop' },
            { value: 'tablet', label: 'Tablet' },
            { value: 'watch', label: 'Akıllı Saat' },
        ],
    },

    seo: {
        title: 'Waypla - Elektronik Cihaz Koruma Platformu',
        description: 'Türkiye\'nin en kapsamlı elektronik cihaz koruma platformu. Akıllı telefon, laptop, tablet için sigorta ve garanti uzatma.',
    },
} as const;

// Export type for type-safe usage
export type LandingContent = typeof landingContent;
