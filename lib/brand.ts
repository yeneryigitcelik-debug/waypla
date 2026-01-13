/**
 * Brand configuration for CihazGüvence
 * All brand-related text and settings should be managed from here
 */

export const brand = {
  name: "CihazGüvence",
  tagline: "Cihazını güvenceye al – Anında teklif",
  description: "Bağımsız ve dijital-first cihaz sigortası platformu",
  email: "destek@cihazguvence.com",
  phone: "+90 (212) 000 00 00",
  address: "İstanbul, Türkiye",
  
  // Value propositions
  valueProps: [
    {
      title: "Kapsam",
      description: "Geniş teminat kapsamı ile cihazınızı koruyun",
    },
    {
      title: "Hızlı Hasar",
      description: "Dijital hasar yönetimi ile hızlı çözüm",
    },
    {
      title: "Şeffaf Koşullar",
      description: "Net teminat, muafiyet ve hariç haller",
    },
  ],

  // Coverage types
  coverageTypes: {
    EXTENDED_WARRANTY: "Uzatılmış Garanti",
    ACCIDENTAL_DAMAGE: "Kazaen Hasar",
    FULL_COVERAGE: "Tam Koruma",
    THEFT_LOSS: "Hırsızlık-Kayıp",
  },

  // Partner types
  partnerTypes: {
    RETAIL: "Perakende",
    ECOMMERCE: "E-ticaret",
    OPERATOR: "Operatör",
    BANK: "Banka",
  },
} as const;




