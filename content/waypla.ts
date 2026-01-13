/**
 * Waypla Brand Content - Source of Truth
 * TODO: Replace with actual long Waypla text when provided
 */

export const waypla = {
  brandName: "Waypla",

  // Core messaging
  tagline: "Teknolojini Sigortala",
  valueProp: "Cihazın güvende, hasar süreci de öyle. Waypla ile Türkiye'nin en kapsamlı elektronik cihaz koruma platformunu keşfedin.",

  // How it works steps
  howItWorksSteps: [
    {
      title: "Cihazını Seç",
      description: "Telefon, laptop, tablet veya akıllı saatini seçerek teklif almaya başla."
    },
    {
      title: "Teklifini İncele",
      description: "Kapsamlı teminat seçenekleri ve fiyatları karşılaştır."
    },
    {
      title: "Güvenceye Al",
      description: "Anında poliçe oluştur ve cihazını koruma altına al."
    },
    {
      title: "Hasar Bildir",
      description: "Hasar durumunda dijital süreçle hızlı çözüm al."
    }
  ],

  // Maintenance packages
  maintenancePackagesCopy: {
    hero: "Cihazınızın Ömrünü Uzatın",
    description: "Profesyonel bakım paketleri ile cihazınızın performansını koruyun ve beklenmedik arızalara karşı hazırlıklı olun.",
    packages: [
      {
        name: "Starter Paket",
        description: "Temel bakım ve temizlik hizmetleri",
        features: ["Yazılım güncellemesi", "Temel temizlik", "Performans optimizasyonu"],
        interval: "6 aylık"
      },
      {
        name: "Plus Paket",
        description: "Gelişmiş bakım ve onarım hizmetleri",
        features: ["Starter paket içerikleri", "Donanım kontrolü", "Yedekleme servisi", "Uzaktan destek"],
        interval: "3 aylık"
      },
      {
        name: "Premium Paket",
        description: "Tam kapsamlı bakım ve garanti uzatma",
        features: ["Plus paket içerikleri", "Parça değişimi", "Garanti uzatma", "7/24 öncelikli destek"],
        interval: "Aylık"
      }
    ],
    faq: [
      {
        question: "Bakım paketleri ne sıklıkla yenilenir?",
        answer: "Her paket kendi periyoduna göre otomatik olarak yenilenir. İptal etmek istediğinizde kolayca durdurabilirsiniz."
      },
      {
        question: "Hangi cihazlar için geçerlidir?",
        answer: "Telefon, tablet, laptop ve akıllı saatler için geçerlidir. Premium paket diğer cihaz türleri için de kullanılabilir."
      },
      {
        question: "Servis ağınızda bakım yapılır mı?",
        answer: "Evet, anlaşmalı servis merkezlerimizde profesyonel bakım hizmetleri sunulmaktadır."
      },
      {
        question: "Bakım paketi ile sigorta arasındaki fark nedir?",
        answer: "Bakım paketleri düzenli bakım ve önleyici hizmetler sunarken, sigorta hasar durumlarını kapsar. İkisini birlikte kullanmanız önerilir."
      },
      {
        question: "Paketi istediğim zaman iptal edebilir miyim?",
        answer: "Evet, dilediğiniz zaman iptal edebilirsiniz. Kalan süreye göre iade yapılır veya bir sonraki dönemde ücret alınmaz."
      },
      {
        question: "Uzaktan destek nasıl çalışır?",
        answer: "Uzman ekibimiz güvenli uzaktan bağlantı ile cihazınızdaki yazılımsal sorunları çözebilir ve ayarlarınızı optimize edebilir."
      }
    ]
  },

  // Claims process
  claimsCopy: {
    title: "Hasar Bildirimi",
    description: "Hasar durumunda dijital süreçle hızlı ve şeffaf çözüm.",
    steps: [
      "Hasar detaylarını girin",
      "Fotoğraf/video ekleyin",
      "Talebiniz değerlendirilir",
      "Onarım süreci başlar"
    ],
    claimTypes: [
      { value: "screen_crack", label: "Ekran Kırılması" },
      { value: "liquid_damage", label: "Sıvı Teması" },
      { value: "not_working", label: "Çalışmıyor" },
      { value: "physical_damage", label: "Fiziksel Hasar" },
      { value: "theft", label: "Hırsızlık" },
      { value: "other", label: "Diğer" }
    ]
  },

  // Account management
  accountCopy: {
    welcome: "Waypla hesabınıza hoş geldiniz",
    description: "Cihazlarınızı, poliçelerinizi ve hasar taleplerinizi yönetin.",
    profileEdit: {
      title: "Profil Düzenle",
      description: "Kişisel bilgilerinizi ve adresinizi güncelleyin."
    }
  },

  // Device categories
  deviceCategories: [
    { value: "phone", label: "Akıllı Telefon", icon: "smartphone" },
    { value: "tablet", label: "Tablet", icon: "tablet" },
    { value: "laptop", label: "Laptop", icon: "laptop" },
    { value: "watch", label: "Akıllı Saat", icon: "watch" },
    { value: "other", label: "Diğer", icon: "devices" }
  ],

  // Contact information
  contact: {
    email: "destek@waypla.com",
    phone: "+90 (216) 555 00 00",
    address: "İstanbul, Türkiye"
  }
} as const;

// TODO: Replace all content above with actual long Waypla text when provided
// TODO: Add more sections: about, privacy, terms, etc.
