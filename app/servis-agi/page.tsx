import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ServiceNetworkPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-24 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-xs mb-4 uppercase tracking-wider">Yetkili Servis Ağı</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white leading-[1.1] mb-4">
                Cihazınız İçin En Yakın <span className="text-accent">Servis Noktası</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Cihazınız için en yakın ve en hızlı teknik servisi bulun. Garantili onarım ve orijinal parça değişimi sağlayan servis noktaları hizmetinizde.
              </p>
            </div>

            {/* Filter Form */}
            <div className="bg-background-light dark:bg-[#1a2634] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <label className="flex flex-col w-full">
                  <p className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal pb-2">İl Seçiniz</p>
                  <select className="w-full h-12 rounded-lg bg-white dark:bg-[#22303e] border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white px-4 text-sm focus:ring-2 focus:ring-accent focus:outline-none" defaultValue="">
                    <option disabled value="">İstanbul</option>
                    <option value="ankara">Ankara</option>
                    <option value="izmir">İzmir</option>
                  </select>
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal pb-2">İlçe Seçiniz</p>
                  <select className="w-full h-12 rounded-lg bg-white dark:bg-[#22303e] border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white px-4 text-sm focus:ring-2 focus:ring-accent focus:outline-none" defaultValue="">
                    <option disabled value="">Kadıköy</option>
                    <option value="besiktas">Beşiktaş</option>
                    <option value="sisli">Şişli</option>
                  </select>
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal pb-2">Cihaz Tipi</p>
                  <select className="w-full h-12 rounded-lg bg-white dark:bg-[#22303e] border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white px-4 text-sm focus:ring-2 focus:ring-accent focus:outline-none" defaultValue="">
                    <option disabled value="">Cep Telefonu</option>
                    <option value="tablet">Tablet</option>
                    <option value="laptop">Dizüstü Bilgisayar</option>
                  </select>
                </label>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-accent hover:bg-orange-600 text-white text-base font-bold transition-colors shadow-md shadow-accent/30">
                  <span className="material-symbols-outlined mr-2 text-xl">search</span>
                  <span className="truncate">Servis Bul</span>
                </button>
              </div>
            </div>

            {/* Service List */}
            <div className="max-w-4xl mx-auto space-y-4 mb-12">
              {[
                { name: "TechPro Servis Merkezi", location: "Caferağa Mah. Moda Cad. No: 12, Kadıköy/İstanbul", phone: "0216 555 00 00", verified: true, badges: ["Apple Yetkili", "Samsung"], features: ["1 Saatte Ekran Değişimi", "6 Ay Garanti"] },
                { name: "MobilFix Kadıköy", location: "Osmanağa Mah. Söğütlüçeşme Cad. No: 45, Kadıköy/İstanbul", phone: "0216 444 22 11", verified: false, badges: ["Huawei", "Xiaomi"], features: ["Kurye Hizmeti"] },
                { name: "Genpa Teknik Servis", location: "Rasimpaşa Mah. Rıhtım Cad. No: 88, Kadıköy/İstanbul", phone: "0216 333 99 88", verified: true, badges: ["Çoklu Marka"], features: ["Premium Hizmet"] },
              ].map((service, i) => (
                <div key={i} className="group bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:border-accent/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-[#111418] dark:text-white group-hover:text-accent transition-colors">{service.name}</h3>
                        {service.verified && <span className="material-symbols-outlined text-accent text-xl" title="Onaylı Servis">verified</span>}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {service.badges.map((badge, j) => (
                          <span key={j} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature, j) => (
                      <span key={j} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-800">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-gray-400 mt-0.5">location_on</span>
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-400">call</span>
                      <span>{service.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 h-10 flex items-center justify-center rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors">
                      Yol Tarifi
                    </button>
                    <button className="h-10 px-4 flex items-center justify-center rounded-lg bg-accent text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm shadow-accent/30">
                      Randevu Al
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}



